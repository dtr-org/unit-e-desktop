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

const electron      = require('electron');
const log           = require('electron-log');
const rxIpc         = require('rx-ipc-electron/lib/main').default;

const ipc           = require('./ipc/ipc');
const rpc           = require('./rpc/rpc');
const highLevelRpc  = require('./rpc/highLevelRpc');
const zmq           = require('./zmq/zmq');

const daemon        = require('./daemon/daemon');
const daemonWarner  = require('./daemon/update');
const DaemonManager = require('./daemon/daemonManager');
const multiwallet   = require('./multiwallet');

// Global instance
const daemonManager = new DaemonManager(electron.app, electron.dialog);


exports.start = function (mainWindow) {
  // Initialize IPC listeners
  rpc.init();

  daemon.init({ rxIpc, rpc, daemonManager });

  highLevelRpc.init();

  /* Initialize ZMQ */
  zmq.init(mainWindow);
  // zmq.test(); // loop, will send tests

  /* Initialize daemonWarner */
  // warns GUI that daemon is downloading
  daemonWarner.init();
  daemonManager.on('status', (status, msg) => {
    if (status === "download") {
      daemonWarner.send(msg);
    }
  });

  exports.startDaemonManager();
}

exports.startDaemonManager = function() {
  daemon.check()
    .then(()            => log.info('daemon already started'))
    .catch(()           => daemonManager.init())
    .catch((error)      => log.error(error));
}

/*
  Start daemon when we get the GO sign from daemonManager.
  Listen for daemonManager errors too..

  Only happens _after_ daemonManager.init()
*/
daemonManager.on('status', (status, msg) => {

  // Done -> means we have a binary!
  if (status === 'done') {
    log.debug('daemonManager returned successfully, starting daemon!');
    multiwallet.get()
    // TODO: activate for prompting wallet
    // .then(wallets       => ipc.promptWalletChoosing(wallets, mainWindow.webContents))
    .then(chosenWallets => daemon.start(chosenWallets))
    .catch(err          => log.error(err));
    // TODO: activate for daemon ready IPC message to RPCService
    // .then(()            => ipc.daemonReady(mainWindow.webContents))


  } else if (status === 'error') {
    // Failed to get clientBinaries.json => connection issues?
    if (msg === 'Request timed out') {
      log.error('Unable to fetch the latest clients.');

      // alert that we weren't able to update.
      electron.dialog.showMessageBox({
        type: 'warning',
        buttons: ['Stop', 'Retry'],
        message: 'Unable to check for updates, please check your connection. Do you want to retry?'
      }, (response) => {
        if(response === 1) {
          exports.startDaemonManager();
        }
      });
    }

    log.debug('daemonManager errored: ' + msg);
  }

});

electron.app.on('before-quit', function beforeQuit(event) {
  log.info('received quit signal, cleaning up...');

  event.preventDefault();
  electron.app.removeListener('before-quit', beforeQuit);

  // destroy IPC listeners
  rpc.destroy();

  daemon.stop().then(() => {
    log.info('daemon.stop() resolved!');
  });
});

electron.app.on('quit', (event, exitCode) => {
  log.info('Exiting!');
});
