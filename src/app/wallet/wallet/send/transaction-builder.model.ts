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

export enum TxType {
  PUBLIC = 'ute',
}

export enum FeeDetermination {
  DEFAULT = 'default',
  CONFIRMATION = 'confirmation',
  CUSTOM = 'custom',
}

export class TransactionBuilder {
  input: TxType = TxType.PUBLIC;
  output: TxType = TxType.PUBLIC;
  toAddress: string;
  toLabel: string;
  address: string;
  amount: number;
  comment: string;
  commentTo: string;
  numsignatures: number = 1;
  validAddress: boolean;
  validAmount: boolean;
  isMine: boolean;
  currency: string = 'ute';
  ringsize: number = 8;
  sendAll: boolean = false;
  subtractFeeFromAmount: boolean = false;
  replaceable: boolean = false;
  selectedCoins: UnspentOutput[];

  feeDetermination: string = FeeDetermination.DEFAULT;
  selectedFee: number;
  customFee: number = 0.00001;
  confirmationTarget: number = 2;

  estimateFeeOnly: boolean = true;

  constructor() {

  }
}
