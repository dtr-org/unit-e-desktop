/*
 * Copyright (C) 2017-2018 The Particl developers
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program; if not, write to the Free Software Foundation, Inc.,
 * 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 */

import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Log } from 'ng2-logger'

import { IpcListener, ObservableFactoryFunction, Receiver, ListenerEvent } from './ipc.types';

// RxIPC related stuffs


@Injectable()
export class IpcService {

  log: any = Log.create('ipc.service');

  /* Listeners on the renderer */
  private listenerCount: number = 0;
  listeners: { [id: string]: boolean } = {};

  constructor(public zone: NgZone) {

    // if not electron, quit
    if (!window.electron) {
      return;
    }

    // Respond to checks if a listener is registered
    window.ipc.on('rx-ipc-check-listener', (event, channel) => {
      const replyChannel = 'rx-ipc-check-reply:' + channel;
      if (this.listeners[channel]) {
        event.sender.send(replyChannel, true);
      } else {
        event.sender.send(replyChannel, false);
      }
    });
  }

  checkRemoteListener(channel: string, receiver: Receiver) {
    const target = receiver == null ? window.ipc : receiver;
    return new Promise((resolve, reject) => {
      window.ipc.once('rx-ipc-check-reply:' + channel, (event, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(false);
        }
      });
      target.send('rx-ipc-check-listener', channel);
    });
  }

  public cleanUp() {
    window.ipc.removeAllListeners('rx-ipc-check-listener');
    Object.keys(this.listeners).forEach((channel) => {
      this.removeListeners(channel);
    });
  }

  registerListener(channel: string, observableFactory: ObservableFactoryFunction) {
    this.listeners[channel] = true;
    window.ipc.on(channel, function openChannel(event: ListenerEvent, subChannel: string, ...args: any[]) {
        // Save the listener function so it can be removed
        const replyTo = event.sender;
        const observable = observableFactory(...args);
        observable.subscribe(
          (data) => {
            replyTo.send(subChannel, 'n', data);
          },
          (err) => {
            replyTo.send(subChannel, 'e', err);
          },
          () => {
            replyTo.send(subChannel, 'c');
          }
        );
    });
  }

  removeListeners(channel: string) {
    window.ipc.removeAllListeners(channel);
    delete this.listeners[channel];
  }

  runCommand(channel: string, receiver: Receiver = null, ...args: any[]): Observable<any> {
    const self = this;
    const subChannel = channel + ':' + this.listenerCount;
    this.listenerCount++;
    const target = receiver == null ? window.ipc : receiver;

    target.send(channel, subChannel, ...args);
    return new Observable((observer) => {
      this.checkRemoteListener(channel, receiver)
        .catch(() => {
          // observer.error('Invalid channel: ' + channel);
        });
      window.ipc.on(subChannel, function listener(event: Event, type: string, data: Object) {
        self.zone.run(() => {
          switch (type) {
            case 'n':
              observer.next(data);
              break;
            case 'e':
              observer.error((<any>data).error ? (<any>data).error : data);
              break;
            case 'c':
              observer.complete();
          }
          // Cleanup
          return () => {
            // TODO: Why is this not being called & when should it be?
            window.ipc.removeListener(subChannel, listener);
          };
        });
      });
    });
  }

  private _getListenerCount(channel: string) {
    return window.ipc.listenerCount(channel);
  }

}
