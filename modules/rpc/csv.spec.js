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

const stream = require('stream');
const assert = require('assert').strict;

const { CsvTxWriter } = require('./csv');


const TRANSACTIONS = [
  {
    "confirmations": 1,
    "blockhash": "014613da9d9600af573695e9ed08180633e3859c4b6e0c8a2f963faa87a39c7a",
    "blockindex": 1,
    "blocktime": 1545129515,
    "txid": "88dae4e927f24d519014fa6ca24e4fbb928808a047b83c1d1879e01cbaab35e4",
    "walletconflicts": [
    ],
    "time": 1545069672,
    "timereceived": 1545069672,
    "bip125-replaceable": "no",
    "abandoned": 0,
    "fee": -0.00008780,
    "category": "send",
    "outputs": [
      {
        "address": "2NBeoLi4mkDeUdDTMohzo5v7Uz1XbGri2wV",
        "label": "Bob",
        "vout": 0,
        "amount": -1.00000000
      }
    ],
    "amount": -1.00000000
  },
];

describe('CSV writer', () => {

  it('should create', () => {
    const s = new stream.Writable();
    const writer = new CsvTxWriter(s);
  });

  it('should write CSV header and row', () => {
    const buffer = [];
    const s = new stream.Writable({
      write(chunk, encoding, callback) {
        buffer.push(chunk.toString().trim());
        callback();
      }
    });
    const writer = new CsvTxWriter(s);

    for (const tx of TRANSACTIONS) {
      writer.write(tx);
    }
    writer.end();

    assert.equal(buffer.length, 2);

    const header = buffer[0].split(',');
    assert.equal(header.length, 7);

    const fields = buffer[1].split(',');
    assert.equal(fields[0], 'true');
    assert.equal(fields[1], '2018-12-17 19:01:12');
    assert.equal(fields[2], 'Sent to');
    assert.equal(fields[3], 'Bob');
    assert.equal(fields[4], '2NBeoLi4mkDeUdDTMohzo5v7Uz1XbGri2wV');
    assert.equal(fields[5], '-1.00008780');
    assert.equal(fields[6], '88dae4e927f24d519014fa6ca24e4fbb928808a047b83c1d1879e01cbaab35e4');
  });

});



