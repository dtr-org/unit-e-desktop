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

const fs          = require('fs');
const log         = require('electron-log');
const options     = require('../options').get();
const datadir     = require('../datadir');
const removeWalletAuthentication = require('../webrequest/http-auth').removeWalletAuthentication;


function getCookieFilePath() {
  const COOKIE_FILE = datadir.getDataDir()
                    + (options.testnet ? '/testnet' : '')
                    + (options.regtest ? '/regtest' : '')
                    + '/.cookie';
  return COOKIE_FILE;
}

/*
** returns the current RPC cookie
** RPC cookie is regenerated at every united startup
*/
function getAuth(options) {

  if (options.rpcuser && options.rpcpassword) {
    return options.rpcuser + ':' + options.rpcpassword;
  }

  let auth;
  const COOKIE_FILE = getCookieFilePath();

  if (checkCookieExists()) {
    auth = fs.readFileSync(COOKIE_FILE, 'utf8').trim();
    console.log('getAuth(): got cookie', auth)
  } else {
    auth = undefined;
    log.debug('could not find cookie file! path:', COOKIE_FILE);
  }

  return (auth)
}

/*
** Removes the .cookie file.
** (only do this if the daemon isn't running)
*/
function clearCookieFile() {
  const COOKIE_FILE = getCookieFilePath();

  // remove cookie file
  if (checkCookieExists()) {
    fs.unlinkSync(COOKIE_FILE);
  }

  removeWalletAuthentication();
}

/*
** Checks if the .cookie file exists.
*/
function checkCookieExists() {
  let f = getCookieFilePath();
  return fs.existsSync(f)
}


exports.getAuth = getAuth;
exports.checkCookieExists = checkCookieExists;
exports.clearCookieFile = clearCookieFile;
