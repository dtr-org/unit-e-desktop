export enum TxType {
  PUBLIC = 'unt',
}

export class TransactionBuilder {
  input: TxType = TxType.PUBLIC;
  output: TxType = TxType.PUBLIC;
  toAddress: string;
  toLabel: string;
  address: string;
  amount: number;
  comment: string;
  commentTo: string;
  numsignatures: number = 1;
  validAddress: boolean;
  validAmount: boolean;
  isMine: boolean;
  currency: string = 'unt';
  ringsize: number = 8;
  subtractFeeFromAmount: boolean = false;
  estimateFeeOnly: boolean = true;

  constructor() {

  }
}
