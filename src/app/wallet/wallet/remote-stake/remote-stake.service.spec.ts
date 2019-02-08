/*
 * Copyright (C) 2019 The Unit-e developers
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

import { RemoteStakeService } from './remote-stake.service';
import { SharedModule } from 'app/wallet/shared/shared.module';
import { CoreModule } from 'app/core/core.module';
import { CoreUiModule } from 'app/core-ui/core-ui.module';
import { WalletModule } from '../wallet.module';

describe('RemoteStakeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        CoreModule.forRoot(),
        CoreUiModule.forRoot(),
        WalletModule.forRoot(),
      ],
      providers: [RemoteStakeService]
    });
  });

  it('should be created', inject([RemoteStakeService], (service: RemoteStakeService) => {
    expect(service).toBeTruthy();
  }));
});
