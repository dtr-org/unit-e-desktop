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

import { Component, Inject, forwardRef, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';

import { RpcService, RpcStateService, Commands } from 'app/core/core.module';
import { ModalsHelperService } from 'app/modals/modals.module';
import { WalletFixedConfirmationComponent } from './wallet-fixed-confirmation/wallet-fixed-confirmation.component';

@Component({
  selector: 'app-fix-wallet-modal',
  templateUrl: './fix-wallet-modal.component.html',
  styleUrls: ['./fix-wallet-modal.component.scss']
})
export class FixWalletModalComponent implements OnInit {

  constructor(
    private _rpc: RpcService,
    private _rpcState: RpcStateService,

    // @TODO rename ModalsHelperService to ModalsService after modals service refactoring.
    @Inject(forwardRef(() => ModalsHelperService))
    private modals: ModalsHelperService,
    private dialogRef: MatDialogRef<FixWalletModalComponent>,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
  }

  fix(): void {
    this.modals.unlock({timeout: 3}, (status) => this.scanChain());
  }

  scanChain() {
    this._rpc.call(Commands.RESCANBLOCKCHAIN, [0]).subscribe(
      (result: any) => {
        this.dialog.open(WalletFixedConfirmationComponent);
      },
      (error: any) => {}
    )
  }

  dialogClose(): void {
    this.dialogRef.close();
  }
}
