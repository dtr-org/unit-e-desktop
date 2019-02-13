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

import { Component } from '@angular/core';
import { SendComponent } from '../send/send.component';
import { RpcService, RpcStateService, SnackbarService } from 'app/core/core.module';
import { ModalsHelperService } from 'app/modals/modals.module';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { RemoteStakeService } from './remote-stake.service';
import { SendConfirmationModalComponent } from 'app/modals/send-confirmation-modal/send-confirmation-modal.component';

@Component({
  selector: 'app-remote-stake',
  templateUrl: './remote-stake.component.html',
  styleUrls: ['./remote-stake.component.scss']
})
export class RemoteStakeComponent extends SendComponent {

  constructor(
    service: RemoteStakeService,
    _rpc: RpcService,
    _rpcState: RpcStateService,
    modals: ModalsHelperService,
    dialog: MatDialog,
    flashNotification: SnackbarService
  ) {
    super(service, _rpc, _rpcState, modals, dialog, flashNotification);
  }

  openSendConfirmationModal() {
    const txt = `Do you really want to stake ${this.send.amount} UTE at ${this.send.toAddress}?`;

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      service: this.sendService,
      dialogContent: txt,
      send: this.send,
    };

    const dialogRef = this.dialog.open(SendConfirmationModalComponent, dialogConfig);
    dialogRef.componentInstance.onConfirm.subscribe(() => {
      dialogRef.close();
      this.pay();
    });
  }
}
