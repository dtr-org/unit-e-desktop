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

import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';


import { RpcService } from './rpc.service';
import { RpcStateService } from './rpc-state/rpc-state.service';

import { BlockStatusService } from './blockstatus/blockstatus.service';
import { NewTxNotifierService } from './new-tx-notifier/new-tx-notifier.service';
import { PeerService } from './peer/peer.service';

@NgModule({
  imports: [
    CommonModule,
  ]
})
export class RpcModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: RpcModule,
      providers: [
        RpcService,
        RpcStateService,
        BlockStatusService,
        NewTxNotifierService,
        PeerService
      ]
    };
  }
}


export { RpcService } from './rpc.service';
export { RpcStateService } from './rpc-state/rpc-state.service';

export { BlockStatusService } from './blockstatus/blockstatus.service'
export { PeerService } from './peer/peer.service';
export { NewTxNotifierService } from './new-tx-notifier/new-tx-notifier.service';
