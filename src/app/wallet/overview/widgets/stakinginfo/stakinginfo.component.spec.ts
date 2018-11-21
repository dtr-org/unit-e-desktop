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

import { SharedModule } from '../../../shared/shared.module';
import { WalletModule } from '../../../wallet/wallet.module';
import { CoreModule, RpcService, Commands } from '../../../../core/core.module';

import { StakingInfoComponent } from './stakinginfo.component';

import { RpcMockService } from '../../../../_test/core-test/rpc-test/rpc-mock.service';
import { CoreUiModule } from '../../../../core-ui/core-ui.module';


describe('StakingInfoComponent', () => {
  let component: StakingInfoComponent;
  let fixture: ComponentFixture<StakingInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        WalletModule.forRoot(),
        CoreModule.forRoot(),
        CoreUiModule.forRoot(),
      ],
      declarations: [ StakingInfoComponent ],
      providers: [
        { provide: RpcService, useClass: RpcMockService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StakingInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the initial proposer status', () => {
    expect(component.severity).toBe('success');
  })

  it('should display the correct proposer status after an RPC call', () => {
    inject([RpcService], (rpc: RpcMockService) => {
      rpc.proposerStatus()
        .subscribe((x) => {
          expect(component.severity).toBe('alert');
        });
    })
  });
});
