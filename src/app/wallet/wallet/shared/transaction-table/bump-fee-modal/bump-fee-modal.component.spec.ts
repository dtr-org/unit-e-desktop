/*
 * Copyright (C) 2018 Unit-e developers
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
import { MaterialModule } from 'app/core-ui/material/material.module';
import { MatDialogModule, MatDialogRef } from '@angular/material';

import { CoreModule } from 'app/core/core.module';
import { ModalsHelperService } from 'app/modals/modals-helper.service';
import { BumpFeeModalComponent } from './bump-fee-modal.component';

describe('BumpFeeModalComponent', () => {
  let component: BumpFeeModalComponent;
  let fixture: ComponentFixture<BumpFeeModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CoreModule.forRoot(),
        MatDialogModule,
        MaterialModule,
      ],
      declarations: [ BumpFeeModalComponent ],
      providers: [
        { provide: MatDialogRef },
        ModalsHelperService,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BumpFeeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
