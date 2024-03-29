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

import { Injectable } from '@angular/core';
import { Log } from 'ng2-logger';
import { Observable, Observer } from 'rxjs'; // use this for testing atm

import { Address, deserialize } from './address.model';
import { RpcService, Commands } from '../../../core/core.module';


@Injectable()
export class AddressService {
  private log: any = Log.create('address.service');

  private typeOfAddresses: string = 'send'; // "receive","send", "total"

  // Stores address objects.
  public _addresses: Observable<Array<Address>>;
  private _observerAddresses: Observer<Array<Address>>;

  // Type
  addressType: string = 'send'; // "receive","send", "total"

  /**
    * How many addresses do we display per page and keep in memory at all times. When loading more
    * addresses they are fetched JIT and added to addresses.
    */
  MAX_ADDRESSES_PER_PAGE: number = 5;

  private addressCount: number = 0;

  // Stores address objects.
  addresses: Address[] = [];

  // Pagination stuff
  currentPage: number = 0;
  totalPageCount: number = 0;

  constructor(private _rpc: RpcService) {
    this._addresses = Observable.create(observer => this._observerAddresses = observer).publishReplay(1).refCount();

    // Force initialization of _observerAddresses
    this._addresses.subscribe().unsubscribe();

    this.updateAddressList();
  }

  updateAddressList() {
    this.log.d(`updateAddressList() old length: ${this.addressCount}`);
    this._rpc.addressBookInfo().subscribe(
      success => this.rpc_loadAddressCount_success(success),
      error => this.log.er(`updateAddressList, failed with error ${error}`));
  }

  getAddresses(): void {
    this.updateAddressList()
  }

  private rpc_loadAddressCount_success(response: any): void {
    if (this.typeOfAddresses === 'receive') {
      this.addressCount = response.num_receive;
    } else if (this.typeOfAddresses === 'send') {
      this.addressCount = response.num_send;
      this.log.d(`rpc_loadAddressCount_success, num_send: ${this.addressCount}`);
    } else {
      this.addressCount = response.total;
    }

    if (this.addressCount > 0) {
      this.rpc_filterAddresses()
        .subscribe(
          (success: Array<Object>) => {
            this.rpc_loadAddresses(success);
          });
    } else {
      const addresses: Address[] = [];
      this._observerAddresses.next(addresses);
    }
  }

  private rpc_filterAddresses() {
    if (this.typeOfAddresses === 'send') {
      return this._rpc.filterAddresses(0, this.addressCount, 0, '',  2);
    }  else if (this.typeOfAddresses === 'receive') {
      return this._rpc.filterAddresses(0, this.addressCount, 0, '',  1);
    } else {
      return this._rpc.filterAddresses(0, this.addressCount, 0, '');
    }
  }

  private rpc_loadAddresses(response: Array<Object>) {
    let addresses: Address[] = [];
    response.forEach((resp) => addresses = this.addAddress(addresses, resp));
    this._observerAddresses.next(addresses);
  }

  // Adds an address to array from JSON object.
  private addAddress(addresses: Address[], json: Object): Address[] {
    const instance = deserialize(json, Address);

    if (typeof instance.address === 'undefined') {
      return;
    }
    addresses.unshift(instance);
    return addresses;
  }
}

