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
  public stakeableBalance: Amount = new Amount(0);

  constructor(private _rpcState: RpcStateService) { }

  ngOnInit() {
    this._rpcState.observe(Commands.PROPOSERSTATUS)
      .subscribe((proposer: ProposerStatus) => {
        if (proposer && proposer.wallets) {
          this.stakeableBalance = new Amount(proposer.wallets[0].stakeable_balance);
          [this.proposerStatus, this.severity] = this.getStatusString(proposer.wallets[0].status);
        }
      });
  }

  private getStatusString(proposerState: ProposerState): [string, Severity] {
    return STATUS_MAPPINGS.get(proposerState);
  }

}
