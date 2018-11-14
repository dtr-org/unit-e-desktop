import { Component, OnInit } from '@angular/core';
import { RpcStateService, Commands } from '../../../../core/core.module';
import { Amount } from '../../../../core/util/utils';

type Severity = 'alert' | 'info' | 'success';

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
      .subscribe(proposer => {
        if (proposer && proposer.wallets) {
          this.stakeableBalance = new Amount(proposer.wallets[0].stakeable_balance);
          [this.proposerStatus, this.severity] = this.getStatusString(proposer.wallets[0].status);
        }
      });
  }

  private getStatusString(proposerStatus: string): [string, Severity] {
    switch (proposerStatus) {
      case 'IS_PROPOSING':
        return ['Proposing', 'success'];
      case 'JUST_PROPOSED_GRACE_PERIOD':
        return ['Just proposed; grace period', 'success'];
      case 'NOT_PROPOSING_WALLET_LOCKED':
        return ['Not proposing: wallet locked', 'info'];
      case 'NOT_PROPOSING_SYNCING_BLOCKCHAIN':
        return ['Not proposing: syncing blockchain', 'info'];
      case 'NOT_PROPOSING':
        return ['Not proposing', 'alert'];
      case 'NOT_PROPOSING_NO_PEERS':
        return ['Not proposing: no peers', 'alert'];
      case 'NOT_PROPOSING_NOT_ENOUGH_BALANCE':
        return ['Not proposing: not enough balance', 'alert'];
      case 'NOT_PROPOSING_DEPTH':
        return ['Not proposing: depth', 'alert'];
      case 'NOT_PROPOSING_LIMITED':
        return ['Not proposing: limited', 'alert'];
      case 'NOT_PROPOSING_LAGGING_BEHIN':
        return ['Not proposing: lagging behind', 'alert'];
      default:
        return ['Invalid', 'alert'];
    }
  }

}
