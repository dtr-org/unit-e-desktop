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

import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { RpcModule } from '../../../../core/rpc/rpc.module';
import { SharedModule } from '../../../shared/shared.module';
import { WalletModule } from '../../../wallet/wallet.module';
import { CoreModule } from '../../../../core/core.module';

import { TransactionsTableComponent } from './transaction-table.component';
import { TransactionService } from 'app/wallet/wallet/shared/transaction.service';
import { MockTransactionService } from 'app/wallet/wallet/shared/transaction.mockservice';



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
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

/*
  it('initializes the component', fakeAsync(() => {
    let service = fixture.debugElement.injector.get(TransactionService);
    console.warn("MockTxService");
    console.warn(service.txs);

    component.ngOnInit(); // call ngOnInit
    tick(); // simulate a tick

    // expect(service.get.toHaveBeenCalled);
    // here you could add an expect to validate component state after the service completes
})); */

it('should create', () => {
  expect(component).toBeTruthy();
});

/*
  it('should change page', () => {
    // component.pageChanged()
    expect(component.pageChanged).toBeTruthy();
  });
*/
  it('should get log', () => {
    expect(component.log).toBeDefined();
  });

  it('should get txService', () => {
    expect(component.txService).toBeDefined();
  });
});
