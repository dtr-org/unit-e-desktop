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
import { HttpClientModule } from '@angular/common/http';

import { RpcModule } from './rpc/rpc.module';

import { IpcService } from './ipc/ipc.service';
import { RpcService } from './rpc/rpc.service';
import { ZmqService } from './zmq/zmq.service';

import { UpdaterService } from './updater/updater.service';
import { NotificationService } from './notification/notification.service';

import { BlockStatusService } from './rpc/blockstatus/blockstatus.service'
import { PeerService } from './rpc/peer/peer.service';
import { SnackbarService } from './snackbar/snackbar.service';
import { UpdaterComponent } from './updater/modal/updater.component';

// This is seriously the only UI import.
import { MatDialogModule } from '@angular/material';

  /*
    Loading the core library will intialize IPC & RPC
  */
@NgModule({
  imports: [
    CommonModule,
    RpcModule.forRoot(), // TODO: should be here?
    MatDialogModule
  ],
  exports: [
    HttpClientModule
  ],
  declarations: [UpdaterComponent],
  entryComponents: [ UpdaterComponent ]
})
export class CoreModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      providers: [
        IpcService,
        ZmqService,
        UpdaterService,
        SnackbarService,
        NotificationService
      ]
    };
  }
}

export function TEXT(text: string): string {
  return text;
}

export { IpcService } from './ipc/ipc.service';
export { RpcService, Commands } from './rpc/rpc.service';
export { RpcStateService } from './rpc/rpc-state/rpc-state.service';
export { UpdaterService } from './updater/updater.service';
export { NotificationService } from './notification/notification.service';
export { BlockStatusService } from './rpc/blockstatus/blockstatus.service'
export { PeerService } from './rpc/peer/peer.service';
export { SnackbarService } from './snackbar/snackbar.service';
