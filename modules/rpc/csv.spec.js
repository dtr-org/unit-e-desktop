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


describe('CSV writer', () => {

  it('should create', () => {
    const s = new stream.Writable();
    const writer = new CsvTxWriter(s);
  });

  it('should write CSV header and row', () => {
    const buffer = [];
    const s = new stream.Writable({
      write(chunk, encoding, callback) {
        buffer.push(chunk);
        callback();
      }
    });
    const writer = new CsvTxWriter(s);

    writer.write({ time: 1544621607, outputs: [] });
    writer.end();

    assert.equal(buffer.length, 2);
  });

});
