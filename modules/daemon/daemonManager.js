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

const { app, dialog } = require('electron');
const EventEmitter    = require('events').EventEmitter;

const _    = require('lodash');
const Q    = require('bluebird');
const fs   = require('fs');
const got  = require('got');
const path = require('path');
const log  = require('electron-log');

const options = require('../options');
const ClientBinariesManager = require('../clientBinaries/clientBinariesManager').Manager;

// master
const BINARY_URL = 'https://raw.githubusercontent.com/dtr-org/unit-e-desktop/master/modules/clientBinaries/clientBinaries.json';


class DaemonManager extends EventEmitter {

  constructor() {
    super();
    this._availableClients = {};
    this.binariesDownloaded = false;
    this.nodeInfo = {};

    this.options = options.get();
    this.log = log;
  }

  getPath() {
    return this._availableClients.united.binPath;
  }

  getUserDataDir() {
    return app.getPath('userData');
  }

  async init() {
    this.log.info('Initializing...');

    this._resolveBinPath();

    // If the user provided a custom path to the binary, do not check for updates
    if (this.options.customdaemon) {
      this._emit('done');
      return;
    }

    await this.checkForUpdates();
  }

  /**
   * Download the JSON file containing information on the latest Unit-e release and,
   * if necessary, download and update the `united` binary on disk.
   */
  async checkForUpdates() {
    this.log.info(`Checking for new client binaries config from: ${BINARY_URL}`);

    this._emit('loadConfig', 'Fetching remote client config');

    this.binariesDownloaded = false;

    let latestConfig = await this.fetchLatestConfig();
    let localConfig = await this.updateLocalConfig(latestConfig);
    try {
      await this.downloadUpdate(localConfig);
    } catch (err) {
      this.handleDownloadError(err)
    }
  }

  /** Retrieve the clientBinaries.json file from the GitHub repository. */
  async fetchLatestConfig() {
    try {
      const res = got(BINARY_URL, {
        timeout: 30000,
        json: true
      });
      if (!res || _.isEmpty(res.body)) {
        throw new Error('Invalid fetch result');
      }

      return res.body;
    } catch (err) {
      this.log.warn('Error fetching client binaries config from repo', err);
      this._emit('error', err.message);
    }
  }

  /**
   * Compare the retrieved release configuration with the locally cached one
   * and update the latter, if needed.
   */
  async updateLocalConfig(latestConfig) {
    if (!latestConfig) {
      return;
    }

    let localConfig;
    let skippedVersion;
    const nodeVersion = latestConfig.clients.united.version;

    this._emit('loadConfig', 'Fetching local config');

    // load the local json
    try {
      localConfig = this.readLocalConfig();
    } catch (err) {
      this.log.warn(`Error loading local config - assuming this is a first run: ${err}`);

      if (latestConfig) {
        localConfig = latestConfig;
        this.writeLocalConfig(localConfig);
      } else {
        throw new Error('Unable to load local or remote config, cannot proceed!');
      }
    }

    try {
      skippedVersion = fs.readFileSync(path.join(this.getUserDataDir(), 'skippedNodeVersion.json')).toString();
    } catch (err) {
      this.log.info('No "skippedNodeVersion.json" found.');
    }

    // prepare node info
    const platform = process.platform
      .replace('darwin', 'mac')
      .replace('win32', 'win')
      .replace('freebsd', 'linux')
      .replace('sunos', 'linux');
    const binaryVersion = latestConfig.clients.united.platforms[platform][process.arch];
    const checksums = _.pick(binaryVersion.download, 'sha256', 'md5');
    const algorithm = _.keys(checksums)[0].toUpperCase();
    const hash = _.values(checksums)[0];

    // get the node data, to be able to pass it to a possible error
    this.nodeInfo = {
      type: 'united',
      version: nodeVersion,
      checksum: hash,
      algorithm
    };

    // if new config version available then ask user if they wish to update
    if (latestConfig
      && JSON.stringify(localConfig) !== JSON.stringify(latestConfig)
      && nodeVersion !== skippedVersion) {

      this.log.debug('New client binaries config found...');

      // UNIT-E TODO: Ask user if they want to update
      // await this.askUpdateConfirmation();

      this.writeLocalConfig(latestConfig);
    }

    return localConfig;
  }

  /** Read the last downloaded Unit-e versions file */
  readLocalConfig() {
    return JSON.parse(
      fs.readFileSync(path.join(this.getUserDataDir(), 'clientBinaries.json')).toString()
    );
  }

  /** Write the newly downloaded Unit-e versions file to disk */
  writeLocalConfig(json) {
    this.log.info('Write new client binaries local config to disk ...');

    fs.writeFileSync(
      path.join(this.getUserDataDir(), 'clientBinaries.json'),
      JSON.stringify(json, null, 2)
    );
  }

  async downloadUpdate(localConfig) {
    if (!localConfig) {
      this.log.info('No config for the ClientBinariesManager could be loaded, using local clientBinaries.json.');

      const localConfigPath = path.join(this.getUserDataDir(), 'clientBinaries.json');
      localConfig = (fs.existsSync(localConfigPath))
        ? require(localConfigPath)
        : require('../clientBinaries/clientBinaries.json');
    }

    // scan for node
    const mgr = this.makeClientBinariesManager(localConfig);
    mgr.logger = log;

    this._emit('scanning', 'Scanning for binaries');

    await mgr.init({
      folders: [ path.join(this.getUserDataDir(), 'united', 'unpacked') ]
    });

    const clients = mgr.clients;
    this._availableClients = {};
    const available = _.filter(clients, c => !!c.state.available);

    if (!available.length) {
      if (_.isEmpty(clients)) {
        throw new Error('No client binaries available for this system!');
      }

      this._emit('downloading', 'Downloading binaries');

      mgr.on('download', (status) => {
        this._emit('download', status);
      });

      await Q.map(_.values(clients), (c) => {
        this.binariesDownloaded = true;

        return mgr.download(c.id, {
          downloadFolder: path.join(this.getUserDataDir())
        });
      });
    }

    this._emit('filtering', 'Filtering available clients');

    _.each(mgr.clients, (client) => {
      if (client.state.available) {
        const idlcase = client.id.toLowerCase();

        this._availableClients[idlcase] = {
          binPath: client.activeCli.fullPath,
          version: client.version
        };
      }
    });

    // restart if it downloaded while running
    // if (restart && this.binariesDownloaded) {
    //   this.log.info('Restarting app ...');
    //   app.relaunch();
    //   app.quit();
    // }

    this._emit('done');
  }

  makeClientBinariesManager(localConfig) {
    return new ClientBinariesManager(localConfig);
  }

  handleDownloadError(err) {
    this.log.error(err);

    this._emit('error', err.message);

    // show error
    if (err.message.indexOf('Hash mismatch') !== -1) {
      // show hash mismatch error
      dialog.showMessageBox({
        type: 'warning',
        buttons: ['OK'],
        message: 'Checksum mismatch in downloaded node!',
        detail: `${this.nodeInfo.algorithm}:${this.nodeInfo.checksum}\n\nPlease install the ${this.nodeInfo.type} node version ${this.nodeInfo.version} manually.`
      }, () => {
        app.quit();
      });

      // throw so the main.js can catch it
      throw err;
    }
  }

  // TODO: emit to GUI
  _emit(status, msg) {
    this.log.debug(`Status: ${status} - ${msg}`);
    this.emit('status', status, msg);
  }

  _resolveBinPath() {
    if (this.options.customdaemon) {
      this._availableClients.united = { binPath: this.options.customdaemon };
      return;
    }

    this.log.debug('Resolving path to client binary ...');
    let platform = process.platform;

    // "win32" -> "win" (because nodes are bundled by electron-builder)
    if (platform.indexOf('win') === 0) {
      platform = 'win';
    } else if (platform.indexOf('darwin') === 0) {
      platform = 'mac';
    }

    this.log.debug(`Platform: ${platform}`);

    let binPath = path.join(this.getUserDataDir(), 'united', 'unpacked', 'united');

    if (platform === 'win') {
      binPath += '.exe';
    }

    this.log.debug(`Client binary path: ${binPath}`);

    this._availableClients.united = {
      binPath
    };
  }
}

module.exports = DaemonManager;
