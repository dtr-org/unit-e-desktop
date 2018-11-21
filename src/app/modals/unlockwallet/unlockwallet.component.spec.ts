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
import { MatDialogRef } from '@angular/material';

import { ModalsModule } from '../modals.module';
import { CoreModule } from '../../core/core.module';
import { SharedModule } from '../../wallet/shared/shared.module';
import { CoreUiModule } from '../../core-ui/core-ui.module';

import { UnlockwalletComponent } from './unlockwallet.component';
import { EncryptionState } from 'app/core/rpc/rpc-types';


describe('UnlockwalletComponent', () => {
  let component: UnlockwalletComponent;
  let fixture: ComponentFixture<UnlockwalletComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        ModalsModule,
        CoreModule.forRoot(),
        CoreUiModule.forRoot()
      ],
      providers: [ { provide: MatDialogRef } ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnlockwalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
     expect(component).toBeTruthy();
  });

  it('should let us unlock the wallet', () => {
    let unlocked = false;
    const _sub = component.unlockEmitter
      .subscribe(() => {
        unlocked = true;
        _sub.unsubscribe();
      });
    component.unlock(EncryptionState.UNLOCKED_FOR_STAKING_ONLY);
    expect(unlocked).toBeTruthy();
  })
});
