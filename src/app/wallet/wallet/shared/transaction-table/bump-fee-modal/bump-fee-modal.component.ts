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

import { Input, Component, OnInit } from '@angular/core';
import { MatSnackBar, MatDialogRef } from '@angular/material';

import { RpcService } from 'app/core/core.module';
import { ModalsHelperService } from 'app/modals/modals.module';


@Component({
  selector: 'app-bump-fee-modal',
  templateUrl: './bump-fee-modal.component.html',
  styleUrls: ['./bump-fee-modal.component.scss']
})
export class BumpFeeModalComponent implements OnInit {

  txid: string;

  newFee: number;

  constructor(
    private dialogRef: MatDialogRef<BumpFeeModalComponent>,
    private snackBar: MatSnackBar,
    private rpc: RpcService,
    private modals: ModalsHelperService,
  ) {
  }

  ngOnInit() {
  }

  bumpFee() {
    this.modals.unlock({timeout: 30}, (status) => {
      this.rpc.bumpFee(this.txid).subscribe(
        () => this.dialogRef.close(),
        (e) => this.snackBar.open(e.message)
      );
    });

  }
}
