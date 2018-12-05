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

import { UnspentOutput } from 'app/core/rpc/rpc-types';
import { RpcService, Commands } from '../../../core/rpc/rpc.service';
import { RpcStateService } from '../../../core/rpc/rpc-state/rpc-state.service';
import { AddressHelper } from '../../../core/util/utils';


export enum TxType {
  PUBLIC = 'ute',
}

export enum FeeDetermination {
  DEFAULT = 'default',
  CONFIRMATION = 'confirmation',
  CUSTOM = 'custom',
}

export class TransactionOutput {
  toAddress: string;
  toLabel: string;
  address: string;
  amount: number | string;  // value coming from the GUI
  validAddress: boolean;
  validAmount: boolean;
  isMine: boolean;
  ringsize: number = 8;
  sendAll: boolean = false;
  subtractFeeFromAmount: boolean = false;

  constructor(
    private _rpc?: RpcService,
    private _rpcState?: RpcStateService,
  ) {
  }

  private getTotalBalance(): number {
    const walletInfo = this._rpcState.get('getwalletinfo');
    if (!walletInfo) {
      return 0;
    }
    return walletInfo.balance || 0;
  }

  verifyAmount(): void {
    if (this.amount === undefined || +this.amount === 0 || this.amount === null) {
      this.validAmount = undefined;
      return;
    }
    if ((this.amount + '').indexOf('.') >= 0 && (this.amount + '').split('.')[1].length > 8) {
      this.validAmount = false;
      return;
    }
    if (+this.amount === 1e-8) {
      this.validAmount = false;
      return;
    }

    this.validAmount = (0 < this.amount && this.amount <= this.getTotalBalance());
  }

  verifyAddress() {
    if (!this.toAddress) {
      this.validAddress = undefined;
      this.isMine = undefined;
      return;
    }

    const request = this._rpc.call(Commands.VALIDATEADDRESS, [this.toAddress]);
    request.subscribe(response => {
      this.validAddress = response.isvalid;
      if (!!response.account) {
        this.toLabel = response.account;
      }
      if (!!response.ismine) {
        this.isMine = response.ismine;
      }
    });

    return request;
  }

  clearReceiver(): void {
    this.toLabel = '';
    this.toAddress = '';
    this.validAddress = undefined;
  }

}

export class TransactionBuilder {
  input: TxType = TxType.PUBLIC;
  output: TxType = TxType.PUBLIC;
  comment: string;
  commentTo: string;

  feeDetermination: string = FeeDetermination.DEFAULT;
  selectedFee: number;
  customFee: number = 0.00001;
  confirmationTarget: number = 2;

  estimateFeeOnly: boolean = true;
  replaceable: boolean = false;

  selectedCoins: UnspentOutput[];
  outputs: TransactionOutput[];

  constructor(
    private _rpc?: RpcService,
    private _rpcState?: RpcStateService,
  ) {
    // Create one initial empty output
    this.outputs = [
      new TransactionOutput(this._rpc, this._rpcState),
    ];
  }

  private getTotalBalance(): number {
    const walletInfo = this._rpcState.get('getwalletinfo');
    if (!walletInfo) {
      return 0;
    }
    return walletInfo.balance || 0;
  }

  get validAddress(): boolean {
    return this.outputs.every(x => x.validAddress);
  }

  get validAmount(): boolean {
    if (!this.outputs.every(x => x.validAmount)) {
      return false;
    }

    return this.amount <= this.getTotalBalance();
  }

  get amount(): number {
    let sum = 0;
    for (const output of this.outputs) {
      sum += +output.amount;
    }
    return sum;
  }

  get toAddress(): string {
    if (this.outputs.length === 1) {
      return this.outputs[0].toAddress;
    }

    return 'multiple addresses';
  }

  get toLabel(): string {
    if (this.outputs.length === 1) {
      return this.outputs[0].toLabel;
    }

    return 'multiple recipients';
  }

  get subtractFeeFromAmount() {
    // Are some of the outputs paying for everyone else?
    return this.outputs.some(x => x.subtractFeeFromAmount);
  }

  addOutput() {
    this.outputs.push(new TransactionOutput(this._rpc, this._rpcState));
  }

  removeOutput(i: number) {
    if (this.outputs.length === 1) {
      throw new Error('Cannot remove last transaction output!');
    }

    this.outputs.splice(i, 1);
  }

  /**
   * Sent all wallet balance to the specified address, and set all other output
   * amounts to 0, if present. If there's more than one output, this results in
   * an invalid transaction, so the user will have to delete the other outputs
   * manually or change the amount to a lower one.
   */
  sendAllTo(destination: TransactionOutput) {
    for (const txo of this.outputs) {
      if (txo === destination) {
        txo.amount = this.getTotalBalance();
        txo.validAmount = true;
        txo.subtractFeeFromAmount = true;
      } else {
        txo.sendAll = false;
        txo.amount = 0;
        txo.validAmount = undefined;
        txo.subtractFeeFromAmount = false;
      }
    }
  }
}
