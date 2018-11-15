import { ProposerStatus, SyncStatus, ProposerState } from 'app/core/rpc/rpc-types';

const mockproposerstatus: ProposerStatus = {
  'wallets': [
    {
      'wallet': 'wallet.dat',
      'balance': 12.50000000,
      'stakeable_balance': 12.50000000,
      'status': ProposerState.NOT_PROPOSING_NO_PEERS,
      'searches': 0,
      'searches_attempted': 239
    }
  ],
  'sync_status': SyncStatus.SYNCED,
  'time': '2018-11-08 16:16:02',
  'incoming_connections': 0,
  'outgoing_connections': 0
};

export default mockproposerstatus;
