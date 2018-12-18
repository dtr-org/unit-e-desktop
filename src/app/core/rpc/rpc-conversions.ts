import { Commands } from './rpc.service';
import { Amount } from '../util/amount';
import { TransactionInfo, UnspentOutput, ProposerStatus } from './rpc-types';


// Convert numeric values in Unit-e RPC results to Amount objects
export function amountConverter(command: Commands): (value: any) => any {
  switch (command) {
    case Commands.FILTERTRANSACTIONS:
      return convertFilterTransactions;
    case Commands.LISTUNSPENT:
      return convertListUnspent;
    case Commands.PROPOSERSTATUS:
      return convertProposerStatus;
    default:
      return (x) => x;
  }
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
