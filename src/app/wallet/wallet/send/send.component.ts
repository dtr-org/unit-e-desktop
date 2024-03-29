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

import { Component, OnInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { Log } from 'ng2-logger';

import { ModalsHelperService } from 'app/modals/modals.module';
import { RpcService, Commands } from '../../../core/rpc/rpc.service';
import { RpcStateService } from '../../../core/rpc/rpc-state/rpc-state.service';

import { SendService } from './send.service';
import { SnackbarService } from '../../../core/snackbar/snackbar.service';

import { AddressLookupComponent } from '../addresslookup/addresslookup.component';
import { AddressLookUpCopy } from '../models/address-look-up-copy';

import { TransactionBuilder, TransactionOutput } from './transaction-builder.model';
import { SendConfirmationModalComponent } from 'app/modals/send-confirmation-modal/send-confirmation-modal.component';

@Component({
  selector: 'app-send',
  templateUrl: './send.component.html',
  // TODO merge / globalize styles
  styleUrls: ['./send.component.scss']
})
export class SendComponent implements OnInit {

  // General
  log: any = Log.create('send.component');
  testnet: boolean = false;

  // UI logic
  type: string = 'sendPayment';
  progress: number = 10;

  // TODO: Create proper Interface / type
  public send: TransactionBuilder;

  constructor(
    protected sendService: SendService,
    protected _rpc: RpcService,
    protected _rpcState: RpcStateService,

    // @TODO rename ModalsHelperService to ModalsService after modals service refactoring.
    protected modals: ModalsHelperService,
    protected dialog: MatDialog,
    protected flashNotification: SnackbarService
  ) {
    this.progress = 50;

    this.setFormDefaultValue();
  }

  setFormDefaultValue() {
    this.send = new TransactionBuilder(this._rpc, this._rpcState);
  }

  ngOnInit() {
    /* check if testnet */
     this._rpcState.observe('getblockchaininfo', 'chain').take(1)
     .subscribe(chain => this.testnet = chain === 'test');
  }

  onSubmit(): void {
    this.modals.unlock({timeout: 30}, (status) => this.openSendConfirmationModal());
  }

  openSendConfirmationModal() {
    const txt = `Do you really want to send ${this.send.amount} UTE to ${this.send.toAddress}?`;

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

  /** Payment function */
  pay(): void {
    this.modals.unlock({timeout: 30}, (status) => {
      // edit label of address
      for (const output of this.send.outputs) {
        this.addLabelToAddress(output);
      }
      this.sendTransaction();
      this.setFormDefaultValue();
    });
  }

  sendTransaction(): void {
    const tx = this.send;
    this.sendService.sendTransaction(tx)
      .subscribe(
        (txid) => {
          this.log.d(`Succesfully executed transaction with txid ${txid}`);

          // Truncate the address to 16 characters
          const trimAddress = tx.toAddress.substring(0, 16) + '...';
          const trimTxid = txid.substring(0, 45) + '...';
          this.flashNotification.open(
            `Succesfully sent ${tx.amount.toString()} UTE to ${trimAddress}!\nTransaction id: ${trimTxid}`, 'warn'
          );
        },
        (error) => {
          this.log.er(`Failed to execute transaction: ${error.message}`);

          this.flashNotification.open(`Transaction Failed ${error.message}`, 'err');
        });
  }

  /*
    AddressLookup Modal + set details
  */
  openLookup(txo: TransactionOutput): void {
    const d = this.dialog.open(AddressLookupComponent);
    const dc = d.componentInstance;
    dc.type = 'send';
    dc.filter = 'All types';
    dc.selectAddressCallback.subscribe((response: AddressLookUpCopy) => {
      this.selectAddress(txo, response);
      d.close();
    });
  }

  /** Select an address, set the appropriate models
    * @param address The address to send to
    * @param label The label for the address.
    */
  selectAddress(txo: TransactionOutput, copyObject: AddressLookUpCopy): void {
    txo.toAddress = copyObject.address;
    txo.toLabel = copyObject.label;
    txo.verifyAddress();
  }

  /** Add/edits label of an address. */
  addLabelToAddress(dest: TransactionOutput): void {
    if (dest.toLabel === '') {
      dest.toLabel = 'Empty Label'
    }
    const label = dest.toLabel;
    const addr = dest.toAddress;

    this._rpc.call(Commands.MANAGEADDRESSBOOK, ['newsend', addr, label])
      .subscribe(
        response => this.log.er('rpc_addLabel_success: successfully added label to address.'),
        error => this.log.er('rpc_addLabel_failed: failed to add label to address.'))
  }

  sendAllBalance(dest: TransactionOutput): void {
    if (dest.sendAll) {
      this.send.sendAllTo(dest);
    }
  }
}
