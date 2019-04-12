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
const os          = require('os');
const path        = require('path');

const options    = require('./options').get();


/*
** directory resolver
*/
function prepareDir(dirPath) {
    // jshint -W040
    if (!this || this.or !== prepareDir || !this.result) {
        // if dirPath couldn't be resolved
        if (!dirPath) {
            // return this function to be chained with .or()
            return { or: prepareDir };
        }

        //noinspection JSCheckFunctionSignatures
        dirPath = path.join.apply(path, arguments);
        mkDir(dirPath);

        try {
            fs.accessSync(dirPath, fs.W_OK);
        } catch (e) {
            // return this function to be chained with .or()
            return { or: prepareDir };
        }
    }

    return {
        or: prepareDir,
        result: (this ? this.result : false) || dirPath
    };
}

/*
** create a directory
*/
function mkDir(dirPath, root) {
    let dirs = dirPath.split(path.sep);
    let dir = dirs.shift();
    root = (root || '') + dir + path.sep;

    try {
        fs.mkdirSync(root);
    } catch (e) {
        if (!fs.statSync(root).isDirectory()) {
            throw new Error(e);
        }
    }

    return !dirs.length || mkDir(dirs.join(path.sep), root);
}

/*
** returns unit-e config folder
*/
function getDefaultUniteCorePath() {
    let homeDir = os.homedir ? os.homedir() : process.env['HOME'];

    let dir,
        appName = 'Unit-e';
    switch (process.platform) {
      case 'linux': {
        dir = prepareDir(homeDir, '.' + appName.toLowerCase()).result;
        break;
      }

      case 'darwin': {
        dir = prepareDir(homeDir, 'Library', 'Application Support', appName).result;
        break;
      }

      case 'win32': {
        dir = prepareDir(process.env['APPDATA'], appName)
             .or(homeDir, 'AppData', 'Roaming', appName).result;
        break;
      }
    }

    if (dir) {
      return dir;
    } else {
      return false;
    }
  }

  exports.getDataDir = function() {
    return options.datadir ? options.datadir : getDefaultUniteCorePath();
  };
