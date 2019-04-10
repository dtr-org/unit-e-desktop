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

const Observable  = require('rxjs/Observable').Observable;
const rxIpc       = require('rx-ipc-electron/lib/main').default;
const log         = require('electron-log');

/* Constants */
const ZMQ_CHANNEL = "zmq";

const SPY_ON_ZMQ = true;

/* references */
let mainReference = null;

exports.init = function (mainWindow) {
    /*
        Store a reference of the main window (electron),
        which we need for rx-ipc-electron (need to get webContents).
    */
    mainReference = mainWindow;
}

/*
    Sends a message to the Angular frontend, on the channel "zmq".
    Subchannels can be anything "wtxhash", "smsg", .. (unit-e-core)
    TODO (maybe): promise structure?
*/
exports.send = function(subchannel, ...data) {
    log.debug(" [rm] sending zmq coolaid from node -> angular");
    try {
      rxIpc.runCommand(ZMQ_CHANNEL, mainReference.webContents, subchannel, ...data)
        .subscribe(
        (returnData) => {
            if(SPY_ON_ZMQ) {
                log.debug('zmq.send: ', returnData);
            }
        },
        (error) => {
          log.error("zmq.send: subchan: " + subchannel + " data: " + data + " error: " + err);
        },
        () => {
          log.debug("completed!");
        }
        );
    } catch (error) {
      log.debug("zmq.send: failed to runCommand (maybe window closed): " + error);
    }

  }

  exports.test = function() {
    exports.send("wtxhash", "somehashtoget");
    setTimeout(exports.test, 30 * 1000);
  }
