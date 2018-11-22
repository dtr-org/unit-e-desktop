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

const { app } = require('electron');
const electron = require('electron');
const path = require('path');
const fs = require('fs');
const log = require('electron-log');


function getRootOrResourcePath() {
  var dir;
  // running from packaged
  if(__dirname.search('app.asar') > -1) {
    dir = __dirname.substring(0, __dirname.indexOf('app.asar')) + 'app.asar';
    dir = path.join(dir, 'dist/assets/icons/notification.png');
  } else {
    dir = path.join(__dirname, '../../src/assets/icons/notification.png');
  }
  console.log('dir:', dir);
  return dir;
}

exports.getRootOrResourcePath = getRootOrResourcePath;