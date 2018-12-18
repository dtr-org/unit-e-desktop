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

import { ProposerStatus, SyncStatus, ProposerState } from 'app/core/rpc/rpc-types';
import { Amount } from 'app/core/util/amount';

const mockproposerstatus: ProposerStatus = {
  'wallets': [
    {
      'wallet': 'wallet.dat',
      'balance': Amount.fromNumber(12.5),
      'stakeable_balance': Amount.fromNumber(12.5),
      'status': ProposerState.NOT_PROPOSING_NO_PEERS,
      'searches': 0,
      'searches_attempted': 239
    }
  ],
  'sync_status': SyncStatus.SYNCED,
  'time': '2018-11-08 16:16:02',
  'incoming_connections': 0,
  'outgoing_connections': 0
};

export default mockproposerstatus;
