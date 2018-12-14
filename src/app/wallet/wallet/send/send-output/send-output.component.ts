/*
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

import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { Observable } from 'rxjs';
import { Log } from 'ng2-logger';

import { TransactionOutput } from '../transaction-builder.model';
import { AddressHelper } from 'app/core/util/utils';

@Component({
  selector: 'app-send-output',
  templateUrl: './send-output.component.html',
  styleUrls: ['./send-output.component.scss']
})
export class SendOutputComponent {

  private log: any = Log.create('send.component');

  private addressHelper: AddressHelper = new AddressHelper();

  @Input() txo: TransactionOutput;

  @Input() first: boolean;

  @Output() sendAllBalance: EventEmitter<void> = new EventEmitter<void>();

  @Output() remove: EventEmitter<void> = new EventEmitter<void>();

  @Output() openLookup: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild('address') address: ElementRef;

  verifyAddress() {
    this.txo.verifyAddress().catch((error) => {
      this.log.er('verifyAddress: validateAddressCB failed');
      return Observable.empty();
    });
  }

  pasteAddress(): void {
    this.address.nativeElement.focus();
    document.execCommand('Paste');
  }

  @HostListener('document:paste', ['$event'])
  onPaste(event: any) {
    if (this.addressHelper.addressFromPaste(event)) {
      this.address.nativeElement.focus();
    }
  }
}
