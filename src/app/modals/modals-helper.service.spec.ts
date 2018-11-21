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

import { TestBed, inject } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef } from '@angular/material';

import { ModalsModule } from './modals.module';
import { CoreModule } from '../core/core.module';

import { ModalsHelperService } from './modals-helper.service';

describe('ModalsHelperService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        ModalsModule,
        CoreModule.forRoot()
      ],
      providers: [
        { provide: MatDialogRef}
      ]
    });
  });

  it('should be created', inject([ModalsHelperService], (service: ModalsHelperService) => {
    expect(service).toBeTruthy();
  }));
});
