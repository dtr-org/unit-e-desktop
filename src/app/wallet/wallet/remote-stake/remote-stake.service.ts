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

import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs';
import { Log } from 'ng2-logger'

import { RpcService } from '../../../core/core.module';

import { TransactionBuilder } from '../send/transaction-builder.model';
import { SendService } from '../send/send.service';


@Injectable()
export class RemoteStakeService extends SendService {

  log: any = Log.create('remote-stake.service');

  constructor(_rpc: RpcService,
              dialog: MatDialog) {
    super(_rpc, dialog);
  }

  /**
   * Executes or estimates the fee for a remote staking transaction.
   * Estimates if tx.estimateFeeOnly === true.
   */
  protected send(tx: TransactionBuilder): Observable<any> {
    const [coinControl, outputs] = this.getSendParameters(tx);
    if (outputs.length < 1) {
      return Observable.throw('Transaction has no outputs.');
    }

    return this._rpc.stakeat(outputs[0], tx.estimateFeeOnly, coinControl);
  }
}
