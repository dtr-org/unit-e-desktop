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

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as assert from 'assert';

import mockgetpeerinfo from './mock-data/getpeerinfo.mock';
import mocklistunspent from './mock-data/listunspent.mock';
import mockproposerstatus from './mock-data/proposerstatus.mock';
import mockgetnetworkinfo from './mock-data/getnetworkinfo.mock'
import mockgetwalletinfo from './mock-data/getwalletinfo.mock'
import mockaddressbookinfo from './mock-data/addressbookinfo.mock'
import mockfilteraddresses from './mock-data/filteraddresses.mock'
import mockfiltertransactions from './mock-data/filtertransactions.mock';
import { OUR_ADDRESS, THEIR_ADDRESS, mock_our_addrinfo, mock_their_addrinfo } from './mock-data/validateaddress.mock';
import mockwalletinfo from './mock-data/getwalletinfo.mock';

import { RpcService } from '../../../core/core.module';

// TODO: create & move into the testing module
// TODO: add more calls, currently only used in SendComponent

@Injectable()
export class RpcMockService extends RpcService {

  constructor() { super(null, null); }

  private getMock(method: string, params?: Array<any> | null): any {
      switch (method) {
        case 'getpeerinfo':
          assertNoParameters(method, params);
          return mockgetpeerinfo;
        case 'proposerstatus':
          assertNoParameters(method, params);
          return mockproposerstatus;
        case 'getnetworkinfo':
          assertNoParameters(method, params);
          return mockgetnetworkinfo;
        case 'getwalletinfo':
          assertNoParameters(method, params);
          return mockgetwalletinfo;
        case 'addressbookinfo':
          assertNoParameters(method, params);
          return mockaddressbookinfo;
        case 'filteraddresses':
          assertArrayElementCount(method, params, 0, 5);
          return mockfilteraddresses;
        case 'filtertransactions':
          assertArrayElementCount(method, params, 0, 1);
          return mockfiltertransactions;
        case 'listunspent':
          assertArrayElementCount(method, params, 0, 5);
          return mocklistunspent;
        case 'validateaddress':
          assertArrayElementCount(method, params, 1);
          if (params[0] === OUR_ADDRESS) {
            return mock_our_addrinfo;
          } else {
            return mock_their_addrinfo;
          }
      }

      return true;
  }

  call(method: string, params?: Array<any> | null): Observable<any> {
    return Observable.create(observer => {
      // Return the result asynchronously to simulate real RPC
      setTimeout(() => {
        observer.next(this.getMock(method, params));
        observer.complete();
      });
    });
  }
}


function assertNoParameters(method: string, params: Array<any> | null | undefined): void {
  assert.ok(
    (params instanceof Array && params.length === 0) || params === null || typeof params === 'undefined',
    `${method} takes no parameters`
  );
}


function assertArrayElementCount(
  method: string, params: Array<any> | null | undefined, minParams: number, maxParams?: number
): void {
  if (maxParams === undefined) {
    maxParams = minParams;
  }

  assert.ok(params instanceof Array, `${method} was not passed any parameters`);
  assert.ok(
    (minParams <= params.length && params.length <= maxParams),
    `${method} was passed ${params.length} paramers, must be between ${minParams} and ${maxParams}`
  );
}

export { OUR_ADDRESS, THEIR_ADDRESS };
