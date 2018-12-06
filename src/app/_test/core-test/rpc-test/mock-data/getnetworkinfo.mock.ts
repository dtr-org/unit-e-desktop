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

const mockgetnetworkinfo = {
  'version': 160300,
  'subversion': '/Feuerland:0.16.3/',
  'protocolversion': 70015,
  'localservices': '000000000000040d',
  'localrelay': true,
  'timeoffset': 0,
  'networkactive': true,
  'connections': 0,
  'networks': [
    {
      'name': 'ipv4',
      'limited': false,
      'reachable': true,
      'proxy': '',
      'proxy_randomize_credentials': false
    },
    {
      'name': 'ipv6',
      'limited': false,
      'reachable': true,
      'proxy': '',
      'proxy_randomize_credentials': false
    },
    {
      'name': 'onion',
      'limited': true,
      'reachable': false,
      'proxy': '',
      'proxy_randomize_credentials': false
    }
  ],
  'relayfee': 0.00001000,
  'incrementalfee': 0.00001000,
  'localaddresses': [
  ],
  'warnings': ''
};

export default mockgetnetworkinfo;
