import { Commands } from './commands';
import { Amount } from '../util/amount';
import { TransactionInfo, UnspentOutput, ProposerStatus, WalletInfo, BumpFeeResult } from './rpc-types';


// Convert numeric values in Unit-e RPC results to Amount objects
export function amountConverter(command: Commands): (value: any) => any {
  switch (command) {
    case Commands.BUMPFEE:
      return convertBumpFee;
    case Commands.FILTERTRANSACTIONS:
      return convertFilterTransactions;
    case Commands.GETWALLETINFO:
      return convertWalletInfo;
    case Commands.LISTUNSPENT:
      return convertListUnspent;
    case Commands.PROPOSERSTATUS:
      return convertProposerStatus;
    default:
      return (x) => x;
  }
}

function convertBumpFee(value: any): BumpFeeResult {
  value.origfee = Amount.fromNumber(value.origfee);
  value.fee = Amount.fromNumber(value.fee);
  return value as BumpFeeResult;
}

function convertFilterTransactions(value: any[]): TransactionInfo[] {
  return value.map((tx) => {
    tx.amount = Amount.fromNumber(tx.amount);
    for (const output of tx.outputs) {
      output.amount = Amount.fromNumber(output.amount);
    }
    return tx as TransactionInfo;
  });
}

function convertWalletInfo(value: any): WalletInfo {
  value.balance = Amount.fromNumber(value.balance);
  value.unconfirmed_balance = Amount.fromNumber(value.unconfirmed_balance);
  value.immature_balance = Amount.fromNumber(value.immature_balance);
  value.paytxfee = Amount.fromNumber(value.paytxfee);
  return value as WalletInfo;
}

function convertListUnspent(value: any[]): UnspentOutput[] {
  return value.map((out) => {
    out.amount = Amount.fromNumber(out.amount);
    return out as UnspentOutput;
  });
}

function convertProposerStatus(value: any): ProposerStatus {
  for (const wallet of value.wallets) {
    wallet.balance = Amount.fromNumber(wallet.balance);
    wallet.stakeable_balance = Amount.fromNumber(wallet.stakeable_balance);
  }

  return value as ProposerStatus;
}
