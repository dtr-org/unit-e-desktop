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

/* modules (deps) */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogRef, MatIconModule } from '@angular/material';

import { ModalsModule, PassphraseService } from '../../modals.module';

/* modules (own) */
import { SharedModule } from '../../../wallet/shared/shared.module';
import { CoreModule } from '../../../core/core.module';
import { CoreUiModule } from '../../../core-ui/core-ui.module';

/* components & directives (own) */
import { PassphraseComponent } from './passphrase.component';

/* delete any unused imports! */

describe('PassphraseComponent', () => {
  let component: PassphraseComponent;
  let fixture: ComponentFixture<PassphraseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
       /* own */
        SharedModule,
        CoreModule.forRoot(),
        CoreUiModule.forRoot(),
        ModalsModule.forRoot(),
        /* deps */
        BrowserAnimationsModule,
        MatIconModule,
       ],
      providers: [
        /* own */
        PassphraseService,
        /* deps */
        { provide: MatDialogRef},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PassphraseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should get words', () => {
    expect(component.words).toBeDefined();
  });
});
