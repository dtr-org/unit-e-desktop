import { Amount } from '../util/amount';

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


// Types sent to the server (pure JSON)

export class Outputs {
  address: string;
  amount: string;
  subfee?: boolean;
  script?: string;
  narr?: string;
};

export enum EstimateMode {
  UNSET = 'UNSET',
  ECONOMICAL = 'ECONOMICAL',
  CONSERVATIVE = 'CONSERVATIVE',
}

export class CoinControl {
  changeaddress?: string;
  inputs?: any;
  replaceable?: boolean;
  conf_target?: number;
  estimate_mode?: EstimateMode;
  fee_rate?: string;
  ignore_remote_staked?: boolean;
}

// Types returned from the server (preprocessed)

export class BumpFeeResult {
  txid?: string;
  origfee: Amount;
  fee: Amount;
  errors: string[];
}

export enum SyncStatus {
  SYNCED = 'SYNCED',
  IMPORTING = 'IMPORTING',
  REINDEXING = 'REINDEXING',
  NO_TIP = 'NO_TIP',
  MINIMUM_CHAIN_WORK_NOT_REACHED = 'MINIMUM_CHAIN_WORK_NOT_REACHED',
  MAX_TIP_AGE_EXCEEDED = 'MAX_TIP_AGE_EXCEEDED',
}

export enum ProposerState {
  NOT_PROPOSING = 'NOT_PROPOSING',
  IS_PROPOSING = 'IS_PROPOSING',
  JUST_PROPOSED_GRACE_PERIOD = 'JUST_PROPOSED_GRACE_PERIOD',
  NOT_PROPOSING_SYNCING_BLOCKCHAIN = 'NOT_PROPOSING_SYNCING_BLOCKCHAIN',
  NOT_PROPOSING_NO_PEERS = 'NOT_PROPOSING_NO_PEERS',
  NOT_PROPOSING_NOT_ENOUGH_BALANCE = 'NOT_PROPOSING_NOT_ENOUGH_BALANCE',
  NOT_PROPOSING_DEPTH = 'NOT_PROPOSING_DEPTH',
  NOT_PROPOSING_WALLET_LOCKED = 'NOT_PROPOSING_WALLET_LOCKED',
  NOT_PROPOSING_LIMITED = 'NOT_PROPOSING_LIMITED',
  NOT_PROPOSING_LAGGING_BEHIND = 'NOT_PROPOSING_LAGGING_BEHIND',
}

export class ProposerStatus {
  incoming_connections: number;
  outgoing_connections: number;
  time: string;
  sync_status: SyncStatus;
  wallets: {
    wallet: string;
    balance: Amount;
    stakeable_balance: Amount;
    status: ProposerState;
    searches: number;
    searches_attempted: number;
  }[]
}

export class UnspentOutput {
  txid: string;
  vout: number;
  address: string;
  account?: string;
  scriptPubKey: string;
  amount: Amount;
  confirmations: number;
  redeemScript: number;
  spendable: boolean;
  solvable: boolean;
  safe: boolean;
  date?: string;
}

export enum EncryptionState {
  UNENCRYPTED = 'UNENCRYPTED',
  LOCKED = 'LOCKED',
  UNLOCKED = 'UNLOCKED',
  UNLOCKED_FOR_STAKING_ONLY = 'UNLOCKED_FOR_STAKING_ONLY',
}

export class WalletInfo {
  walletname: string;
  walletversion: number;
  balance: Amount;
  unconfirmed_balance: Amount;
  immature_balance: Amount;
  remote_staking_balance: Amount;
  txcount: number;
  keypoololdest: number;
  keypoolsize: number;
  keypoolsize_hd_internal: number;
  unlocked_until?: number;
  encryption_state: EncryptionState;
  paytxfee: Amount;
  hdmasterkeyid?: string;
}

export class ValidateAddress {
  isvalid: boolean;
  address: string;
  scriptPubKey: string;
  ismine: boolean;
  iswatchonly: boolean;
  isscript: boolean;
  iswitness: boolean;
  witness_version?: number;
  witness_program?: string;
  script?: string;
  hex?: string;
  addresses?: string[];
  pubkeys?: string;
  sigsrequired?: number;
  pubkey?: string;
  embedded?: any;
  iscompressed?: boolean;
  account: string;
  timestamp?: number;
  hdkeypath?: string;
  hdmasterkeyid?: string;
}

export class TransactionOutput {
  address: string;
  vout: number;
  amount: Amount;
  label?: string;
}

// Transaction information, as returned by `filtertransactions`
export class TransactionInfo {
  confirmations: number;
  generated?: boolean;
  blockhash: string;
  blockindex: number;
  blocktime: number;
  txid: string;
  walletconflicts: any[];
  time: number;
  timereceived: number;
  'bip125-replaceable': string;
  category: string;
  outputs: TransactionOutput[];
}

export enum AddressPurpose {
  ANY = 0,
  RECEIVE = 1,
  SEND = 2,
}

// Address, as returned by `filteraddresses`
export class Address {
  address: string;
  label: string;
  owned: boolean;
  timestamp: number;
}
