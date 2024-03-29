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


import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';
import { Log } from 'ng2-logger';

import { ModalsHelperService } from 'app/modals/modals.module';
import { RpcService, RpcStateService, Commands } from '../../../core/core.module';

import { ConsoleModalComponent } from './modal/help-modal/console-modal.component';
import { EncryptionState } from 'app/core/rpc/rpc-types';


@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss']
})
export class StatusComponent implements OnInit, OnDestroy {

  // UI state
  public encryptionStatus: string = 'Locked';
  public lockIcon: string = '';

  peerListCount: number = 0;
  encryptionState: EncryptionState;

  private _sub: Subscription;
  private destroyed: boolean = false;

  private log: any = Log.create('status.component');


  constructor(
    private _rpc: RpcService,
    private _rpcState: RpcStateService,
    /***
     *  @TODO rename ModalsHelperService to ModalsService after modals service refactoring.
    */

    private _modals: ModalsHelperService,
    private dialog: MatDialog) { }

  ngOnInit() {
    this._rpcState.observe('getnetworkinfo', 'connections')
      .takeWhile(() => !this.destroyed)
      .subscribe(connections => this.peerListCount = connections);

    this._rpcState.observe('getwalletinfo', 'encryption_state')
      .takeWhile(() => !this.destroyed)
      .subscribe((encryptionState: EncryptionState) => {
        this.encryptionState = encryptionState;
        [this.encryptionStatus, this.lockIcon] = this.getEncryptionDisplay();
      });

    /* Bug: If you remove this line, then the state of 'txcount' doesn't update in the Transaction.service */
    this._rpcState.observe('getwalletinfo', 'txcount').takeWhile(() => !this.destroyed).subscribe(txcount => { });
  }

  ngOnDestroy() {
    this.destroyed = true;
  }

  getIconNumber(): number {
    switch (true) {
      case this.peerListCount <= 0: return 0;
      case this.peerListCount < 4: return 2;
      case this.peerListCount < 8: return 3;
      case this.peerListCount < 12: return 4;
      case this.peerListCount < 16: return 5;
      case this.peerListCount >= 16: return 6;
      default: return 0;
    }
  }

  /**
   * Return the user-readable encryption status string and the wallet lock icon.
   */
  getEncryptionDisplay(): [string, string] {
    switch (this.encryptionState) {
      case EncryptionState.LOCKED:
        return ['Locked', ''];
      case EncryptionState.UNENCRYPTED:
        return ['Unencrypted', '-off'];  // TODO: icon?
      case EncryptionState.UNLOCKED:
        return ['Unlocked', '-off'];
      case EncryptionState.UNLOCKED_FOR_STAKING_ONLY:
        return ['Unlocked, staking only', '-stake'];
    }
  }

  toggle() {
    switch (this.encryptionState) {
      case EncryptionState.UNENCRYPTED:
        this._modals.encrypt();
        break;
      case EncryptionState.UNLOCKED:
      case EncryptionState.UNLOCKED_FOR_STAKING_ONLY:
        this._rpc.call(Commands.WALLETLOCK)
          .subscribe(
            success => this._rpcState.stateCall(Commands.GETWALLETINFO),
            error => this.log.er('walletlock error'));
        break;
      case EncryptionState.LOCKED:
        this._modals.unlock({});
        break;
    }
  }

  /* Open Debug Console Window */
  openConsoleWindow() {
    this.dialog.open(ConsoleModalComponent);
  }
}
