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

import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CoreModule } from '../../../core/core.module';
import { CoreUiModule } from '../../../core-ui/core-ui.module';
import { ModalsModule } from '../../../modals/modals.module';

import { SharedModule } from '../../shared/shared.module'; // is this even needed?


import { SendComponent } from './send.component';
import { CoinSelectionComponent } from './coin-selection/coin-selection.component';
import { SendOutputComponent } from './send-output/send-output.component';
import { SendService } from 'app/wallet/wallet/send/send.service';

import { RpcStateService, Commands } from '../../../core/core.module';
import { OUR_ADDRESS, THEIR_ADDRESS } from '../../../_test/core-test/rpc-test/rpc-mock.service';
import mockwalletinfo from '../../../_test/core-test/rpc-test/mock-data/getwalletinfo.mock';


describe('SendComponent', () => {
  let component: SendComponent;
  let fixture: ComponentFixture<SendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SendComponent,
        CoinSelectionComponent,
        SendOutputComponent,
      ],
      imports: [
        SharedModule,
        CoreModule.forRoot(),
        CoreUiModule.forRoot(),
        ModalsModule.forRoot(),
        BrowserAnimationsModule
      ],
      providers: [
        SendService,
        { provide: MatDialogRef },
      ]
    })
      .compileComponents();
  }));

  beforeEach(inject([RpcStateService], (svc: RpcStateService) => {
    fixture = TestBed.createComponent(SendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    svc.set(Commands.GETWALLETINFO, mockwalletinfo);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should verify amount no balance service', () => {
    component.send.outputs[0].amount = '555.555555';
    component.send.outputs[0].verifyAmount();

    expect(component.send.outputs[0].validAmount).toBeFalsy();
  });

  it('should return the proper labels for one recipient', () => {
    component.send.outputs[0].toLabel = 'Bob';
    expect(component.send.toLabel).toEqual('Bob');

    component.send.addOutput();
    component.send.outputs[1].toLabel = 'Joe';
    expect(component.send.toLabel).toEqual('multiple recipients');
  });

  it('should validate proper outputs', async () => {
    console.log(OUR_ADDRESS, THEIR_ADDRESS);

    component.send.outputs[0].toAddress = OUR_ADDRESS;
    component.send.outputs[0].amount = '0';
    await component.send.outputs[0].verifyAddress().toPromise();
    component.send.outputs[0].verifyAmount();

    component.send.addOutput();
    component.send.outputs[1].toAddress = THEIR_ADDRESS;
    component.send.outputs[1].amount = '0.01';
    await component.send.outputs[1].verifyAddress().toPromise();
    component.send.outputs[1].verifyAmount();

    expect(component.send.validAddress).toBeTruthy();
    expect(component.send.validAmount).toBeFalsy();

    component.send.outputs[0].amount = '0.1';
    component.send.outputs[0].verifyAmount();
    expect(component.send.outputs[0].validAmount).toBeTruthy();
  });

});
