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
import { Observable } from 'rxjs';

import mockgetpeerinfo from './mock-data/getpeerinfo.mock';
import mockproposerstatus from './mock-data/proposerstatus.mock';
import { RpcService } from '../../../core/core.module';

// TODO: create & move into the testing module
// TODO: add more calls, currently only used in SendComponent

@Injectable()
export class RpcMockService extends RpcService {

  constructor() { super(null, null); }

  call(method: string, params?: Array<any> | null): Observable<any> {
    return Observable.create(observer => {

      if (method === 'getpeerinfo') {
        observer.next(mockgetpeerinfo);
      } else if (method === 'proposerstatus') {
        observer.next(mockproposerstatus);
      } else {
        observer.next(true)
      }

      observer.complete();
    });
  }

}
