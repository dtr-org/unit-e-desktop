/*
 * Copyright (C) 2017-2018 The Particl developers
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

import { Component, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material';

import { RpcStateService, BlockStatusService } from '../../core/core.module';

import { Log } from 'ng2-logger';
import { SyncStatus } from 'app/core/rpc/rpc-types';


// The user-friendly message for proposer blockchain sync status values
const SYNC_MAPPINGS = new Map<SyncStatus, string>([
  [SyncStatus.SYNCED, 'Synced.'],
  [SyncStatus.IMPORTING, 'Importing...'],
  [SyncStatus.REINDEXING, 'Reindexing...'],
  [SyncStatus.NO_TIP, 'No tip.'],
  [SyncStatus.MINIMUM_CHAIN_WORK_NOT_REACHED, 'Minimum chain work not reached.'],
  [SyncStatus.MAX_TIP_AGE_EXCEEDED, 'Max tip age exceeded.'],
]);

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

  getSyncStatusString(syncStatus: SyncStatus): string {
    return SYNC_MAPPINGS.get(syncStatus);
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
