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

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Log } from 'ng2-logger';

import { RpcStateService } from '../../../../core/rpc/rpc-state/rpc-state.service';

@Component({
  selector: 'app-timeoffset',
  templateUrl: './timeoffset.component.html',
  styleUrls: ['./timeoffset.component.scss']
})
export class TimeoffsetComponent implements OnInit, OnDestroy {

  // general
  private log: any = Log.create('status.component');
  private destroyed: boolean = false;

  // state
  public offset: number = 0;

  constructor(
    private _rpcState: RpcStateService) { }

  ngOnInit() {
    this._rpcState.observe('getnetworkinfo', 'timeoffset')
      .takeWhile(() => !this.destroyed)
      .subscribe(offset => this.offset = offset);
  }

  ngOnDestroy() {
    this.destroyed = true;
  }

}
