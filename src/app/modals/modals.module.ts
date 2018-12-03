/*
 * Copyright (C) 2017-2018 The Particl developers
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

import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClipboardModule } from 'ngx-clipboard';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MaterialModule } from '../core-ui/material/material.module';
import { DirectiveModule } from '../core-ui/directive/directive.module';

import { ModalsHelperService } from 'app/modals/modals-helper.service';

/* modals */
import { CreateWalletComponent } from './createwallet/createwallet.component';
import { SyncingComponent } from './syncing/syncing.component';
import { UnlockwalletComponent } from './unlockwallet/unlockwallet.component';
import { EncryptwalletComponent } from './encryptwallet/encryptwallet.component';
import { AlertComponent } from './shared/alert/alert.component';

/* shared in modals */
import { PassphraseComponent } from './createwallet/passphrase/passphrase.component';
import { PassphraseService } from './createwallet/passphrase/passphrase.service';
import { PasswordComponent } from './shared/password/password.component';

import { SnackbarService } from '../core/snackbar/snackbar.service';
import { ManageWidgetsComponent } from './manage-widgets/manage-widgets.component';
import { SendConfirmationModalComponent } from 'app/modals/send-confirmation-modal/send-confirmation-modal.component';
import { FeeOptionsComponent } from './send-confirmation-modal/fee-options/fee-options.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BrowserAnimationsModule,
    ClipboardModule,
    /* own */
    MaterialModule,
    DirectiveModule
  ],
  declarations: [
    PassphraseComponent,
    PasswordComponent,
    CreateWalletComponent,
    SyncingComponent,
    UnlockwalletComponent,
    EncryptwalletComponent,
    AlertComponent,
    ManageWidgetsComponent,
    SendConfirmationModalComponent,
    FeeOptionsComponent,
  ],
  exports: [
    ClipboardModule
  ],
  providers: [
    // @TODO rename ModalsHelperService and replace with the modalsService once modals service refactored.
    ModalsHelperService,
    PassphraseService,
    SnackbarService
  ],
  entryComponents: [
    SyncingComponent,
    UnlockwalletComponent,
    EncryptwalletComponent,
    AlertComponent,
    ManageWidgetsComponent,
    CreateWalletComponent,
    SendConfirmationModalComponent
  ],
})
export class ModalsModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ModalsModule,
      providers: [
        ModalsHelperService
      ]
    };
  }
}

export { ModalsHelperService } from './modals-helper.service';
export { PassphraseService } from './createwallet/passphrase/passphrase.service';
