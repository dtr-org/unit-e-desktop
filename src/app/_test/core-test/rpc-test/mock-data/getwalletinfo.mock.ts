/*
 * Copyright (C) 2018 Unit-e developers
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

import { Amount } from 'app/core/util/amount';

const mockgetwalletinfo = {
  'walletname': 'wallet.dat',
  'walletversion': 159900,
  'balance': Amount.fromString('249.57959020'),
  'unconfirmed_balance': Amount.fromString('0'),
  'immature_balance': Amount.fromString('5000.00044300'),
  'remote_staking_balance': Amount.fromString('0.57959020'),
  'txcount': 125,
  'keypoololdest': 1543853206,
  'keypoolsize': 1000,
  'keypoolsize_hd_internal': 1000,
  'encryption_state': 'UNENCRYPTED',
  'paytxfee': 0.00000000,
  'hdmasterkeyid': 'df770a5e1fe380d7b288abf065e03a5e4a698873'
};

export default mockgetwalletinfo;
