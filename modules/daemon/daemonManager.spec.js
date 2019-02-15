/*
 * Copyright (C) 2018 The Unit-e developers
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

const assert = require('assert').strict;

const options = require('../options');
const DaemonManager = require('./daemonManager');

const LOCAL_CONFIG = {
  clients: {
    united: {
      version: "0.1",
      platforms: {
        linux: {
          x64:{
            download: {
              url: 'http://127.0.0.1/unite-0.1.tar',
              type: 'tar' ,
              sha256: '16a571275244ce72fbff5d3a2c2f28860e4fd1c73e7576e9977ed19f795b0d5a',
              bin: 'unite-0.1/bin/united'
            }}}}}}}

const LATEST_CONFIG = {
  clients: {
    united: {
      version: "0.2",
      platforms: {
        linux: {
          x64:{
            download: {
              url: 'http://127.0.0.1/unite-0.2.tar',
              type: 'tar' ,
              sha256: '1c73e7576e9977ed19f795b0d5a16a571275244ce72fbff5d3a2c2f28860e4fd',
              bin: 'unite-0.2/bin/united'
            }}}}}}}


describe('DaemonManager', () => {

  it('should respect custom path set in options', () => {
    const customDaemon = '/tmp/united';
    options.get().customdaemon = customDaemon;
    const daemonManager = new DaemonManager();

    daemonManager.init();

    assert.equal(daemonManager.getPath(), customDaemon);
  });

  it('should download new daemon versions', async () => {
    delete options.get().customdaemon;

    const binariesManager = new MockClientBinariesManager();

    const daemonManager = new DaemonManager();
    daemonManager.log = { info: () => {}, error: () => {}, debug: () => {} };
    daemonManager.getUserDataDir = () => '/userdata';
    daemonManager.readLocalConfig = () => LOCAL_CONFIG;
    daemonManager.writeLocalConfig = () => {};
    daemonManager.fetchLatestConfig = () => Promise.resolve(LATEST_CONFIG);
    daemonManager.makeClientBinariesManager = () => binariesManager;

    await daemonManager.init();

    assert.ok(daemonManager.binariesDownloaded);
    assert.deepStrictEqual(binariesManager.downloadCalls, [['united', { downloadFolder: '/userdata' }]]);
  });

  it('should now download anything when existing version is already current', async () => {
    delete options.get().customdaemon;

    const binariesManager = new MockClientBinariesManager();
    binariesManager.clients.united.state.available = true;

    const daemonManager = new DaemonManager();
    daemonManager.log = { info: () => {}, error: () => {}, debug: () => {} };
    daemonManager.getUserDataDir = () => '/userdata';
    daemonManager.readLocalConfig = () => LOCAL_CONFIG;
    daemonManager.writeLocalConfig = () => {};
    daemonManager.fetchLatestConfig = () => Promise.resolve(LATEST_CONFIG);
    daemonManager.makeClientBinariesManager = () => binariesManager;

    await daemonManager.init();

    assert.equal(daemonManager.binariesDownloaded, false);
    assert.deepStrictEqual(binariesManager.downloadCalls, []);
  });
});


class MockClientBinariesManager {
  constructor() {
    this.clients = {
      united: {
        id: 'united',
        activeCli: { fullPath: '/home/user/unit-e-desktop/united' },
        state: { available: false }
      }
    };
    this.downloadCalls = [];
  }

  init() {}

  on() {}

  async download(id, options) {
    this.downloadCalls.push([id, options]);
  }
}
