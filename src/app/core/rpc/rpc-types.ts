export class Outputs {
  address: string;
  amount: number | string;
  subfee?: boolean;
  script?: string;
  narr?: string;
};

export class CoinControl {
  changeaddress?: string;
  inputs?: any;
  replaceable?: boolean;
  conf_target?: number;
  estimate_mode?: 'UNSET' | 'ECONOMICAL' | 'CONSERVATIVE';
  fee_rate?: number;
}

export class ProposerStatus {
  incoming_connections: number;
  outgoing_connections: number;
  time: string;
  sync_status: string;
  wallets: {
    wallet: string;
    balance: number;
    stakeable_balance: number;
    status: string;
    searches: number;
    searches_attempted: number;
  }[]
}
