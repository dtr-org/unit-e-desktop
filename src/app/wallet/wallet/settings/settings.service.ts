import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { IpcService } from 'app/core/ipc/ipc.service';
import { RpcService } from 'app/core/rpc/rpc.service';


@Injectable()
export class SettingsService {

  constructor(
    private _ipc: IpcService,
    private _rpc: RpcService,
  ) {
  }

  getWalletBackupName(): string {
    const unixTime = Math.floor(Date.now() / 1000);
    return `wallet.bak~${unixTime}`;
  }

  /**
   * Prompt the user to back up the wallet; return the path on success.
   */
  backupWallet(): Observable<string> {
    return this._ipc.runCommand('os-if', null, {
      command: 'file-picker',
      params: {
        title: 'Backup wallet',
        defaultPath: this.getWalletBackupName(),
      }
    }).flatMap((path) => {
      return this._rpc.backupWallet(path)
        .flatMap(() => Observable.of(path));
    });
  }
}
