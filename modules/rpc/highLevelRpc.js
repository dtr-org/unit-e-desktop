/*
 * Copyright (C) 2018 Unit-e developers
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


const rxIpc = require('rx-ipc-electron/lib/main').default;
const { Observable } = require('rxjs/Observable');
const { flatMap } = require('rxjs/operators');

const rpc = require('./rpc');
const { CsvTxWriter } = require('./csv');
const fs = require('fs');


// All the commands which would otherwise require a back-and-forth exchange
// between the renderer and the main processes are implemented here.
// (e.g. commands that run an RPC call, then write the result to a file.)

exports.init = function () {
  rxIpc.registerListener('hl-rpc-channel', (data) => {
    if (!data) {
      return Observable.empty();
    }

    switch (data.command) {
      case 'export-transactions':
        return exportTransactions(data.params);
    }

    return Observable.throw(`Invalid command: ${data.command}`);
  });
}

function exportTransactions(params) {
  let [filters, path] = params;

  // No limit on the number of transactions
  filters.count = 0;

  return rpc.callRx('filtertransactions', [filters])
            .pipe(flatMap((rpcResponse) => writeCsv(path, rpcResponse.result)));
}

function writeCsv(path, transactions) {
  return Observable.create((observer) => {
    const fileStream = fs.createWriteStream(path);
    const csvWriter = new CsvTxWriter(fileStream);

    csvWriter.on('finish', () => {
      observer.next(path);
      observer.complete();
    });
    csvWriter.on('error', (err) => {
      observer.error(err.message);
    })

    for (const tx of transactions) {
      csvWriter.write(tx);
    }
    csvWriter.end();
  });
}
