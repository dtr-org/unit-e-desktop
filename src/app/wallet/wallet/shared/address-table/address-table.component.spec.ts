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

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedModule } from '../../../shared/shared.module';
import { WalletModule } from '../../../wallet/wallet.module';
import { CoreModule } from '../../../../core/core.module';
import { CoreUiModule } from '../../../../core-ui/core-ui.module';
import { ModalsModule } from '../../../../modals/modals.module';

import { AddressTableComponent } from './address-table.component';

describe('AddressTableComponent', () => {
  let component: AddressTableComponent;
  let fixture: ComponentFixture<AddressTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,  // is this even needed?
        WalletModule.forRoot(),  // is this even needed?
        CoreModule.forRoot(),
        CoreUiModule.forRoot(),
        ModalsModule.forRoot()
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get addressService', () => {
    expect(component._addressService).toBeDefined();
  });
});
