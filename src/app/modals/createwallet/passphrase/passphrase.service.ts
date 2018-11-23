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

import { Injectable } from '@angular/core';

import { RpcService, Commands } from '../../../core/core.module';

import { Log } from 'ng2-logger';


@Injectable()
export class PassphraseService {

  private log: any = Log.create('passphrase.service');

  private validWords: string[];

  constructor(private _rpc: RpcService) {
    this.validateWord('initWords');
  }

  /*
   * This is the logic for creating a new recovery phrase
  */
  generateMnemonic(success: Function, password?: string) {
    this.log.d(`password: ${password}`);
    const params = ['new', password];

    if (password === undefined || password === '') {
      params.pop();
    }
    this._rpc.call(Commands.MNEMONIC, params)
      .subscribe(
        response => success(response),
        error => Array(24).fill('error'));
  }

  validateWord(word: string): boolean {
    if (!word) {
      return false;
    }

    return true;

    // FIXME: Uncomment when "mnemonic dumpwords" gets implemented in core
    // if (!this.validWords) {
    //   this._rpc.call(Commands.MNEMONIC, ['dumpwords'])
    //   .subscribe(
    //     (response: any) => this.validWords = response.words,
    //     // TODO: Handle error appropriately
    //     error => this.log.er('validateWord: mnemonic - dumpwords: Error dumping words', error));

    //   return false;
    // }

    // return this.validWords.indexOf(word) !== -1;
  }

  importMnemonic(words: string[], password: string) {
    const params = [words.join(' '), password];
    if (!password) {
      params.pop();
    }
    return this._rpc.call(Commands.IMPORTMASTERKEY, params);
  }

  generateDefaultAddresses() {

    /* generate initial address */
    this._rpc.call(Commands.GETNEWADDRESS, ['initial address']).subscribe(
      (response: any) => this.log.i('generateDefaultAddresses(): generated initial address'),
      error => this.log.er('generateDefaultAddresses: getnewaddress failed'));
  }
}
