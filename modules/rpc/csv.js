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


const stringify = require('csv-stringify');


/**
 * Writes selected transaction fields as CSV to a given stream
 */
class CsvTxWriter {

  constructor(destStream) {
    this.csvStringifier = stringify();
    this.headerWritten = false;

    this.csvStringifier.pipe(destStream);
  }

  getCsvHeader() {
    const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    return ['Confirmed', `Date (${localTimeZone})`, 'Type', 'Label', 'Address', 'Amount (UTE)', 'ID'];
  }

  getCsvRow(t) {
    // UNIT-E: TODO: RPC output doesn't have the 'trusted' field yet
    // const confirmed = (t.trusted && t.category !== 'immature').toString();
    const confirmed = (t.confirmations > 0 || t.category === 'coinbase' || t.category === 'generate').toString();

    const dateString = formatLocalDate(t.time);
    const type = this.getDisplayCategory(t.category);

    // Different outputs are concatenated into one
    const label = t.outputs.map(o => o.label).join(';');
    const address = t.outputs.map(o => o.address).join(';');

    // Total expenditure in Satoshis
    const amount = (t.amount + (t.fee || 0)).toFixed(8);
    const txid = t.txid;

    return [confirmed, dateString, type, label, address, amount, txid];
  }

  getDisplayCategory(category) {
    switch (category) {
      case 'send':
        return 'Sent to';
      case 'receive':
        return 'Received from';
      case 'immature':
      case 'orphan':
      case 'coinbase':
      case 'generate':
        return 'Mined';
      case 'internal_transfer':
        return 'Payment to yourself';
      default:
        return '';
    }
  }

  write(tx) {
    if (!this.headerWritten) {
      this.csvStringifier.write(this.getCsvHeader());
      this.headerWritten = true;
    }

    const csvRow = this.getCsvRow(tx);
    this.csvStringifier.write(csvRow);
  }

  end() {
    this.csvStringifier.end();
  }

  on(event, callback) {
    this.csvStringifier.on(event, callback);
  }
}


exports.CsvTxWriter = CsvTxWriter;


/**
 * Format given Unix timestamp as `YYYY-mm-dd HH:MM:SS`
 */
function formatLocalDate(unixTime) {
  const date = new Date(unixTime * 1000);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1, 2)}-${pad(date.getDate(), 2)} ` +
         `${pad(date.getHours(), 2)}:${pad(date.getMinutes(), 2)}:${pad(date.getSeconds(), 2)}`;
}


/**
 * Left-pad the given object with zeroes up to a given length
 */
function pad(what, length) {
  const chars = `${what}`.split('');
  while (chars.length < length) {
    chars.splice(0, 0, '0');
  }
  return chars.join('');
}
