import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Log } from 'ng2-logger';

import { RpcStateService } from '../rpc-state/rpc-state.service';
import { ProposerStatus } from '../rpc-types';

@Injectable()
export class BlockStatusService {

  private log: any = Log.create('blockstatus.service id:' + Math.floor((Math.random() * 1000) + 1));

  /* Block variables */
  private highestBlockHeightNetwork: number = -1;
  private highestBlockHeightInternal: number = -1;
  private startingBlockCount: number = -1;
  private totalRemainder: number = -1;

  /* Last time we had a change in block count */
  private lastUpdateTime: number; // used to calculate the estimatedTimeLeft

  /* The last five hundred estimatedTimeLeft results, averaging this out for stable result */
  private arrayLastEstimatedTimeLefts: Array<number> = [];
  private amountToAverage: number = 100;

  public statusUpdates: Subject<any> = new Subject<any>();

  private status: any = {
    syncPercentage: 0,
    syncStatus: undefined,
  };

  constructor(
    private _rpcState: RpcStateService
  ) {
    // Retrieve the syncing status as returned by the `proposerstatus` RPC call
    this.log.d('constructor blockstatus');
    this._rpcState.observe('proposerstatus')
      .subscribe(
        (proposerStatus: ProposerStatus) => {
          if (proposerStatus.sync_status === this.status.syncStatus) {
            return;
          }

          this.status.syncStatus = proposerStatus.sync_status;
          this.status.syncPercentage = (proposerStatus.sync_status === 'SYNCED') ? 100 : 0;

          this.statusUpdates.next(this.status);
        },
        error => console.log('constructor blockstatus: state blocks subscription error:' + error));
  }

}
