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

const mocklistunspent: any = [
  {
    'txid': '6223e381a1f6401154cb2c9c2dd3109e59551bda215939e47581707c2ea65c47',
    'vout': 0,
    'address': 'msD5x6j7EGM7U7uEXeSibihtz3tcGgsfTE',
    'account': 'Empty Label',
    'scriptPubKey': '21038f1de6da6de4dab384cd2db4159362f908d68269e5e7264188cbb381230f8ac4ac',
    'amount': 50.00000000,
    'confirmations': 101,
    'spendable': true,
    'solvable': true,
    'safe': true
  },
  {
    'txid': 'c205ad3604204500bd1267596678e319b3638b2a6687bcd50d25e644498d9c5c',
    'vout': 1,
    'address': '2N58zjWSjUQtZPkPrZzK1RnnTj4bCrr7x2v',
    'redeemScript': '0014642987db64141276e48c120eb4e1230d03ba3064',
    'scriptPubKey': 'a9148273f2f9f79c937c52234a119eb85c34332f552887',
    'amount': 49.76987000,
    'confirmations': 1,
    'spendable': true,
    'solvable': true,
    'safe': true
  },
  {
    'txid': 'd0edd1c2f4f26a65dfc39c0af733c69a9a5122f36a401463135fdda5e8e9d792',
    'vout': 1,
    'address': '2N9VcGTEtqMypCh71fw7Lz5qFyJBsnbfvL4',
    'redeemScript': '0014bb66d5785b781373d83f7139573dac43e95f2ebd',
    'scriptPubKey': 'a914b23a6ef2f816ecc2a8510aae2d91572b0795f7ea87',
    'amount': 49.48986940,
    'confirmations': 1,
    'spendable': true,
    'solvable': true,
    'safe': true
  },
  {
    'txid': 'd0edd1c2f4f26a65dfc39c0af733c69a9a5122f36a401463135fdda5e8e9d792',
    'vout': 2,
    'address': '2N6mptEDTaPy8nUAWa5ttwbgL246W2PTKNp',
    'account': 'Empty Label',
    'redeemScript': '0014acafbb9d0f8d282a0fa85aa63ca642b9b6c25da0',
    'scriptPubKey': 'a91494633e50dccefb17597b76e0c8a0993f93235de287',
    'amount': 0.20000000,
    'confirmations': 1,
    'spendable': true,
    'solvable': true,
    'safe': true
  },
  {
    'txid': '81a0600a9fa5146c462f1d7bc84e8d6782b03a39290d88cf9ad96cad5a760dac',
    'vout': 1,
    'address': '2MzQ66HSHh3fym1cLqn8tgFajc7Ftgf8JPC',
    'account': 'First',
    'redeemScript': '0014b227f36d679cff23fbda60ef54e07844304bc1a7',
    'scriptPubKey': 'a9144e76084dc45734e90d539f73e1f570f04a426fc187',
    'amount': 0.01000000,
    'confirmations': 2,
    'spendable': true,
    'solvable': true,
    'safe': true
  },
  {
    'txid': '25b4708ba65cd212430aedbc6daff5ed2ab22453d194c059bae78ff49879caad',
    'vout': 0,
    'address': '2N2cPWo6CFVBckZAsA9A175r5aew2X7DuoL',
    'account': '',
    'redeemScript': '0014e12af688916632cf5ce271e14338bdfc29dbcd15',
    'scriptPubKey': 'a91466b9d1b783bf4a879ff2638b8e477fd981d460c087',
    'amount': 1.00000000,
    'confirmations': 1,
    'spendable': true,
    'solvable': true,
    'safe': true
  },
  {
    'txid': '25b4708ba65cd212430aedbc6daff5ed2ab22453d194c059bae78ff49879caad',
    'vout': 1,
    'address': '2MtDogmsZkHEeQYScNPg61UUp9NZuHKEvsR',
    'redeemScript': '001423c627fc9a21eaa300ed20d4f9ced62783964e56',
    'scriptPubKey': 'a9140ab36c72decab4d9645c483c3e9de0a9049cf2db87',
    'amount': 48.99996240,
    'confirmations': 1,
    'spendable': true,
    'solvable': true,
    'safe': true
  },
  {
    'txid': '1b5c0e12cc2010bbd56a05235d7493009209c43f6ac29a305c8d14fb510c3cdf',
    'vout': 0,
    'address': 'msD5x6j7EGM7U7uEXeSibihtz3tcGgsfTE',
    'account': 'Empty Label',
    'scriptPubKey': '21038f1de6da6de4dab384cd2db4159362f908d68269e5e7264188cbb381230f8ac4ac',
    'amount': 50.00000000,
    'confirmations': 103,
    'spendable': true,
    'solvable': true,
    'safe': true
  },
  {
    'txid': '95baa63e012b80de5ac6aaa03774fa3d1ce74581e75abd626de152253cf508fd',
    'vout': 0,
    'address': '2N6mptEDTaPy8nUAWa5ttwbgL246W2PTKNp',
    'account': 'Empty Label',
    'redeemScript': '0014acafbb9d0f8d282a0fa85aa63ca642b9b6c25da0',
    'scriptPubKey': 'a91494633e50dccefb17597b76e0c8a0993f93235de287',
    'amount': 0.01000000,
    'confirmations': 3,
    'spendable': true,
    'solvable': true,
    'safe': true
  }
];

export default mocklistunspent;
