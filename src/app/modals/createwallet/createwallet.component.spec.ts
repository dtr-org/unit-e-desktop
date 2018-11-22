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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogRef } from '@angular/material';

import { ModalsModule } from '../modals.module';
import { CoreModule } from '../../core/core.module';
import { SharedModule } from '../../wallet/shared/shared.module';
import { CoreUiModule } from '../../core-ui/core-ui.module';

import { CreateWalletComponent } from './createwallet.component';


describe('CreateWalletComponent', () => {
  let component: CreateWalletComponent;
  let fixture: ComponentFixture<CreateWalletComponent>;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        SharedModule,
        CoreModule.forRoot(),
        ModalsModule,
        CoreUiModule.forRoot()
      ],
      providers: [
        { provide: MatDialogRef}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateWalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
/*
  it('should restore', () => {
    // component.restore();
    expect(component.restore).toBeTruthy();
  });

  it('should go back', () => {
    component.back();
    expect(component.back).toBeTruthy();
  });
*/
  it('should get words', () => {
    expect(component.words).toBeDefined();
  });
});
