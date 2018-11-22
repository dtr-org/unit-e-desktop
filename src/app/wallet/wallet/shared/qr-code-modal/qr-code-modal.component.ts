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

import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material';

import { SnackbarService } from '../../../../core/core.module';

@Component({
  selector: 'app-qr-code-modal',
  templateUrl: './qr-code-modal.component.html',
  styleUrls: ['./qr-code-modal.component.scss']
})
export class QrCodeModalComponent {

  @ViewChild('qrCode') qrElementView: ElementRef;

  public singleAddress: any = {
    label: 'Empty label',
    address: 'Empty address',
    owned: false
  };

  constructor(
    private snackbar: SnackbarService,
    public dialogRef: MatDialogRef<QrCodeModalComponent>
  ) { }

  getQrSize(): number {
    return this.qrElementView.nativeElement.offsetWidth;
  }

  showAddress(address: string) {
    return address.match(/.{1,4}/g);
  }

  copyToClipBoard(): void {
    this.snackbar.open('Address copied to clipboard.', '');
  }

  dialogClose(): void {
    this.dialogRef.close();
  }

}
