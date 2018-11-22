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

import { Component, OnInit, Input } from '@angular/core';
import { Log } from 'ng2-logger';

import { BlockStatusService } from '../../../core/rpc/rpc.module';

@Component({
  selector: 'app-percentage-bar',
  templateUrl: './percentage-bar.component.html',
  styleUrls: ['./percentage-bar.component.scss']
})
export class PercentageBarComponent implements OnInit {

  private log: any = Log.create('app-percentage-bar.component');

  @Input() sidebar: boolean = false;

  /* ui state */
  public initialized: boolean = false; // hide if no progress has been retrieved yet

  /* block state */
  public syncPercentage: number = 0;
  public syncString: string;

  constructor( private _blockStatusService: BlockStatusService) { this.log.d('initiated percentage-bar'); }

  ngOnInit(): void {
    this.log.d('initiated percentage-bar');
    /* Hook BlockStatus -> open syncing modal */
    this._blockStatusService.statusUpdates.asObservable().subscribe(status => {
      this.log.d(`updating percentage-bar`);
      this.updateProgress(status.syncPercentage);
    });
  }

  /**
   * Update sync progress
   * @param {number} number  The sync percentage
   */
  // @TODO create sparate component to display process
  updateProgress(progress: number): void {
    this.log.d('updateProgress', progress);
    this.initialized = true;
    this.syncPercentage = progress;
    this.syncString = progress === 100
      ? 'Fully synced'
      : `${progress.toFixed(2)} %`
  }
}
