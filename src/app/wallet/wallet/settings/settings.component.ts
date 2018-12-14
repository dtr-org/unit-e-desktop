import { Component, OnInit } from '@angular/core';

import { SnackbarService } from 'app/core/core.module';
import { SettingsService } from './settings.service';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {

  constructor(
    private _settings: SettingsService,
    private snackbar: SnackbarService,
  ) { }

  backupWallet(): void {
    this._settings.backupWallet()
      .subscribe(
        (path) => this.snackbar.open(`Wallet backed up to ${path}`),
        (err) => this.snackbar.open(err.message),
      );
  }
}
