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

import mockgetpeerinfo from './mock-data/getpeerinfo.mock';
import mocklistunspent from './mock-data/listunspent.mock';
import mockproposerstatus from './mock-data/proposerstatus.mock';
import mockgetnetworkinfo from './mock-data/getnetworkinfo.mock'
import mockgetwalletinfo from './mock-data/getwalletinfo.mock'
import mockaddressbookinfo from './mock-data/addressbookinfo.mock'
import mockfilteraddresses from './mock-data/filteraddresses.mock'
import mockfiltertransactions from './mock-data/filtertransactions.mock';
import { RpcService } from '../../../core/core.module';

// TODO: create & move into the testing module
// TODO: add more calls, currently only used in SendComponent

@Injectable()
export class RpcMockService extends RpcService {

  constructor() { super(null, null); }

  private getMock(method: string): any {
      switch (method) {
        case 'getpeerinfo':
          return mockgetpeerinfo;
        case 'proposerstatus':
          return mockproposerstatus;
        case 'getnetworkinfo':
          return mockgetnetworkinfo;
        case 'getwalletinfo':
          return mockgetwalletinfo;
        case 'addressbookinfo':
          return mockaddressbookinfo;
        case 'filteraddresses':
          return mockfilteraddresses;
        case 'filtertransactions':
          return mockfiltertransactions;
        case 'listunspent':
          return mocklistunspent;
      }

      return true;
  }

  call(method: string, params?: Array<any> | null): Observable<any> {
    return Observable.create(observer => {
      // Return the result asynchronously to simulate real RPC
      setTimeout(() => {
        observer.next(this.getMock(method));
        observer.complete();
      });
    });
  }

}
