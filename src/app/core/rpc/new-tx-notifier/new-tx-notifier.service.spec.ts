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

import { TestBed, inject } from '@angular/core/testing';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { RpcModule } from '../rpc.module';
import { NewTxNotifierService } from './new-tx-notifier.service';
import { CoreModule } from 'app/core/core.module';

describe('NewTxNotifierService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        CoreModule.forRoot(),
        // RpcModule.forRoot()
      ],
      providers: [NewTxNotifierService]
    });
  });

  it('should be created', inject([NewTxNotifierService], (service: NewTxNotifierService) => {
    expect(service).toBeTruthy();
  }));
});
