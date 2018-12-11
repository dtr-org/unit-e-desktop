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

const mockgetblockchaininfo = {
  'chain': 'regtest',
  'blocks': 105,
  'headers': 105,
  'bestblockhash': '0ffc09b58558536bb26d02d02738b48bd0297f14a083bdb0959dcea427a39ffe',
  'difficulty': 4.656542373906925e-10,
  'mediantime': 1543854410,
  'verificationprogress': 1,
  'initialblockdownload': false,
  'initialsnapshotdownload': false,
  'chainwork': '00000000000000000000000000000000000000000000000000000000000000d4',
  'size_on_disk': 42459,
  'pruned': false,
  'softforks': [
    {
      'id': 'bip34',
      'version': 2,
      'reject': {
        'status': false
      }
    },
    {
      'id': 'bip66',
      'version': 3,
      'reject': {
        'status': false
      }
    },
    {
      'id': 'bip65',
      'version': 4,
      'reject': {
        'status': false
      }
    }
  ],
  'bip9_softforks': {
    'csv': {
      'status': 'defined',
      'startTime': 0,
      'timeout': 9223372036854775807,
      'since': 0
    },
    'segwit': {
      'status': 'active',
      'startTime': -1,
      'timeout': 9223372036854775807,
      'since': 0
    }
  },
  'warnings': ''
};

export default mockgetblockchaininfo;
