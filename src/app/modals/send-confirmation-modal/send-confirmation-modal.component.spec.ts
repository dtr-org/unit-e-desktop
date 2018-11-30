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

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MatFormFieldModule } from '@angular/material';
import { MaterialModule } from '../../core-ui/material/material.module';


import { SnackbarService } from '../../core/snackbar/snackbar.service';

import { FeeOptionsComponent } from './fee-options/fee-options.component';
import { SendConfirmationModalComponent } from './send-confirmation-modal.component';
import { SendService } from 'app/wallet/wallet/send/send.service';
import { SendMockService } from 'app/_test/wallet-test/send-test/send-mock.service';
import { TransactionBuilder } from 'app/wallet/wallet/send/transaction-builder.model';


describe('SendConfirmationModalComponent', () => {
  let component: SendConfirmationModalComponent;
  let fixture: ComponentFixture<SendConfirmationModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        MaterialModule,
        MatFormFieldModule // check if this is required. If so, move into CoreUi.
      ],
      declarations: [
        SendConfirmationModalComponent,
        FeeOptionsComponent,
      ],
      providers: [
        SnackbarService,
        {provide: SendService, useClass: SendMockService},
        { provide: MatDialogRef},
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendConfirmationModalComponent);
    component = fixture.componentInstance;
    component.send = new TransactionBuilder();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the right currency name', () => {
    const element: HTMLElement = fixture.nativeElement;
    const currency = element.querySelector('.currency');

    expect(currency.textContent).toEqual('UTE');
  });
});
