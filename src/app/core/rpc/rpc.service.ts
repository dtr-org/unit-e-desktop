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
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Log } from 'ng2-logger';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { map, catchError } from 'rxjs/operators';

import { IpcService } from '../ipc/ipc.service';
import { environment } from '../../../environments/environment';
import { Commands } from './commands';
import {
  BumpFeeResult,
  CoinControl,
  Outputs,
  ProposerStatus,
  UnspentOutput,
} from './rpc-types';

const MAINNET_PORT = 51735;
const TESTNET_PORT = 51935;
const HOSTNAME = 'localhost';

declare global {
  interface Window {
    electron: boolean;
  }
}

/**
 * The RPC service that maintains a single connection to the united daemon.
 *
 * It has two important functions: call and register.
 */
@Injectable()
export class RpcService implements OnDestroy {

  private log: any = Log.create('rpc.service');
  private destroyed: boolean = false;

  /**
   * IP/URL for daemon (default = localhost)
   */
  // private hostname: String = HOSTNAME; // TODO: URL Flag / Settings
  private hostname: String = environment.uniteHost;

  /**
   * Port number of of daemon (default = 51935)
   */
  // private port: number = TESTNET_PORT; // TODO: Mainnet / testnet flag...
  private port: number = environment.unitePort;

  // note: basic64 equiv= dGVzdDp0ZXN0
  private username: string = 'test';
  private password: string = 'test';

  public isElectron: boolean = false;

  constructor(
    private _http: HttpClient,
    private _ipc: IpcService
  ) {
    this.isElectron = window.electron
  }

  ngOnDestroy() {
    this.destroyed = true;
  }

  /**
   * The call method will perform a single call to the united daemon and perform a callback to
   * the instance through the function as defined in the params.
   *
   * @param {string} method  The JSON-RPC method to call, see ```./united help```
   * @param {Array<Any>} params  The parameters to pass along with the JSON-RPC request.
   * The content of the array is of type any (ints, strings, booleans etc)
   *
   * @example
   * ```JavaScript
   * this._rpc.call('listtransactions', [0, 20]).subscribe(
   *              success => ...,
   *              error => ...);
   * ```
   */
  call(method: Commands, params?: Array<any> | null): Observable<any> {
    if (this.isElectron) {
      return this._ipc.runCommand('rpc-channel', null, method, params).pipe(
        map(response => {
          return response && (response.result !== undefined)
                      ? response.result
                      : response;
        })
      );
    } else {
      // Running in browser, delete?
      const postData = JSON.stringify({
        method: method,
        params: params,
        id: 1
      });


      const headerJson = {
       'Content-Type': 'application/json',
       'Authorization': 'Basic ' + btoa(`${this.username}:${this.password}`),
       'Accept': 'application/json',
      };
      const headers = new HttpHeaders(headerJson);

      return this._http
        .post(`http://${this.hostname}:${this.port}`, postData, { headers: headers })
          .map((response: any) => response.result)
          .catch(error => {
            let err: string;
            if (typeof error._body === 'object') {
              err =  error._body
            } else if (error._body) {
              err = JSON.parse(error._body);
            } else {
              err = error.error && error.error.error ? error.error.error : error.message;
            }

            return Observable.throw(err)
          })
    }
  }

  addressBookInfo() {
    return this.call(Commands.ADDRESSBOOKINFO);
  }

  bumpFee(txid: string, options: any = null, testFee: boolean = false): Observable<BumpFeeResult> {
    return this.call(Commands.BUMPFEE, [txid, options, testFee]);
  }

  filterAddresses(offset?: number, count?: number, sort_code?: 0 | 1, search?: string, match_owned?: 0 | 1 | 2) {
    offset = offset || 0;
    count = count || null;
    sort_code = sort_code || 0;
    search = search || '';
    match_owned = match_owned || 0;

    return this.call(Commands.FILTERADDRESSES, [
      offset, count, sort_code, search, match_owned
    ]);
  }

  getTransacion(txid: string): Observable<any> {
    return this.call(Commands.GETTRANSACTION, [txid]);
  }

  listUnspent(
    minconf: number = 1, maxconf: number = 9999999, addresses: any[] = [], includeUnsafe: boolean = false, queryOptions: any = null
  ): Observable<UnspentOutput[]> {
    return this.call(Commands.LISTUNSPENT, [minconf, maxconf, addresses, includeUnsafe, queryOptions]);
  }

  proposerStatus(): Observable<ProposerStatus> {
    return this.call(Commands.PROPOSERSTATUS);
  }

  sendtypeto(
    typein: string, typeout: string, outputs: Outputs[], comment?: string, commentTo?: string,
    testFee?: boolean, coinControl?: CoinControl
  ) {
    comment = comment || null;
    commentTo = commentTo || null;
    testFee = testFee || false;
    coinControl = coinControl || null;

    return this.call(Commands.SENDTYPETO, [
      typein, typeout, outputs, comment, commentTo, testFee, coinControl
    ]);
  }
}

export { Commands } from './commands';
