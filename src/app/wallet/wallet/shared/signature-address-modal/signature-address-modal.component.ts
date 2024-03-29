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

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Log } from 'ng2-logger';

import { SignVerifyMessage } from './sign-verify-message.model';

import { RpcService, RpcStateService, Commands } from '../../../../core/core.module';
import { ModalsHelperService } from 'app/modals/modals.module';
import { SnackbarService } from '../../../../core/snackbar/snackbar.service';


import { AddressLookUpCopy } from '../../models/address-look-up-copy';
import { AddressLookupComponent } from '../../addresslookup/addresslookup.component';


@Component({
  selector: 'app-signature-address-modal',
  templateUrl: './signature-address-modal.component.html',
  styleUrls: ['./signature-address-modal.component.scss']
})
export class SignatureAddressModalComponent implements OnInit {

  public type: string;
  public formData: SignVerifyMessage = new SignVerifyMessage();
  public validAddress: boolean;
  public addressForm: FormGroup;
  public isDisabled: boolean = true;
  public isAddressLookup: boolean = false;
  public tabIndex: number = 1;

  log: any = Log.create('SignatureAddressModalComponent.component');

  @ViewChild('addressInput') addressInput: ElementRef;
  @ViewChild('signatureInput') signatureInput: ElementRef;

  constructor(private dialog: MatDialog,
              private _rpc: RpcService,
              private _rpcState: RpcStateService,
              private flashNotification: SnackbarService,
              private formBuilder: FormBuilder,

              // @TODO rename ModalsHelperService to ModalsService after modals service refactoring.
              private modals: ModalsHelperService,
              private dialogRef: MatDialogRef<SignatureAddressModalComponent>) {
  }

  ngOnInit() {
    if (this.type === 'verify') {
      this.tabIndex = 1;
      this.isDisabled = false;
    } else {
      this.tabIndex = 0;
      this.type = 'sign';
    }
    this.buildForm();
  }

  buildForm(): void {
    this.addressForm = this.formBuilder.group({
      address: this.formBuilder.control(null, [Validators.required]),
      signature: this.formBuilder.control({value: null, disabled: this.isDisabled}, [Validators.required]),
      message: this.formBuilder.control(null),
    });
  }

  selectTab(index: number): void {
    this.type = (index) ? 'verify' : 'sign';
    this.isDisabled = (this.type !== 'verify');
    this.buildForm();
  }

  openLookup(): void {
    const dialogRef = this.dialog.open(AddressLookupComponent);
    // @TODO confirm lookup type
    dialogRef.componentInstance.type = (this.type === 'sign') ? 'sign' : 'send';
    dialogRef.componentInstance.filter = 'Public';
    dialogRef.componentInstance.selectAddressCallback.subscribe((response: AddressLookUpCopy) => {
      this.selectAddress(response);
      dialogRef.close();
    });
  }

  selectAddress(copyObject: AddressLookUpCopy): void {
    this.formData.address = copyObject.address;
    this.verifyAddress();
  }

  // copy code start

  /** verifyAddress: calls RPC to validate it. */
  verifyAddress() {
    if (!this.formData.address) {
      this.validAddress = undefined;
      return;
    }

    const validateAddressCB = (response) => {
       this.validAddress = response.isvalid;
    };

    this._rpc.call(Commands.VALIDATEADDRESS, [this.formData.address])
      .subscribe(
        response => validateAddressCB(response),
        error => this.log.er('verifyAddress: validateAddressCB failed'));
  }
  // copy code end

  onFormSubmit(): void {
    this.modals.unlock({timeout: 3}, (status) => this.signVerifyMessage());
  }

  signVerifyMessage(): void {
    const address: string = this.formData.address;
    const message: string = (this.formData.message !== undefined) ? this.formData.message : '';
    const signature: string = this.formData.signature;

    if (this.type === 'sign') {
      this._rpc.call(Commands.SIGNMESSAGE, [address, message])
        .subscribe(response => {
            this.formData.signature = response;
            this.flashNotification.open('Message Sign Successfully');
          },
          error => {
          // @TODO add generic message
            this.flashNotification.open(error.message);
            this.log.er(`signVerifyMessage, RPC returned an error when signing message. ${error.message}`);
          });
    } else {
      this._rpc.call(Commands.VERIFYMESSAGE, [address, signature, message])
        .subscribe(response => {
            if (response) {
              this.flashNotification.open('Message verified.');
            } else {
              this.flashNotification.open(
                `Message verification failed:\n
                the supplied signature and/or message were invalid for this address!`);
            }
          },
          error => {
            // @TODO add generic message
            this.flashNotification.open(error.message);
            this.log.er(`signVerifyMessage, RPC returned an error when verifying message. ${error.message}`);
          });
    }
  }

  resetForm(): void {
    this.addressForm.reset();
  }

  pasteAddress(): void {
    this.addressInput.nativeElement.focus();
    document.execCommand('paste');
  }

  copyToClipBoard(): void {
    this.flashNotification.open('Signature copied to clipboard.');
  }

  pasteSignature(): void {
    this.signatureInput.nativeElement.focus();
    document.execCommand('paste');
  }

  dialogClose(): void {
    this.dialogRef.close();
  }
}
