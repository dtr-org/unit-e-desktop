import { TestBed, inject } from '@angular/core/testing';
import { Observable } from 'rxjs';

import { IpcService } from 'app/core/ipc/ipc.service';
import { RpcService } from 'app/core/rpc/rpc.service';

import { SettingsService } from './settings.service';


const WALLET_PATH = '/tmp/wallet.bak';


describe('SettingsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SettingsService,
        { provide: IpcService, useValue: { runCommand: () => Observable.of(WALLET_PATH) } },
      ]
    });
  });

  it('should be created', inject([SettingsService], (service: SettingsService) => {
    expect(service).toBeTruthy();
  }));

  it('should back up the wallet', inject([SettingsService], async (service: SettingsService) => {
    const path = await service.backupWallet().toPromise();
    expect(path).toEqual(WALLET_PATH);
  }));
});
