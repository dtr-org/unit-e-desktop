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

import { Injectable } from '@angular/core';
import { Log } from 'ng2-logger'
import { Observable } from 'rxjs/Observable';

import { IpcService } from '../ipc/ipc.service';

@Injectable()
export class ZmqService {

  log: any = Log.create('zmq.service');

  constructor(private _ipc: IpcService) {
    this.log.d('Registering ipc listener');
    if (window.electron) {
      // Register a listener on the channel "zmq" (ipc)
      this._ipc.registerListener('zmq', this.zmqListener.bind(this));
    }
   }

  /*
   This is called every incomming message on ZMQ channel.
   node -> GUI (and reply back)
  */
   zmqListener(...args: any[]): Observable<any> {
    return Observable.create(observer => {
        this.log.d('ZMQ pushed a new message, yay! data: ' + args);
        observer.next('Thanks ZMQ, here is some data back you good ol\' friend');
        observer.complete();
      });
  }
}
