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

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Log } from 'ng2-logger';

import { RpcService } from '../../core/core.module';
import { MatDialogRef } from '@angular/material';
import { UnlockModalConfig } from 'app/modals/models/unlock.modal.config.interface';
import { EncryptionState } from 'app/core/rpc/rpc-types';

@Component({
  selector: 'app-unlockwallet',
  templateUrl: './unlockwallet.component.html',
  styleUrls: ['./unlockwallet.component.scss']
})
export class UnlockwalletComponent {

  // constants
  // DEFAULT_TIMEOUT: number = 60;
  DEFAULT_TIMEOUT: number = 300;
  log: any = Log.create('unlockwallet.component');

  @Output() unlockEmitter: EventEmitter<EncryptionState> = new EventEmitter<EncryptionState>();
  @Input() autoClose: boolean = true;

  private callback: Function;
  timeout: number = this.DEFAULT_TIMEOUT;
  constructor(
    private _rpc: RpcService,
    public _dialogRef: MatDialogRef<UnlockwalletComponent>) {
  }

  unlock(encryptionState: EncryptionState): void {
    // unlock actually happened in password.component.ts
    this.log.d('Unlock signal emitted! = ' + encryptionState );

    if ([EncryptionState.UNLOCKED, EncryptionState.UNLOCKED_FOR_STAKING_ONLY].includes(encryptionState)) {
      if (!!this.callback) {
        this.callback();
      }
      // unlock wallet emitter
      this.unlockEmitter.emit(encryptionState);
      // close the modal!
      this.closeModal();
    } else {
      // TODO: Proper error handling - Error modal?
      this.log.er('Error unlocking');
    }
  }

  /**
  * setData sets the callback information for when the wallet unlocks.
  */
  setData(data: UnlockModalConfig, callback: Function): void {
    this.log.d('setting callback & timeout data');

    if (callback instanceof Function) {
      this.callback = callback;
    }

    if (Number.isInteger(data.timeout)) {
      this.timeout = data.timeout;
    }
    this.autoClose = (data.autoClose !== false)
  }

  closeModal(): void {
    // clear callback data
    this.timeout = this.DEFAULT_TIMEOUT;
    this.log.d('Closing modal!');

    if (this.autoClose && this._dialogRef) {
      this._dialogRef.close();
      this.log.d('Closing modal!');
    }
  }
}
