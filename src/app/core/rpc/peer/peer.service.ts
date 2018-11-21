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

import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Observer, Subscription } from 'rxjs'; // use this for testing atm
import { Log } from 'ng2-logger';

import { RpcService, Commands } from '../rpc.service';

@Injectable()
export class PeerService implements OnDestroy {

  private log: any = Log.create('peer.service');
  private destroyed: boolean = false;

  // TODO: Peer interface
  private _peerList: Observable<Array<Object>>;
  private _observerPeerList: Observer<Array<Object>>;

  private _highestBlockHeightInternal: Observable<number>;
  private _observerHighestBlockHeightInternal: Observer<number>;

  private _highestBlockHeightNetwork: Observable<number>;
  private _observerHighestBlockHeightNetwork: Observer<number>;
  private subs: Subscription;

  constructor(private _rpc: RpcService) {

    this._peerList = Observable.create(
      observer => this._observerPeerList = observer
    ).publishReplay(1).refCount();
    this._peerList.subscribe().unsubscribe();

    // setup observable for internal block height
    this._highestBlockHeightInternal = Observable.create(
      observer => this._observerHighestBlockHeightInternal = observer
    ).publishReplay(1).refCount();
    this._highestBlockHeightInternal.subscribe().unsubscribe();

    // setup observable for network block height
    this._highestBlockHeightNetwork = Observable.create(
      observer => this._observerHighestBlockHeightNetwork = observer
    ).publishReplay(1).refCount();

    this._highestBlockHeightNetwork.subscribe().unsubscribe();

    /* Initiate peer list loop */
    this.updatePeerListLoop();

  }

  /** A loop that will update the peerlist, required for blockstatus */
  private updatePeerListLoop() {
    this.log.d(`updatePeerListLoop(): updating peerlist`);

    this._rpc.call(Commands.GETPEERINFO).subscribe(
      (peerinfo: Array<Object>) => this.setPeerList(peerinfo),
      error => this.log.er(`updatePeerListLoop(): getpeerinfo error ${error}`)
    );

    this._rpc.call(Commands.GETBLOCKCOUNT).subscribe(
      blockcount => this._observerHighestBlockHeightInternal.next(blockcount),
      error => this.log.er(`updatePeerListLoop(): getblockcount error ${error}`)
    );

    if (!this.destroyed) {
      setTimeout(this.updatePeerListLoop.bind(this), 10000);
    }
  }

  private setPeerList(peerList: Array<Object>) {

    // update network block height changes
    this._observerHighestBlockHeightNetwork.next(this.calculateBlockCountNetwork(peerList));

    this._observerPeerList.next(peerList);
  }

  private calculateBlockCountNetwork(peerList: Array<Object>): number {
    let highestBlockHeightNetwork = -1;

    peerList.forEach(peer => {
      const networkHeightByPeer = (<any>peer).currentheight;

      if (highestBlockHeightNetwork < networkHeightByPeer || highestBlockHeightNetwork === -1) {
        highestBlockHeightNetwork = networkHeightByPeer;
      }
    });

    return highestBlockHeightNetwork;
  }

  getBlockCount(): Observable<number> {
    return this._highestBlockHeightInternal;
  }

  getBlockCountNetwork(): Observable<number> {
    return this._highestBlockHeightNetwork;
  }

  getPeerList(): Observable<Array<Object>> {
    return this._peerList;
  }

  // TODO: destroy other observables
  ngOnDestroy() {
    this.destroyed = true;
  }
}
