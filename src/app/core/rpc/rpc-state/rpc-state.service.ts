/*
 * Copyright (C) 2017-2018 The Particl developers
 * Copyright (C) 2018 The Unit-e developers
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

import { Injectable, OnDestroy } from '@angular/core';
import { Log } from 'ng2-logger';
import { Subject } from 'rxjs';


import { StateService } from 'app/core/state/state.service';
import { RpcService, Commands } from 'app/core/rpc/rpc.service';
import { IpcService } from '../../ipc/ipc.service';

@Injectable()
export class RpcStateService extends StateService implements OnDestroy {

  private log: any = Log.create('rpc-state.class');
  private destroyed: boolean = false;

  private _enableState: boolean = true;

  /** errors gets updated everytime the stateCall RPC requests return an error */
  public errorsStateCall: Subject<any> = new Subject<any>();

  constructor(private _rpc: RpcService, private _ipc: IpcService) {
    super();

    this.register(Commands.ADDRESSBOOKINFO, 1000, null, true);
    this.register(Commands.GETWALLETINFO, 1000);
    this.register(Commands.PROPOSERSTATUS, 1000);
    this.register(Commands.GETBLOCKCHAININFO, 5000);
    this.register(Commands.GETNETWORKINFO, 10000);

    // TODO: get rid of these
    this.walletLockedState();
    this.initWalletState();
  }

  /**
   * Make an RPC Call that saves the response in the state service.
   *
   * @param {string} method  The JSON-RPC method to call, see ```./united help```
   *
   * The rpc call and state update will only take place while `this._enableState` is `true`
   *
   * @example
   * ```JavaScript
   * this._rpcState.stateCall('getwalletinfo');
   * ```
   */
  stateCall(method: Commands): void {
    if (!this._enableState) {
      return;
    } else {
      this._rpc.call(method)
      .subscribe(
        response => this.stateCallSuccess(method, response),
        error => this.stateCallError(method, error, false));
    }
  }

  /** Register a state call, executes every X seconds (timeout) */
  register(method: Commands, timeout: number, params?: Array<any> | null, once?: boolean): void {
    if (timeout) {
      let firstError = true;

      // loop procedure
      const _call = () => {
        if (this.destroyed) {
          // RpcState service has been destroyed, stop.
          return;
        }
        if (!this._enableState) {
          // re-start loop after timeout - keep the loop going
          setTimeout(_call, timeout);
          return;
        }
        this._rpc.call(method, params)
          .subscribe(
            success => {
              this.stateCallSuccess(method, success);

              if (!once) {
                // re-start loop after timeout
                setTimeout(_call, timeout);
              }
            },
            error => {
              this.stateCallError(method, error, firstError);

              setTimeout(_call, firstError ? 250 : error.status === 0 ? 500 : 10000);
              firstError = false;
            });
      };

      // initiate loop
      _call();
    }
  }

  /** Updates the state whenever a state call succeeds */
  private stateCallSuccess(method: string, response: any) {
    // no error
    this.errorsStateCall.next({
      error: false,
      electron: this._rpc.isElectron
    });

    this.set(method, response);
  }

  /** Updates the state when the state call errors */
  private stateCallError(method: string, error: any, firstError: boolean) {
    this.log.er(`stateCallError(): RPC Call ${method} returned an error:`, error);

    // if not first error, show modal
    if (!firstError) {
      this.errorsStateCall.next({
        error: error.target ? error.target : error,
        electron: this._rpc.isElectron
      });
    }
  }

  ngOnDestroy() {
    this.destroyed = true;
  }

  // TODO: get rid of these some day..
  private walletLockedState() {
    this.observe('getwalletinfo', 'unlocked_until')
      .takeWhile(() => !this.destroyed)
      .subscribe(unlocked => {
        this.log.d(' [rm] updating locked state maybe');
        this.set('locked', unlocked === 0);
      });
  }

  // TODO: get rid of this after improve-router
  private initWalletState() {
    this.observe('addressbookinfo').subscribe(response => {
      // check if account is active
      if (response.total === 0) {
        this.set('ui:walletInitialized', false);
      } else {
        this.set('ui:walletInitialized', true);
      }
    }, error => this.log.er('RPC Call returned an error', error));
}
}
