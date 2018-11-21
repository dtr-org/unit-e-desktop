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

const log = require('electron-log');
const { session } = require('electron')
const { URL } = require('url')

const _options = require('../options');
const cookie = require('../rpc/cookie');

// Modify the user agent for all requests to the following urls.
const filter = {
    urls: ['*']
}

let whitelist = new Map();

exports.init = function () {
    loadDev();
    loadWalletAuthentication();
    loadGithub();

    session.defaultSession.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
        // clone it
        const url = new URL(details.url);
        const u = url.hostname + ":" + url.port;

        if (isWhitelisted(u)) {
            let headers = Object.assign({}, details.requestHeaders);

            // get authentication
            let auth = getAuthentication(u);

            if(auth === undefined && u === "localhost:4200") {
                auth = false;
            }

            if(auth !== undefined) {
                if (auth === false) {
                    // no authentication required

                    callback({ cancel: false, requestHeaders: headers });
                } else {
                    // inject authentication into headers
                    headers['Authorization'] = 'Basic ' + new Buffer(auth).toString('base64')
                    callback({ cancel: false, requestHeaders: headers })
                }
            } else {
                log.error('No authentication retrieved!');
                callback({ cancel: true });
            }

        } else {
            log.error('Not whitelisted: ' + u);
            callback({ cancel: true });
        }
    })

}

function isWhitelisted(url) {
    return whitelist.has(url);
}

// Get the right authentication for the right hostname
// e.g market vs rpc
function getAuthentication(url) {
    entry = whitelist.get(url);
    if (entry && entry.auth) {
        return entry.auth;
    } else {
        // cookie might not be grabbed just yet, so try again..
        if (entry.name === "wallet") {
            loadWalletAuthentication();
        }
        return undefined;
    }
}

function loadWalletAuthentication() {
    let options = _options.get();
    let key = (options.rpcbind || 'localhost') + ":" + options.port;
    console.log('adding key=' + key);
    let value = {
        name: "wallet",
        auth: cookie.getAuth(options)
    }

    whitelist.set(key, value);
}

// when restarting, delete authentication
exports.removeWalletAuthentication = () => {
    let options = _options.get();
    let key = (options.rpcbind || 'localhost') + ":" + options.port;
    whitelist.get(key).auth = undefined;
}

function loadDev() {
    let options = _options.get();
    let key = 'localhost:4200';
    let value = {
        name: "dev",
        auth: false
    }

    whitelist.set(key, value);
}

function loadGithub() {
    let key = "api.github.com:80";
    let value = {
        name: "github update service",
        auth: false
    }

    whitelist.set(key, value);
}
