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

import { Injectable } from '@angular/core';

import { Transaction } from './transaction.model';
import { TransactionService } from './transaction.service';
/*
    This is a fake mock service used for the TransactionService.
    The TransactionTableComponent provides its _own_ TransactionService,
    so we have to override it in all tests that use the component.
*/
@Injectable()
export class MockTransactionService extends TransactionService {
    txs: Array<any> = [];

    postConstructor(i: number) {
      const json = [
        {
          'confirmations': 87,
          'blockhash': '3369674d2bf9dd22a295051be04b96d2744eeea0ba6c19bbab056dff9e261edf',
          'blockindex': 1,
          'blocktime': 1517431088,
          'txid': 'c8ee6c919e5b258f1e29e03c04baa2318b95ede030aa14a25cb9f060ade10cbd',
          'time': 1517431047,
          'timereceived': 1517431047,
          'bip125_replaceable': 'no',
          'fee': -0.00034800,
          'category': 'immature',
          'outputs': [
          ],
          'amount': 0.00000000
        }
      ];

      this.txs = json.map(tx => {
        if (tx !== undefined) {
          return new Transaction(tx);
        }
      });

    }
  };
