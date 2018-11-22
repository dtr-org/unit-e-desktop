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
import { MatDialogRef } from '@angular/material';

import { SharedModule } from 'app/wallet/shared/shared.module';
import { CoreModule } from 'app/core/core.module';
import { CoreUiModule } from 'app/core-ui/core-ui.module';
import { ModalsModule } from 'app/modals/modals.module';

import { FixWalletModalComponent } from './fix-wallet-modal.component';



describe('FixWalletModalComponent', () => {
  let component: FixWalletModalComponent;
  let fixture: ComponentFixture<FixWalletModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        FixWalletModalComponent
      ],
      imports: [
        SharedModule,
        CoreModule.forRoot(),
        CoreUiModule.forRoot(),
        ModalsModule.forRoot()
      ],
      providers: [ { provide: MatDialogRef } ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixWalletModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
