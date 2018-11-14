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

    if (encryptionState === 'UNLOCKED' || encryptionState === 'UNLOCKED_FOR_STAKING_ONLY') {
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
