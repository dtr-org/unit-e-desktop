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

import { Component, OnInit } from '@angular/core';
import { RpcStateService, Commands } from '../../../../core/core.module';
import { Amount } from '../../../../core/util/utils';
import { ProposerState, ProposerStatus } from 'app/core/rpc/rpc-types';

type Severity = 'alert' | 'info' | 'success';

// The user-friendly message and alert category for proposer state values
const STATUS_MAPPINGS = new Map<ProposerState, [string, Severity]>([
  [ProposerState.IS_PROPOSING, ['Proposing', 'success']],
  [ProposerState.JUST_PROPOSED_GRACE_PERIOD, ['Just proposed; grace period', 'success']],
  [ProposerState.NOT_PROPOSING_WALLET_LOCKED, ['Not proposing: wallet locked', 'info']],
  [ProposerState.NOT_PROPOSING_SYNCING_BLOCKCHAIN, ['Not proposing: syncing blockchain', 'info']],
  [ProposerState.NOT_PROPOSING, ['Not proposing', 'alert']],
  [ProposerState.NOT_PROPOSING_NO_PEERS, ['Not proposing: no peers', 'alert']],
  [ProposerState.NOT_PROPOSING_NOT_ENOUGH_BALANCE, ['Not proposing: not enough balance', 'alert']],
  [ProposerState.NOT_PROPOSING_DEPTH, ['Not proposing: depth', 'alert']],
  [ProposerState.NOT_PROPOSING_LIMITED, ['Not proposing: limited', 'alert']],
  [ProposerState.NOT_PROPOSING_LAGGING_BEHIND, ['Not proposing: lagging behind', 'alert']],
]);

@Component({
  selector: 'app-stakinginfo',
  templateUrl: './stakinginfo.component.html',
  styleUrls: ['./stakinginfo.component.scss']
})
export class StakingInfoComponent implements OnInit {

  // UI
  public proposerStatus: string;
  public severity: Severity = 'success';
  public stakeableBalance: Amount = Amount.ZERO;

  constructor(private _rpcState: RpcStateService) { }

  ngOnInit() {
    this._rpcState.observe(Commands.PROPOSERSTATUS)
      .subscribe((proposer: ProposerStatus) => {
        if (proposer && proposer.wallets) {
          this.stakeableBalance = proposer.wallets[0].stakeable_balance;
          [this.proposerStatus, this.severity] = this.getStatusString(proposer.wallets[0].status);
        }
      });
  }

  private getStatusString(proposerState: ProposerState): [string, Severity] {
    return STATUS_MAPPINGS.get(proposerState);
  }

}
