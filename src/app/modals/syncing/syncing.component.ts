import { Component, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material';

import { RpcStateService, BlockStatusService } from '../../core/core.module';

import { Log } from 'ng2-logger';

@Component({
  selector: 'app-syncing',
  templateUrl: './syncing.component.html',
  styleUrls: ['./syncing.component.scss']
})
export class SyncingComponent implements OnDestroy {

  log: any = Log.create('syncing.component');
  private destroyed: boolean = false;

  manuallyOpened: boolean;
  syncPercentage: number;
  syncStatusString: string;
  nPeers: number;

  /* modal stuff */
  alreadyClosedOnce: boolean = false;


  constructor(
    private _blockStatusService: BlockStatusService,
    private _rpcState: RpcStateService,
    public _dialogRef: MatDialogRef<SyncingComponent>
  ) {
    _rpcState.observe('getnetworkinfo', 'connections')
      .takeWhile(() => !this.destroyed)
      .subscribe(connections => this.nPeers = connections);

    this._blockStatusService.statusUpdates.asObservable().subscribe(status => {
      this.manuallyOpened = status.manuallyOpened;
      this.syncPercentage = status.syncPercentage;
      this.syncStatusString = this.getSyncStatusString(status.syncStatus);

      if (status.syncPercentage === 100 && !this.manuallyOpened) {
        this.closeOnceHackishly();
      }
    });
  }

  getSyncStatusString(syncStatus: string): string {
    switch (syncStatus) {
      case 'SYNCED':
        return 'Synced.';
      case 'IMPORTING':
        return 'Importing...';
      case 'REINDEXING':
        return 'Reindexing...';
      case 'NO_TIP':
        return 'No tip.';
      case 'MINIMUM_CHAIN_WORK_NOT_REACHED':
        return 'Minimum chain work not reached.';
      case 'MAX_TIP_AGE_EXCEEDED':
        return 'Max tip age exceeded.';
      default:
        return ''
    }
  }

  closeOnceHackishly() {
    if (!this.alreadyClosedOnce) {
        // BUG: this constructor is on a loop when we're syncing?
        // run united with -reindex flag to trigger the bug
        this.log.d(`syncPercentage is 100%, closing automatically!`);
        this.close();
        this.alreadyClosedOnce = true;
      }
  }

  close() {
    this._dialogRef.close();
  }

  ngOnDestroy() {
    this.destroyed = true;
  }
}
