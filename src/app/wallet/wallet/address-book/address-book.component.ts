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

import { Component, HostListener } from '@angular/core';
import { MatDialog, MatSelectChange } from '@angular/material';
import { Log } from 'ng2-logger';

import { NewAddressModalComponent } from './modal/new-address-modal/new-address-modal.component';
import { AddressHelper } from '../../../core/util/utils';

@Component({
  selector: 'app-address-book',
  templateUrl: './address-book.component.html',
  styleUrls: ['./address-book.component.scss']
})
export class AddressBookComponent {

  log: any = Log.create('address-book.component');

  public query: string;
  public filter: RegExp;
  private addressHelper: AddressHelper;
  constructor(
    private dialog: MatDialog) {
    this.addressHelper = new AddressHelper();
  }

  openNewAddress(): void {
    const dialogRef = this.dialog.open(NewAddressModalComponent);
  }

  editLabel(address: string): void {
    this.log.d(`editLabel, address: ${address}`);
    const dialogRef = this.dialog.open(NewAddressModalComponent);
    dialogRef.componentInstance.address = address;
    dialogRef.componentInstance.isEdit = true;
  }

  @HostListener('document:paste', ['$event'])
  onPaste(event: any) {
    if (!this.dialog.openDialogs.length) {
      const address = this.addressHelper.addressFromPaste(event);
      if (!address) {
        return;
      }
      this.editLabel(address);
      this.dialog.openDialogs[0].componentInstance.isEdit = false;
    }
  }
}
