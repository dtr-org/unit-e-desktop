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

const app   = require('electron').app;
const spawn = require('buffered-spawn');
const path  = require('path');
const log   = require('electron-log');

let wallets = [];

// TODO: move to a path.js module
exports.getPath = function () {

  const platform = process.platform
    .replace('freebsd', 'linux')
    .replace('sunos',   'linux');

  if (platform == 'linux') {
    return path.join(app.getPath('home'), '.unit-e');
  } else {
    return app.getPath('userData');
  }
}

exports.get = function () {
  return new Promise((resolve, reject) => {

    if (wallets.length > 0) {
      resolve(wallets);
    }

    // TODO remove when other platforms tested
    resolve([]);
    return;

    spawn('ls', [ exports.getPath() ]).then(files => {

      files = files.stdout.split('\n');
      // keep only wallet.dat and wallet_xxxx.dat files
      files = files.filter(file => /(wallet\.dat|wallet_.+\.dat)/.test(file));
      log.debug('found wallets: ' + files);
      // TODO: add wallets to the list for later use (restart, update)
      resolve(files);

    }).catch(error => log.error('Couldn\'t get wallet list', error));

  });
}
