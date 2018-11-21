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

import { Injectable, OnDestroy } from '@angular/core';
import { Log } from 'ng2-logger';
import { Observable } from 'rxjs/Observable';

import { NotificationService } from 'app/core/notification/notification.service';
import { RpcService, Commands } from 'app/core/rpc/rpc.service';
import { RpcStateService } from 'app/core/rpc/rpc-state/rpc-state.service';

@Injectable()
export class NewTxNotifierService implements OnDestroy {

  log: any = Log.create(
    'new-tx-notifier.service id:' + Math.floor((Math.random() * 1000) + 1)
  );
  private destroyed: boolean = false;
  private lastTxId: string = undefined;

  constructor(
    private _rpc: RpcService,
    private _rpcState: RpcStateService,
    private _notification: NotificationService
  ) {
    this.log.d('tx notifier service running');
    this._rpcState.observe('getwalletinfo', 'txcount')
      .takeWhile(() => !this.destroyed)
      .subscribe(txcount => {
        this.log.d(`--- update by txcount${txcount} ---`);
        this.checkForNewTransaction();
      });
  }

  // TODO: trigger by ZMQ in the future
  checkForNewTransaction(): void {
    this.log.d('newTransaction()');

    const options = {
      'count': 10
    };
    this._rpc.call(Commands.FILTERTRANSACTIONS, [options])
      .subscribe(
      (txs: Array<any>) => {

        // if no transactions: stop
        if (txs.length === 0) {
          return;
        }

        // not initialized yet
        if (this.lastTxId === undefined) {
          this.lastTxId = txs[0].txid;
        } else {
          txs.some((tx) => {
            // we hit our last transaction, abort notifications
            if (this.lastTxId === tx.txid) {
              return true;
            }
            this.notifyNewTransaction(tx);
          })
          // update tip
          this.lastTxId = txs[0].txid;
        }
      });
  }

  private notifyNewTransaction(tx: any) {
    this.log.d('notify new tx: ' + tx);
    if (tx.category === 'receive') {
      this._notification.sendNotification(
        'Incoming transaction', tx.amount + ' UTE received'
      );
    }
  }

  ngOnDestroy() {
    this.destroyed = true;
  }
}
