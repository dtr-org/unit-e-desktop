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

import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs';
import { Log } from 'ng2-logger'

import { RpcService } from '../../../core/core.module';
import { Amount } from 'app/core/util/utils';

import { TransactionBuilder, FeeDetermination } from './transaction-builder.model';
import { CoinControl, Outputs } from 'app/core/rpc/rpc-types';

/*
  Note: due to upcoming multiwallet, we should never ever store addresses in the GUI for transaction purposes.
*/

@Injectable()
export class SendService {

  log: any = Log.create('send.service');

  constructor(protected _rpc: RpcService,
              protected dialog: MatDialog) {
  }

  /* Sends a transaction */
  public sendTransaction(tx: TransactionBuilder) {
    tx.estimateFeeOnly = false;
    return this.send(tx);
  }

  public getTransactionFee(tx: TransactionBuilder): Observable<any> {
    tx.estimateFeeOnly = true;
    return this.send(tx);
  }

  /**
   * Executes or estimates the fee for a regular transaction.
   * Estimates if estimateFeeOnly === true.
   */
  protected send(tx: TransactionBuilder): Observable<any> {
    const [coinControl, outputs] = this.getSendParameters(tx);
    if (outputs.length < 1) {
      return Observable.throw('Transaction has no outputs.');
    }

    return this._rpc.sendtypeto(tx.input, tx.output, outputs, tx.comment, tx.commentTo, tx.estimateFeeOnly, coinControl);
  }

  protected getSendParameters(tx: TransactionBuilder): [CoinControl, Outputs[]] {
    const coinControl: CoinControl = {};

    if (tx.selectedCoins) {
      coinControl.inputs = tx.selectedCoins.map((c) => ({
        tx: c.txid,
        n: c.vout,
      }));
    }

    if (tx.feeDetermination === FeeDetermination.CONFIRMATION) {
      coinControl.conf_target = tx.confirmationTarget;
    }
    if (tx.feeDetermination === FeeDetermination.CUSTOM) {
      coinControl.fee_rate = tx.customFee.toString();
    }
    if (tx.replaceable) {
      coinControl.replaceable = tx.replaceable;
    }

    const outputs: Outputs[] = tx.outputs.map(txo => ({
      address: txo.toAddress,
      amount: txo.amount,
      subfee: txo.subtractFeeFromAmount,
    }));

    return [coinControl, outputs];
  }
}
