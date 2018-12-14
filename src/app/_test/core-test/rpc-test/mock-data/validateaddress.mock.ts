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

import { ValidateAddress } from 'app/core/rpc/rpc-types';

const OUR_ADDRESS = '2N6mptEDTaPy8nUAWa5ttwbgL246W2PTKNp';
const THEIR_ADDRESS = '2NBeoLi4mkDeUdDTMohzo5v7Uz1XbGri2wV';

const mock_our_addrinfo: ValidateAddress = {
  isvalid: true,
  address: '2N6mptEDTaPy8nUAWa5ttwbgL246W2PTKNp',
  scriptPubKey: 'a91494633e50dccefb17597b76e0c8a0993f93235de287',
  ismine: true,
  iswatchonly: false,
  isscript: true,
  iswitness: false,
  script: 'witness_v0_keyhash',
  hex: '0014acafbb9d0f8d282a0fa85aa63ca642b9b6c25da0',
  pubkey: '032b044d78728d9333a82c7f478c9e81bcb7dbdc684296c1e6432b2a1d61f1dbb7',
  embedded: {
    isscript: false,
    iswitness: true,
    witness_version: 0,
    witness_program: 'acafbb9d0f8d282a0fa85aa63ca642b9b6c25da0',
    pubkey: '032b044d78728d9333a82c7f478c9e81bcb7dbdc684296c1e6432b2a1d61f1dbb7',
    address: 'bcrt1q4jhmh8g0355z5ragt2nrefjzhxmvyhdqr8ka0l',
    scriptPubKey: '0014acafbb9d0f8d282a0fa85aa63ca642b9b6c25da0'
  },
  addresses: [
    'bcrt1q4jhmh8g0355z5ragt2nrefjzhxmvyhdqr8ka0l'
  ],
  account: 'initial address',
  timestamp: 1543853205,
  hdkeypath: 'm/0\'/0\'/0\'',
  hdmasterkeyid: 'df770a5e1fe380d7b288abf065e03a5e4a698873'
};

const mock_their_addrinfo: ValidateAddress = {
  isvalid: true,
  address: '2NBeoLi4mkDeUdDTMohzo5v7Uz1XbGri2wV',
  scriptPubKey: 'a914c9e7ac15989309a4438f0b7d88e8ee45796df84787',
  ismine: false,
  iswatchonly: false,
  isscript: true,
  iswitness: false,
  account: 'Bob'
};

export { OUR_ADDRESS, THEIR_ADDRESS, mock_our_addrinfo, mock_their_addrinfo };
