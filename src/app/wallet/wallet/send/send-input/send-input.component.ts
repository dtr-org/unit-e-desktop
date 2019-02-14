/*
 * Copyright (C) 2018-2019 The Unit-e developers
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

import { Component, OnInit, Input } from '@angular/core';
import { UnspentOutput, WalletInfo } from 'app/core/rpc/rpc-types';
import { Amount } from 'app/core/util/utils';
import { TransactionBuilder } from '../transaction-builder.model';
import { RpcStateService, Commands } from 'app/core/core.module';

@Component({
  selector: 'app-send-input',
  templateUrl: './send-input.component.html',
  styleUrls: ['./send-input.component.scss']
})
export class SendInputComponent implements OnInit {

  @Input()
  public transaction: TransactionBuilder;

  // Selected payment source
  paymentSource: ('everything' | 'coin_control') = 'everything';

  totalWalletBalance: Amount = Amount.ZERO;

  selectedBalance: Amount = Amount.ZERO;

  constructor(
    protected _rpcState: RpcStateService,
  ) { }

  ngOnInit() {
    this._rpcState.observe(Commands.GETWALLETINFO)
      .subscribe((walletInfo: WalletInfo) => {
        this.totalWalletBalance = walletInfo.balance;
        if (this.paymentSource === 'everything') {
          this.selectedBalance = this.totalWalletBalance;
        }
      });
  }

  onChangePaymentSource(): void {
    switch (this.paymentSource) {
      case 'everything':
        this.transaction.selectedCoins = null;
        this.selectedBalance = this.totalWalletBalance;
        break;
      case 'coin_control':
        this.selectedBalance = Amount.ZERO;
        break;
    }
  }

  onUpdateSelection(coins: UnspentOutput[]) {
    this.transaction.selectedCoins = coins;
    this.selectedBalance = coins.reduce((sum, coin) => sum.add(coin.amount), Amount.ZERO);
  }
}
