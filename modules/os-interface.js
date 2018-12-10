/*
 * Copyright (C) 2018 Unit-e developers
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

const electron = require('electron');
const rxIpc = require('rx-ipc-electron/lib/main').default;
const { Observable } = require('rxjs/Observable');


// Exposes RPC methods that access the OS and windowing interface

exports.init = function () {
  rxIpc.registerListener('os-if', (data) => {
    if (!data) {
      return Observable.empty();
    }

    switch (data.command) {
      case 'file-picker':
        return exports.filePicker(data.params);
    }

    return Observable.throw(`Invalid command: ${data.command}`);
  });
};

exports.filePicker = function (params) {
  return Observable.create((observer) => {
    electron.dialog.showSaveDialog(params, function (pathName) {
      if (pathName) {
        observer.next(pathName);
      }
      observer.complete();
    });
  });
}
