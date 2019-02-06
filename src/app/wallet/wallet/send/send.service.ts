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
import { map } from 'rxjs/operators';
import { Log } from 'ng2-logger'

import { RpcService, Commands } from '../../../core/core.module';
import { SnackbarService } from '../../../core/snackbar/snackbar.service';
import { Amount } from 'app/core/util/utils';

/* fix wallet */
import { FixWalletModalComponent } from 'app/wallet/wallet/send/fix-wallet-modal/fix-wallet-modal.component';
import { TransactionBuilder, TransactionOutput, FeeDetermination } from './transaction-builder.model';
import { CoinControl, Outputs } from 'app/core/rpc/rpc-types';

/*
  Note: due to upcoming multiwallet, we should never ever store addresses in the GUI for transaction purposes.
*/

@Injectable()
export class SendService {

  log: any = Log.create('send.service');

  constructor(private _rpc: RpcService,
              private flashNotification: SnackbarService,
              private dialog: MatDialog) {

  }

  /* Sends a transaction */
  public sendTransaction(tx: TransactionBuilder) {
    tx.estimateFeeOnly = false;

    this.send(tx)
      .subscribe(
        success => this.rpc_send_success(success, tx.toAddress, tx.amount),
        error => this.rpc_send_failed(error.message, tx.toAddress, tx.amount));
  }

  public getTransactionFee(tx: TransactionBuilder): Observable<any> {
    tx.estimateFeeOnly = true;
    return this.send(tx);
  }

  /**
   * Executes or estimates a transaction.
   * Estimates if estimateFeeOnly === true.
   */
  private send(tx: TransactionBuilder): Observable<any> {
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
      coinControl.fee_rate = tx.customFee;
    }
    if (tx.replaceable) {
      coinControl.replaceable = tx.replaceable;
    }

    const outputs: Outputs[] = tx.outputs.map(txo => ({
      address: txo.toAddress,
      amount: Amount.fromString(txo.amount),
      subfee: txo.subtractFeeFromAmount,
    }));
    return this._rpc.sendtypeto(tx.input, tx.output, outputs, tx.comment, tx.commentTo, tx.estimateFeeOnly, coinControl);
  }

  private rpc_send_success(json: any, address: string, amount: Amount) {
    this.log.d(`rpc_send_success, succesfully executed transaction with txid ${json}`);

    // Truncate the address to 16 characters only
    const trimAddress = address.substring(0, 16) + '...';
    const txsId = json.substring(0, 45) + '...';
    this.flashNotification.open(`Succesfully sent ${amount.toString()} UTE to ${trimAddress}!\nTransaction id: ${txsId}`, 'warn');
  }

  private rpc_send_failed(message: string, address?: string, amount?: Amount) {
    this.flashNotification.open(`Transaction Failed ${message}`, 'err');
    this.log.er('rpc_send_failed, failed to execute transaction!');
    this.log.er(message);
  }

}
