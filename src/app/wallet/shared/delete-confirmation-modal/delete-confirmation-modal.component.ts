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

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-delete-confirmation-modal',
  templateUrl: './delete-confirmation-modal.component.html',
  styleUrls: ['./delete-confirmation-modal.component.scss']
})
export class DeleteConfirmationModalComponent implements OnInit {

  public dialogContent: string;

  @Output() onDelete: EventEmitter<string> = new EventEmitter<string>();

  constructor(private dialogRef: MatDialogRef<DeleteConfirmationModalComponent>) { }

  ngOnInit(): void {
    this.dialogContent = (this.dialogContent) ? this.dialogContent : 'This item';
  }

  onConfirmDelete(): void {
    this.onDelete.emit();
    this.dialogClose();
  }

  dialogClose(): void {
    this.dialogRef.close();
  }
}
