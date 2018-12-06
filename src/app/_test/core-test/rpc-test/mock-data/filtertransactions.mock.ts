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

const mockfiltertransactions = [
  {
    'confirmations': 1,
    'generated': true,
    'blockhash': '0ffc09b58558536bb26d02d02738b48bd0297f14a083bdb0959dcea427a39ffe',
    'blockindex': 0,
    'blocktime': 1544091789,
    'txid': 'ae1f15cccdcb77b5b6512ecf9c36e57d2b7e1e39f4a39a0206406dbf8a799512',
    'walletconflicts': [
    ],
    'time': 1544091789,
    'timereceived': 1544091789,
    'bip125-replaceable': 'no',
    'category': 'immature',
    'outputs': [
      {
        'address': 'mmvtKUgV6ts8iLnUgeekbUnabbt37CarF3',
        'vout': 0,
        'amount': 50.00025840
      }
    ],
    'amount': 50.00025840
  },
  {
    'confirmations': 1,
    'blockhash': '0ffc09b58558536bb26d02d02738b48bd0297f14a083bdb0959dcea427a39ffe',
    'blockindex': 4,
    'blocktime': 1544091789,
    'txid': '25b4708ba65cd212430aedbc6daff5ed2ab22453d194c059bae78ff49879caad',
    'walletconflicts': [
    ],
    'time': 1544091770,
    'timereceived': 1544091770,
    'bip125-replaceable': 'no',
    'abandoned': 0,
    'fee': -0.00003760,
    'category': 'internal_transfer',
    'outputs': [
      {
        'address': '2N2cPWo6CFVBckZAsA9A175r5aew2X7DuoL',
        'label': '',
        'vout': 0,
        'amount': 1.00000000
      }
    ],
    'amount': 0.00000000
  },
  {
    'confirmations': 1,
    'blockhash': '0ffc09b58558536bb26d02d02738b48bd0297f14a083bdb0959dcea427a39ffe',
    'blockindex': 2,
    'blocktime': 1544091789,
    'txid': 'c205ad3604204500bd1267596678e319b3638b2a6687bcd50d25e644498d9c5c',
    'walletconflicts': [
      '4316e53ac11ccac553d505505dee63e97fb8d6c2dea21bb4fd77bf3e7f430941',
      'c94e8d293fda7f575077f498d4e4fef106018344ba06bafa8d0babf75e1c8ae0'
    ],
    'time': 1544031342,
    'timereceived': 1544031342,
    'bip125-replaceable': 'no',
    'replaces_txid': '4316e53ac11ccac553d505505dee63e97fb8d6c2dea21bb4fd77bf3e7f430941',
    'abandoned': 0,
    'fee': -0.00004980,
    'category': 'send',
    'outputs': [
      {
        'address': '2NBeoLi4mkDeUdDTMohzo5v7Uz1XbGri2wV',
        'label': 'Bob',
        'vout': 0,
        'amount': -0.19996680
      }
    ],
    'amount': -0.19996680
  },
  {
    'confirmations': -1,
    'trusted': false,
    'txid': '4316e53ac11ccac553d505505dee63e97fb8d6c2dea21bb4fd77bf3e7f430941',
    'walletconflicts': [
      'c205ad3604204500bd1267596678e319b3638b2a6687bcd50d25e644498d9c5c',
      'c94e8d293fda7f575077f498d4e4fef106018344ba06bafa8d0babf75e1c8ae0'
    ],
    'time': 1544031334,
    'timereceived': 1544031334,
    'bip125-replaceable': 'yes',
    'replaced_by_txid': 'c205ad3604204500bd1267596678e319b3638b2a6687bcd50d25e644498d9c5c',
    'replaces_txid': 'c94e8d293fda7f575077f498d4e4fef106018344ba06bafa8d0babf75e1c8ae0',
    'abandoned': 0,
    'fee': -0.00004150,
    'category': 'send',
    'outputs': [
      {
        'address': '2NBeoLi4mkDeUdDTMohzo5v7Uz1XbGri2wV',
        'label': 'Bob',
        'vout': 0,
        'amount': -0.19996680
      }
    ],
    'amount': -0.19996680
  },
  {
    'confirmations': -1,
    'trusted': false,
    'txid': 'c94e8d293fda7f575077f498d4e4fef106018344ba06bafa8d0babf75e1c8ae0',
    'walletconflicts': [
      '4316e53ac11ccac553d505505dee63e97fb8d6c2dea21bb4fd77bf3e7f430941',
      'c205ad3604204500bd1267596678e319b3638b2a6687bcd50d25e644498d9c5c'
    ],
    'time': 1544031325,
    'timereceived': 1544031325,
    'bip125-replaceable': 'yes',
    'replaced_by_txid': '4316e53ac11ccac553d505505dee63e97fb8d6c2dea21bb4fd77bf3e7f430941',
    'abandoned': 0,
    'fee': -0.00003320,
    'category': 'send',
    'outputs': [
      {
        'address': '2NBeoLi4mkDeUdDTMohzo5v7Uz1XbGri2wV',
        'label': 'Bob',
        'vout': 0,
        'amount': -0.19996680
      }
    ],
    'amount': -0.19996680
  },
  {
    'confirmations': 1,
    'blockhash': '0ffc09b58558536bb26d02d02738b48bd0297f14a083bdb0959dcea427a39ffe',
    'blockindex': 3,
    'blocktime': 1544091789,
    'txid': 'd0edd1c2f4f26a65dfc39c0af733c69a9a5122f36a401463135fdda5e8e9d792',
    'walletconflicts': [
      'ea50b9fe939b879e6a2c4e5ff824fe7f34a90766b916f83e3731337dd2186549',
      '38f1c478e24eff4da943f6652904f32cdd1ae929f7c40a002d25ef4d79592cfc'
    ],
    'time': 1544031304,
    'timereceived': 1544031304,
    'bip125-replaceable': 'no',
    'replaces_txid': 'ea50b9fe939b879e6a2c4e5ff824fe7f34a90766b916f83e3731337dd2186549',
    'abandoned': 0,
    'fee': -0.00005940,
    'category': 'send',
    'outputs': [
      {
        'address': '2NBeoLi4mkDeUdDTMohzo5v7Uz1XbGri2wV',
        'label': 'Bob',
        'vout': 0,
        'amount': -0.10000000
      },
      {
        'address': '2N6mptEDTaPy8nUAWa5ttwbgL246W2PTKNp',
        'label': 'Empty Label',
        'vout': 2,
        'amount': 0.20000000
      }
    ],
    'amount': -0.10000000
  },
  {
    'confirmations': -1,
    'trusted': false,
    'txid': 'ea50b9fe939b879e6a2c4e5ff824fe7f34a90766b916f83e3731337dd2186549',
    'walletconflicts': [
      'd0edd1c2f4f26a65dfc39c0af733c69a9a5122f36a401463135fdda5e8e9d792',
      '38f1c478e24eff4da943f6652904f32cdd1ae929f7c40a002d25ef4d79592cfc'
    ],
    'time': 1544031122,
    'timereceived': 1544031122,
    'bip125-replaceable': 'yes',
    'replaced_by_txid': 'd0edd1c2f4f26a65dfc39c0af733c69a9a5122f36a401463135fdda5e8e9d792',
    'replaces_txid': '38f1c478e24eff4da943f6652904f32cdd1ae929f7c40a002d25ef4d79592cfc',
    'abandoned': 0,
    'fee': -0.00004950,
    'category': 'send',
    'outputs': [
      {
        'address': '2NBeoLi4mkDeUdDTMohzo5v7Uz1XbGri2wV',
        'label': 'Bob',
        'vout': 0,
        'amount': -0.10000000
      },
      {
        'address': '2N6mptEDTaPy8nUAWa5ttwbgL246W2PTKNp',
        'label': 'Empty Label',
        'vout': 2,
        'amount': 0.20000000
      }
    ],
    'amount': -0.10000000
  },
  {
    'confirmations': -1,
    'trusted': false,
    'txid': '38f1c478e24eff4da943f6652904f32cdd1ae929f7c40a002d25ef4d79592cfc',
    'walletconflicts': [
      'ea50b9fe939b879e6a2c4e5ff824fe7f34a90766b916f83e3731337dd2186549',
      'd0edd1c2f4f26a65dfc39c0af733c69a9a5122f36a401463135fdda5e8e9d792'
    ],
    'time': 1544031103,
    'timereceived': 1544031103,
    'bip125-replaceable': 'yes',
    'replaced_by_txid': 'ea50b9fe939b879e6a2c4e5ff824fe7f34a90766b916f83e3731337dd2186549',
    'abandoned': 0,
    'fee': -0.00003960,
    'category': 'send',
    'outputs': [
      {
        'address': '2NBeoLi4mkDeUdDTMohzo5v7Uz1XbGri2wV',
        'label': 'Bob',
        'vout': 0,
        'amount': -0.10000000
      },
      {
        'address': '2N6mptEDTaPy8nUAWa5ttwbgL246W2PTKNp',
        'label': 'Empty Label',
        'vout': 2,
        'amount': 0.20000000
      }
    ],
    'amount': -0.10000000
  },
  {
    'confirmations': 1,
    'blockhash': '0ffc09b58558536bb26d02d02738b48bd0297f14a083bdb0959dcea427a39ffe',
    'blockindex': 1,
    'blocktime': 1544091789,
    'txid': '4da86451c953f1705a4275b7669d2e71a9040d2b27d489361f3ebe0a9b813c3b',
    'walletconflicts': [
      'd8919f26be684fafb52cdcd1fe3f1227c64ca6bc7077aaf8b07fba21bc641221',
      '6fc6fdb2c3df2829647e565003840389b18d39dc087b47befebfe7960f62f634',
      'a11e2dedf2fe0faf188db91cda58a7a5b1956f6517b17594e0438da37ee3be52',
      '277cb68ff91c305898444f685ab574b9070418cc08d9e6de07c1a9105bf5aa5b',
      '1944e091778ac0bbc4aa1e3b78848929847734e8e50da420ecf6b0d671fc27f3',
      'bb51507af54de5deaf4f85954d87f89abfd88c91c6f4020faa61c4f18fd0c3fb'
    ],
    'time': 1544030073,
    'timereceived': 1544030073,
    'bip125-replaceable': 'no',
    'replaces_txid': '277cb68ff91c305898444f685ab574b9070418cc08d9e6de07c1a9105bf5aa5b',
    'abandoned': 0,
    'fee': -0.00011160,
    'category': 'send',
    'outputs': [
      {
        'address': '2NBeoLi4mkDeUdDTMohzo5v7Uz1XbGri2wV',
        'label': 'Bob',
        'vout': 0,
        'amount': -0.10000000
      }
    ],
    'amount': -0.10000000
  },
  {
    'confirmations': -1,
    'trusted': false,
    'txid': '277cb68ff91c305898444f685ab574b9070418cc08d9e6de07c1a9105bf5aa5b',
    'walletconflicts': [
      'd8919f26be684fafb52cdcd1fe3f1227c64ca6bc7077aaf8b07fba21bc641221',
      '6fc6fdb2c3df2829647e565003840389b18d39dc087b47befebfe7960f62f634',
      '4da86451c953f1705a4275b7669d2e71a9040d2b27d489361f3ebe0a9b813c3b',
      'a11e2dedf2fe0faf188db91cda58a7a5b1956f6517b17594e0438da37ee3be52',
      '1944e091778ac0bbc4aa1e3b78848929847734e8e50da420ecf6b0d671fc27f3',
      'bb51507af54de5deaf4f85954d87f89abfd88c91c6f4020faa61c4f18fd0c3fb'
    ],
    'time': 1544030008,
    'timereceived': 1544030008,
    'bip125-replaceable': 'yes',
    'replaced_by_txid': '4da86451c953f1705a4275b7669d2e71a9040d2b27d489361f3ebe0a9b813c3b',
    'replaces_txid': '1944e091778ac0bbc4aa1e3b78848929847734e8e50da420ecf6b0d671fc27f3',
    'abandoned': 0,
    'fee': -0.00010050,
    'category': 'send',
    'outputs': [
      {
        'address': '2NBeoLi4mkDeUdDTMohzo5v7Uz1XbGri2wV',
        'label': 'Bob',
        'vout': 0,
        'amount': -0.10000000
      }
    ],
    'amount': -0.10000000
  }
];

export default mockfiltertransactions;
