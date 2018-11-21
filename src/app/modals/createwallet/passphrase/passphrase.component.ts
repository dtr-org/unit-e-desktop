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

import {
  Component,
  Input,
  OnChanges,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild
} from '@angular/core';
import { Log } from 'ng2-logger';

import { PassphraseService } from './passphrase.service';
import { SnackbarService } from '../../../core/snackbar/snackbar.service';

const MAX_WORDS = 24;

@Component({
  selector: 'app-passphrase',
  templateUrl: './passphrase.component.html',
  styleUrls: ['./passphrase.component.scss'],
})
export class PassphraseComponent implements  OnChanges {

  Arr: Function = Array;

  focused: number = 0;
  public editable: number[] = [];

  @ViewChild('phrase') phrase: ElementRef;
  @Input() words: string[] = Array(MAX_WORDS).fill('');

  @Input() readOnly: boolean = false;
  @Input() isDisabled: boolean = false;
  @Input() partialDisable: boolean = false;
  @Input() generate: boolean = false;

  @Output() wordsEmitter: EventEmitter<string> = new EventEmitter<string>();
  @Output() seedImportedSuccesfulEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();

  log: any = Log.create('passphrase.component');

  constructor(
    private _passphraseService: PassphraseService,
    private flashNotificationService: SnackbarService) {
  }

  ngOnChanges(): void {
    this.editable = [];
  }

  checkFocus(event: KeyboardEvent, index: number): void {
    if (event.key === ' ') {
      this.focused = index + 1;
      while (this.partialDisable && this.validateWord(this.words[this.focused], this.focused)) {
        this.focused++;
      }
    }
  }

  onBlur(index: number): void {
    this.words[index] = this.words[index].trim();
  }

  splitAndFill(index: number): void {
    setTimeout(() => { // Paste event is called before input (modal change)
      if (this.partialDisable || this.words[index].indexOf(' ') === -1) {
        return;
      }

      const words = this.words[index].split(' ');

      words.forEach((word, i) => {
        if (i + index < MAX_WORDS) {
          this.words[i + index] = this.validateWord(word.trim(), -1) ? word.trim() : 'INVALID';
        }
      });
    }, 1);
  }

  validateWord(word: string, index: number): boolean {
    if (index !== -1 && word === '' && this.canEdit(index)) {
      this.editable.unshift(index);
    }

    return this._passphraseService.validateWord(word);
  }

  canEdit(index: number): boolean {
    return (this.editable.indexOf(index) === -1);
  }

  sendWords(): void {
    this.wordsEmitter.emit(
      this.words.map(Function.prototype.call, String.prototype.trim)
      .join(' '));
  }

  clear(): void {
    this.words = Array(MAX_WORDS).fill('');
  }

  copyToClipBoard(): void {
    this.flashNotificationService.open('Wallet recovery phrase copied to clipboard.');
  }

  pasteContent() {
    this.phrase.nativeElement.focus();
    document.execCommand('Paste');
  }
}
