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

import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { Log } from 'ng2-logger';

import { RpcService, RpcStateService, Commands } from '../../../../../core/core.module';
import { SnackbarService } from '../../../../../core/snackbar/snackbar.service';


import { AddressService } from '../../../shared/address.service';
import { ModalsHelperService } from 'app/modals/modals.module';

@Component({
  selector: 'app-new-address-modal',
  templateUrl: './new-address-modal.component.html',
  styleUrls: ['./new-address-modal.component.scss']
})
export class NewAddressModalComponent implements OnInit {
  public addAddressBookForm: FormGroup;
  public address: string;
  public label: string;
  public isEdit: boolean;
  public modalTitle: string;

  log: any = Log.create('app-new-address-modal');

  /*
   Validation state
   */
  public validAddress: boolean = undefined;
  public isMine: boolean = undefined;
  @ViewChild('addressInput') addressInput: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<NewAddressModalComponent>,
    private formBuilder: FormBuilder,
    private _rpc: RpcService,
    private _rpcState: RpcStateService,
    private flashNotificationService: SnackbarService,

    // @TODO rename ModalsHelperService to ModalsService after modals service refactoring.
    private modals: ModalsHelperService,
    private _addressService: AddressService) {
  }

  ngOnInit(): void {
    if (this.isEdit) {
      this.verifyAddress();
      this.modalTitle = 'Edit address';
    } else {
      this.modalTitle = 'Add new address to Address book';
    }
    this.buildForm();
  }

  buildForm(): void {
    this.addAddressBookForm = this.formBuilder.group({
      address: this.formBuilder.control(null, [Validators.required]),
      label: this.formBuilder.control(null, [Validators.required]),
    });
  }

  closeModal(): void {
    this.addAddressBookForm.reset();
    this.dialogRef.close();
  }

  /**
   * Returns if the entered address is valid or not AND if it is not ours (isMine).
   */
  checkAddress(): boolean {
    return this.validAddress && !this.isMine;
  }

  /*
   RPC Logic
   */

  /**
   * Adds the address to the addressbook if address is valid & has label (in UI textbox) AND is not one of our own addresses.
   */
  onSubmitForm(): void {
    if (!this.validAddress) {
      this.flashNotificationService.open('Please enter a valid address!');
      return;
    }

    if (this.isMine) {
      this.flashNotificationService.open('This is your own address - can not be added to Address book!');
      return;
    }

    if (this.label !== undefined && this.label.trim() && !this.isMine) {
      this.modals.unlock({timeout: 3}, (status) => this.addressCallBack());
      this.dialogRef.close();
    }
  }

  private addressCallBack(): void {
    this._rpc.call(Commands.MANAGEADDRESSBOOK, ['newsend', this.address, this.label])
      .subscribe(
        response => this.rpc_addAddressToBook_success(response),
        error => this.rpc_addAddressToBook_failed(error));
  }

  /**
   * Address was added succesfully to the address book.
   */
  rpc_addAddressToBook_success(json: any): void {
    if (json.result === 'success') {
      this.closeModal();
      const message: string = (this.isEdit) ? 'Address successfully updated to the Address book'
        : 'Address successfully added to the Address book';

      this.flashNotificationService.open(message);
      // TODO: remove specialPoll! (updates the address table)
      // this._rpc.specialPoll();
      this._addressService.updateAddressList();
    }
  }

  /**
   * Address was not added to the addressbook
   * e.g: wallet still locked
   */
  rpc_addAddressToBook_failed(json: Object): void {
    this.closeModal();
    this.log.er('rpc_addAddressToBook_failed');
    this.log.er(json);
    // TODO: remove specialPoll! (updates the address table)
    // this._rpc.specialPoll();
    this._addressService.updateAddressList();
  }

  /*
   Verify address
   */

  /**
   * Verify if address is valid through RPC call and set state to validAddress..
   */
  verifyAddress() {
    if (this.address === undefined || this.address === '') {
      this.validAddress = undefined;
      this.isMine = undefined;
      return;
    }

    this._rpc.call(Commands.VALIDATEADDRESS, [this.address])
      .subscribe(
        response => {
          this.validAddress = response.isvalid;
          this.isMine = response.ismine;
          if (response.account !== undefined) {
            this.label = response.account;
          }

          if (this.isMine) {
            this.flashNotificationService
            .open('This is your own address - can not be added to Address book!', 'err');
          }
        },
        error => this.log.er('rpc_validateaddress_failed'));
    return;
  }

  pasteAddress(): void {
    this.addressInput.nativeElement.focus();
    document.execCommand('paste');
  }
}
