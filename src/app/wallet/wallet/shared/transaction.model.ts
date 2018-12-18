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

import { Amount, DateFormatter } from '../../../core/util/utils';
import { AddressType } from './address.model';

export type TransactionCategory =
    'all'
    | 'coinbase'
    | 'send'
    | 'receive'
    | 'multisig'
    | 'listing_fee';

export class Transaction {

  type: string;

    txid: string;
    address: string ;
    label: string;
    category: TransactionCategory;
    amount: Amount;
    reward: Amount;
    fee: Amount;
    time: number;
    comment: string;
    n0: string;
    n1: string;

    outputs: any[];

    /* conflicting txs */
    walletconflicts: any[];

    /* block info */
    blockhash: string;
    blockindex: number;
    blocktime: number;
    confirmations: number;

    replaceable: boolean;
    abandoned: boolean;
    replacedByTxid: string;
    replacesTxid: string;

  constructor(json: any) {
    /* transactions */
    this.txid = json.txid;
    if (json.outputs && json.outputs.length) {
      this.address = json.outputs[0].address;
      this.label = json.outputs[0].label;
    }
    this.category = json.category;
    this.amount = Amount.fromNumber(json.amount);
    this.reward = json.reward && Amount.fromNumber(json.reward);
    this.fee = json.fee && Amount.fromNumber(json.fee);
    this.time = json.time;
    this.comment = json.comment;
    this.n0 = json.n0;
    this.n1 = json.n1;

    this.outputs = json.outputs;

    /* conflicting txs */
    this.walletconflicts = json.walletconflicts;

    this.replaceable = (json['bip125-replaceable'] === 'yes');
    this.abandoned = !!json.abandoned;
    this.replacesTxid = json.replaces_txid;
    this.replacedByTxid = json.replaced_by_txid;

    /* block info */
    this.blockhash = json.blockhash;
    this.blockindex = json.blockindex;
    this.blocktime = json.blocktime;
    this.confirmations = json.confirmations;
  }

  public getAddress(): string {
    return this.address;
  }

  private getAddressType(): AddressType {
    // UNIT-E: TODO: See comment for isMultiSig method
    return AddressType.NORMAL;
  }

  public isMultiSig(): boolean {
    // UNIT-E: TODO: Particl used to distinguish between regular and multisig addresses
    // by checking the address prefix. All P2SH addresses (starting with 'r') were
    // considered multisig. Since all Unit-e addresses are P2SH-SegWit at the moment,
    // we need another way to distinguish between address types.
    return false;
  }

  public isListingFee(): boolean {
    return false;
  }

  getCategory(): TransactionCategory {
    if (this.isMultiSig()) {
      return 'multisig';
    } else if (this.isListingFee()) {
      return 'listing_fee'
    } else {
      return this.category;
    }
  }

  public getExpandedTransactionID(): string {
    return this.txid + this.getAmountObject().toString() + this.category;
  }


  public getConfirmationCount(confirmations: number): string {
    if (this.confirmations > 12) {
      return '12+';
    }
    return this.confirmations.toString();
  }


  /* Amount stuff */
  public getAmount(): Amount {
    // UNIT-E: TODO: See comment for isMultiSig method
    return this.amount;
  }

  /** Turns amount into an Amount Object */
  public getAmountObject(): Amount {
    return this.getAmount();
  }

  /** Calculates the actual amount that was transfered, including the fee */
  /* todo: fee is not defined in normal receive tx, wut? */
  public getNetAmount(): Amount {
    const amount = this.amount;
    // @ TODO: the fee for multisig transaction includes the change
    /* If fee undefined then just return amount */
    if (this.fee === undefined) {
      return amount;
    /* sent */
    } else if (amount.lessOrEqualTo(Amount.ZERO)) {
      return this.amount.add(this.fee);
    } else {
      return this.amount.sub(this.fee);
    }
  }

  /* Date stuff */
  public getDate(): string {
    return new DateFormatter(new Date(this.time * 1000)).dateFormatter();
  }

  /* Narration */
  public getNarration() {
    for (const key in this.outputs) {
      if (this.outputs[key] && this.outputs[key].narration) {
        return this.outputs[key].narration;
      }
    }
    return false
  }

  /** Shows whether we can increase the fee for this transaction */
  public canBumpFee(): boolean {
    return (
      this.category === 'send' && this.confirmations === 0 && this.replaceable &&
      !this.abandoned && !this.replacedByTxid
    );
  }
}
