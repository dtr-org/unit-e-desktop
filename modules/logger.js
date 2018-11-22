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

const log     = require('electron-log');
const options = require('./options.js').get();

exports.init = function () {

  log.transports.console.level = 'info';
  log.transports.file.level    = 'debug';

  log.transports.file.appName = process.platform == 'linux'
    ? 'unit-e-desktop'
    : 'UnitE Desktop';
  let logPath = options.testnet
    ? 'unit-e-desktop-testnet.log'
    : 'unit-e-desktop.log';
  log.transports.file.file = log.transports.file
    .findLogPath(log.transports.file.appName)
    .replace('log.log', logPath);

  switch (options.verbose) {
    case 1:
      log.transports.console.level = 'debug';
      break ;
    case 2:
      log.transports.console.level = 'debug';
      process.argv.push('-printtoconsole');
      break ;
    case 3:
      log.transports.console.level = 'silly';
      process.argv.push('-debug');
      process.argv.push('-printtoconsole');
      break ;
  }

  log.daemon = log.info;

  log.debug(`console log level: ${log.transports.console.level}`);
  log.debug(`file log level: ${log.transports.file.level}`);

  return log;
}
