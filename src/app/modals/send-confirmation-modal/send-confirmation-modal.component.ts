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

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { TransactionBuilder, TxType } from 'app/wallet/wallet/send/transaction-builder.model';

import { Amount } from 'app/core/util/utils';
import { SendService } from 'app/wallet/wallet/send/send.service';

@Component({
  selector: 'app-send-confirmation-modal',
  templateUrl: './send-confirmation-modal.component.html',
  styleUrls: ['./send-confirmation-modal.component.scss']
})
export class SendConfirmationModalComponent implements OnInit {

  @Output() onConfirm: EventEmitter<string> = new EventEmitter<string>();

  public dialogContent: string;
  public send: TransactionBuilder;

  TxType: any = TxType;
  transactionType: TxType;
  sendAmount: Amount = Amount.ZERO;
  sendAddress: string = '';
  receiverName: string = '';
  transactionFee: Amount = Amount.ZERO;
  showAdvancedFeeOptions: boolean = false;

  constructor(private dialogRef: MatDialogRef<SendConfirmationModalComponent>,
              private sendService: SendService) {
  }

  ngOnInit() {
    this.setTxDetails();
  }

  confirm(): void {
    this.onConfirm.emit();
    this.dialogClose();
  }

  dialogClose(): void {
    this.dialogRef.close();
  }

  /**
    * Set the confirmation modal data for tx
    */
  setTxDetails(): void {
    this.updateTransactionFee();

    this.sendAddress = this.send.toAddress;
    this.transactionType = this.send.input;
    this.sendAmount = this.send.amount;
    this.receiverName = this.send.toLabel;
  }

  updateTransactionFee(): void {
    this.sendService.getTransactionFee(this.send).subscribe(fee => {
      this.transactionFee = Amount.fromNumber(fee.fee);
    });
  }

  getAmountWithFee(): Amount {
    if (this.send.subtractFeeFromAmount) {
      return this.sendAmount;
    }

    return this.sendAmount.add(this.transactionFee);
  }

  setTransactionFee(fee: number): void {
    this.transactionFee = Amount.fromNumber(fee);
  }

}
