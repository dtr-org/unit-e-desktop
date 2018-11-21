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

import { Component, EventEmitter, HostListener, Input, OnDestroy, Output } from '@angular/core';
import { Log } from 'ng2-logger';

import { IPassword } from './password.interface';

import { RpcService, RpcStateService, Commands } from '../../../core/core.module';
import { SnackbarService } from '../../../core/snackbar/snackbar.service';
import { EncryptionState } from 'app/core/rpc/rpc-types';


const DEFAULT_UNLOCK_TIMEOUT = 60;

// When unlocking the wallet for staking, set timeout to infinite
const STAKING_UNLOCK_TIMEOUT = 0;


@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss']
})
export class PasswordComponent implements OnDestroy {


  // UI State
  password: string;
  private destroyed: boolean = false;
  stakingOnly: boolean = false;

  @Input() showPass: boolean = false;
  @Input() label: string = 'Your Wallet password';
  @Input() buttonText: string;
  @Input() unlockTimeout: number = DEFAULT_UNLOCK_TIMEOUT;
  @Input() isDisabled: boolean = false;
  @Input() isButtonDisable: boolean = false;
  @Input() showPassword: boolean = false;
  @Input() showStakingOnly: boolean = false;

  /**
    * The password emitter will send over an object with the password info.
    * This is useful as a building block in the initial setup, where we want to have the actual value of the password.
    */
  @Input() emitPassword: boolean = false;
  @Output() passwordEmitter: EventEmitter<IPassword> = new EventEmitter<IPassword>();
  @Output() showPasswordToggle: EventEmitter<boolean> = new EventEmitter<boolean>();
  /**
    * The unlock emitter will automatically unlock the wallet for a given time and emit the JSON result
    * of 'getwalletinfo'. This can be used to automatically request an unlock and instantly do a certain things:
    * send a transaction, before it locks again.
    */
  @Input() emitUnlock: boolean = false;
  @Output() unlockEmitter: EventEmitter<EncryptionState> = new EventEmitter<EncryptionState>();

  log: any = Log.create('password.component');

  constructor(private _rpc: RpcService,
              private _rpcState: RpcStateService,
              private flashNotification: SnackbarService) {
  }

  ngOnDestroy() {
    this.destroyed = true;
  }

  /** Get the input type - password or text */
  getInputType(): string {
    return (this.showPass ? 'text' : 'password');
  }

  // -- RPC logic starts here --

  unlock (): void {
    this.forceEmit();
  }

  public forceEmit(): void {
    if (this.emitPassword) {
      // emit password
      this.sendPassword();
    }

    if (this.emitUnlock) {
      // emit unlock
      this.rpc_unlock();
    }
  }

  clear(): void {
    this.password = undefined;
  }

  /**
  * Emit password only!
  */
  sendPassword(): void {
    const pass: IPassword = {
      password: this.password,
      stakingOnly: this.stakingOnly,
    };
    this.passwordEmitter.emit(pass);
  }

  /** Unlock the wallet
    * TODO: This should be moved to a service...
    */
  private rpc_unlock(): void {
    if (this.stakingOnly) {
      // The user will want to stake for as long as possible
      this.unlockTimeout = STAKING_UNLOCK_TIMEOUT;
    }

    this.log.i('rpc_unlock: calling unlock! timeout=' + this.unlockTimeout);
    this._rpc.call(Commands.WALLETPASSPHRASE, [
        this.password,
        +this.unlockTimeout,
        this.stakingOnly,
      ])
      .subscribe(
        success => {
          // update state
          this._rpcState.stateCall(Commands.GETWALLETINFO);

          let _subs = this._rpcState.observe('getwalletinfo', 'encryption_state').skip(1)
            .subscribe(
              (encryptionState: EncryptionState) => {
                this.log.d('rpc_unlock: success: unlock was called! New Status:', encryptionState);

                // hook for unlockEmitter, warn parent component that wallet is unlocked!
                this.unlockEmitter.emit(encryptionState);
                if (_subs) {
                  _subs.unsubscribe();
                  _subs = null;
                }
              });
        },
        error => {
          this.log.i('rpc_unlock_failed: unlock failed - wrong password?', error);
          this.flashNotification.open('Unlock failed - password was incorrect', 'err');
        });
  }

  private reset(): void {
    this.password = '';
  }

  // emit showpassword change
  toggle(): void {
    this.showPasswordToggle.emit(this.showPass);
  }

  // capture the enter button
  @HostListener('window:keydown', ['$event'])
    keyDownEvent(event: any) {
      if (event.keyCode === 13) {
        this.unlock();
      }
    }
}
