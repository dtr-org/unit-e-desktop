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

const path = require('path');

let _options = {};

/*
** compose options from arguments
**
** Example:
** --testnet --upnp --rpcuser=user --rpcpassword=hunter2 --datadir=/home/user/.united
** returns
** {
**   testnet: true,
**   upnp: true,
**   rpcuser: user,
**   rpcpassword: 'hunter2',
**   datadir: '/home/user/.united'
** }
*/

function isVerboseLevel(arg) {
  let level = 0;
  let notVerbose = false;
  [...arg].map(char => char === 'v' ? level++ : notVerbose = true);
  return notVerbose ? false : level;
}

const ALLOWED_ARGS = [
  'devtools', 'devport', 'regtest', 'testnet', 'upnp', 'proxy', 'datadir',
  'rpcport', 'rpcuser', 'rpcpassword', 'rpcbind', 'v', 'vv', 'vvv', 'dev',
  'daemonpath',
];

exports.parse = function() {

  let options = {};
  if (process.argv[0].match(/[Ee]lectron/)) {
    process.argv = process.argv.splice(2); /* striping 'electron .' from argv */
  } else {
    process.argv = process.argv.splice(1); /* striping /path/to/unit-e from argv */
  }

  const args = process.argv.slice(0);
  args.map((arg, index) => {
    if (!arg.startsWith('--')) {
      console.error(`Invalid argument: ${arg}.`);
      process.exit(1);
    }
    arg = arg.substr(2);

    let verboseLevel = isVerboseLevel(arg);
    if (verboseLevel) {
      options['verbose'] = verboseLevel;
      return;
    }

    if (arg.includes('=')) {
      const tokens = arg.split('=');
      options[tokens[0]] = tokens[1];
      arg = tokens[0];
    } else {
      options[arg] = true;
    }

    if (!ALLOWED_ARGS.includes(arg)) {
      console.error(`Invalid argument: --${arg}.`);
      process.exit(1);
    }
  });

  // Testnet is the default
  options.regtest = !!options.regtest;
  options.testnet = !options.regtest;

  options.port = options.rpcport
    ? options.rpcport // custom rpc port
    : options.testnet
      ? 17181  // default testnet port
      : 17291;  // default regtest port

  // Angular development server port
  options.devport = options.devport || 4200;
  _options = options;
  return options;
}

exports.get = function() {
  return _options;
}
