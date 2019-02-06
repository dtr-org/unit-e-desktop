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
import { Subscription } from 'rxjs/Subscription';
import { MatDialog } from '@angular/material';
import { Log } from 'ng2-logger';

import { ModalsHelperService } from 'app/modals/modals.module';
import { RpcService, Commands } from '../../../core/rpc/rpc.service';
import { WalletInfo } from '../../../core/rpc/rpc-types';
import { RpcStateService } from '../../../core/rpc/rpc-state/rpc-state.service';
import { UnspentOutput } from 'app/core/rpc/rpc-types';

import { SendService } from './send.service';
import { SnackbarService } from '../../../core/snackbar/snackbar.service';

import { AddressLookupComponent } from '../addresslookup/addresslookup.component';
import { AddressLookUpCopy } from '../models/address-look-up-copy';

import { TransactionBuilder, TransactionOutput, TxType } from './transaction-builder.model';
import { SendConfirmationModalComponent } from 'app/modals/send-confirmation-modal/send-confirmation-modal.component';
import { Amount } from 'app/core/util/amount';

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
  paymentSource: string = 'default';
  selectedBalance: Amount;

  // TODO: Create proper Interface / type
  public send: TransactionBuilder;

  TxType: any = TxType;

  constructor(
    private sendService: SendService,
    private _rpc: RpcService,
    private _rpcState: RpcStateService,

    // @TODO rename ModalsHelperService to ModalsService after modals service refactoring.
    private modals: ModalsHelperService,
    private dialog: MatDialog,
    private flashNotification: SnackbarService
  ) {
    this.progress = 50;

    this.setFormDefaultValue();
  }

  setFormDefaultValue() {
    this.send = new TransactionBuilder(this._rpc, this._rpcState);
    this.paymentSource = 'default';
  }

  ngOnInit() {
    /* check if testnet */
     this._rpcState.observe('getblockchaininfo', 'chain').take(1)
     .subscribe(chain => this.testnet = chain === 'test');
     this.selectedBalance = this.getBalance(TxType.PUBLIC);
  }

  /** Get current account balance */
  getBalance(account: TxType): Amount {
    const walletInfo: WalletInfo = this._rpcState.get('getwalletinfo');
    if (!walletInfo) {
      return Amount.ZERO;
    }
    return walletInfo.balance || Amount.ZERO;
  }

  private txTypeToBalanceType(type: TxType): string {
    let r: string;
    switch (type) {
      case TxType.PUBLIC:
        r = 'balance';
        break;
    }
    return r;
  }

  onSubmit(): void {
    this.modals.unlock({timeout: 30}, (status) => this.openSendConfirmationModal());
  }

  /** Open Send Confirmation Modal */
  openSendConfirmationModal() {
    const dialogRef = this.dialog.open(SendConfirmationModalComponent);

    const txt = `Do you really want to send ${this.send.amount} UTE to ${this.send.toAddress}?`;
    dialogRef.componentInstance.dialogContent = txt;
    dialogRef.componentInstance.send = this.send;

    dialogRef.componentInstance.onConfirm.subscribe(() => {
      dialogRef.close();
      this.pay();
    });
}

  /** Payment function */
  pay(): void {
    this.modals.unlock({timeout: 30}, (status) => this.sendTransaction());
  }

  private sendTransaction(): void {
    // edit label of address
    for (const output of this.send.outputs) {
      this.addLabelToAddress(output);
    }
    this.sendService.sendTransaction(this.send);
    this.setFormDefaultValue();
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

  onChangePaymentSource(): void {
    if (this.paymentSource === 'default') {
      this.send.selectedCoins = null;
      this.selectedBalance = this.getBalance(TxType.PUBLIC);
    }
  }

  updateSelection(coins: UnspentOutput[]) {
    this.send.selectedCoins = coins;
    this.selectedBalance = coins.reduce((sum, coin) => sum.add(coin.amount), Amount.ZERO);
  }
}
