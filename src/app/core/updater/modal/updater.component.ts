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

import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-updater',
  templateUrl: './updater.component.html',
  styleUrls: ['./updater.component.scss']
})
export class UpdaterComponent implements OnInit {

  public status: number = 0;

  constructor(
    private dialog: MatDialogRef<UpdaterComponent>,
  ) { }

  ngOnInit() {
  }

  /**
   * Used to set the status in the component with latest update progress.
   * @param status
   */
  set(status: any) {
    if (['started', 'busy'].includes(status.status)) {
      this.status = Math.trunc((status.transferred / status.total) * 100);
    } else if (['error', 'done'].includes(status.status)) {
      this.dialog.close();
    }
  }
}
