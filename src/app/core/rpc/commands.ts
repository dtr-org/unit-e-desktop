/*
 * Copyright (C) 2017-2018 The Particl developers
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

enum Commands {
  INVALID = '',
  ADDRESSBOOKINFO = 'addressbookinfo',
  BUMPFEE = 'bumpfee',
  ENCRYPTWALLET = 'encryptwallet',
  FILTERADDRESSES = 'filteraddresses',
  FILTERTRANSACTIONS = 'filtertransactions',
  GETBLOCKCHAININFO = 'getblockchaininfo',
  GETBLOCKCOUNT = 'getblockcount',
  GETNETWORKINFO = 'getnetworkinfo',
  GETNEWADDRESS = 'getnewaddress',
  GETPEERINFO = 'getpeerinfo',
  GETRECEIVEDBYADDRESS = 'getreceivedbyaddress',
  GETTRANSACTION = 'gettransaction',
  GETWALLETINFO = 'getwalletinfo',
  IMPORTMASTERKEY = 'importmasterkey',
  LISTUNSPENT = 'listunspent',
  MANAGEADDRESSBOOK = 'manageaddressbook',
  MNEMONIC = 'mnemonic',
  PROPOSERSTATUS = 'proposerstatus',
  RESCANBLOCKCHAIN = 'rescanblockchain',
  RUNSTRINGCOMMAND = 'runstringcommand',
  SENDTYPETO = 'sendtypeto',
  SIGNMESSAGE = 'signmessage',
  VALIDATEADDRESS = 'validateaddress',
  VERIFYMESSAGE = 'verifymessage',
  WALLETLOCK = 'walletlock',
  WALLETPASSPHRASE = 'walletpassphrase',
}
export { Commands };
