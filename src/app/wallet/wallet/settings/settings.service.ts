import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { RpcService } from 'app/core/rpc/rpc.service';


@Injectable()
export class SettingsService {

  constructor(
    private _rpc: RpcService,
  ) {
  }

  getWalletBackupName(): string {
    const now = new Date();
    const dateString = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;

    return `unit-e-wallet-${dateString}.bak`;
  }

  /**
   * Prompt the user to back up the wallet; return the path on success.
   */
  backupWallet(): Observable<string> {
    return Observable.create((observer) => {
      window['remote'].dialog.showSaveDialog({
          title: 'Backup wallet',
          defaultPath: this.getWalletBackupName(),
        },
        (path) => {
          if (!path) {
            observer.complete();
            return;
          }

          this._rpc.backupWallet(path)
            .subscribe(() => {
              observer.next(path);
              observer.complete();
            });
        }
      );
    });
  }
}
