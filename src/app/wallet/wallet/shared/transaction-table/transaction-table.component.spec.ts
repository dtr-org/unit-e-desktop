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

import { async, ComponentFixture, TestBed, fakeAsync, tick, inject } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { RpcModule, RpcService } from '../../../../core/rpc/rpc.module';
import { SharedModule } from '../../../shared/shared.module';
import { WalletModule } from '../../../wallet/wallet.module';
import { CoreModule } from '../../../../core/core.module';

import { TransactionsTableComponent } from './transaction-table.component';
import { RpcMockService } from 'app/_test/core-test/rpc-test/rpc-mock.service';


describe('TransactionTableComponent', () => {
  let component: TransactionsTableComponent;
  let fixture: ComponentFixture<TransactionsTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        WalletModule.forRoot(),
        RpcModule.forRoot(),
        CoreModule.forRoot(),
        BrowserAnimationsModule
      ],
      providers: [
        { provide: RpcService, useClass: RpcMockService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get log', () => {
    expect(component.log).toBeDefined();
  });

  it('should get txService', () => {
    expect(component.txService).toBeDefined();
  });

  it('should display a list of transactions', () => {

    const promise = new Promise((resolve, reject) => {
      const result = component.txService.loadTransactions();
      result.subscribe(() => {
          fixture.detectChanges();

          const nav = fixture.nativeElement;
          const amount = nav.querySelectorAll('.amount')[0];
          expect(amount.className).toContain('positive');
          expect(amount.innerText).toBe('50.0002584 UTE');

          resolve();
        },
        () => { reject(); }
      );
    });

    return promise;
  });
});
