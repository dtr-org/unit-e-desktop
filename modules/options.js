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
** exemple:
** --dev -testnet -reindex -rpcuser=user -rpcpassword=pass
** strips --dev out of argv (double dash is not a united argument) and returns
** {
**   dev: true,
**   testnet: true,
**   reindex: true,
**   rpcuser: user,
**   rpcpassword: pass
** }
*/

function isVerboseLevel(arg) {
  let level = 0;
  let notVerbose = false;
  [...arg].map(char => char === 'v' ? level++ : notVerbose = true);
  return notVerbose ? false : level;
}

exports.parse = function() {

  let options = {};
  if (process.argv[0].match(/[Ee]lectron/)) {
    process.argv = process.argv.splice(2); /* striping 'electron .' from argv */
  } else {
    process.argv = process.argv.splice(1); /* striping /path/to/unite from argv */
  }

  // make a copy of process.argv, because we'll be changing it
  // which messes with the map operator
  const args = process.argv.slice(0); 

  args.map((arg, index) => {
    let nDashes = arg.lastIndexOf('-') + 1;
    const argIndex = process.argv.indexOf(arg);
    arg = arg.substr(nDashes);

    if (nDashes === 2) { /* double-dash: desktop-only argument */
      // delete param, so it doesn't get passed to unite-core
      process.argv.splice(argIndex, 1);
      let verboseLevel = isVerboseLevel(arg);
      if (verboseLevel) {
        options['verbose'] = verboseLevel;
        return ;
      }
    } else if (nDashes === 1) { /* single-dash: core argument */
      if (arg.includes('=')) {
        arg = arg.split('=');
        options[arg[0]] = arg[1];
        return ;
      }
    }
    options[arg] = true;
  });

  if (options.testnet) {
    options.regtest = false;
  }

  options.port = options.rpcport
    ? options.rpcport // custom rpc port
    : options.testnet
      ? 18332  // default testnet port
      : options.regtest
        ? 18443  // default regtest port
        : 8332 ; // default mainnet port
  _options = options;
  return options;
}

exports.get = function() {
  return _options;
}
