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

import { NgModule, ModuleWithProviders, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QRCodeModule } from 'angularx-qrcode';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { CoreUiModule } from '../../core-ui/core-ui.module';

import { TransactionService } from './shared/transaction.service';
import { AddressService } from './shared/address.service';
import { SendService } from './send/send.service';
import { SettingsService } from './settings/settings.service';

import { TransactionsTableComponent } from './shared/transaction-table/transaction-table.component';
import { AddressTableComponent } from './shared/address-table/address-table.component';

import { AddressBookComponent } from './address-book/address-book.component';
import { ReceiveComponent } from './receive/receive.component';
import { SendComponent } from './send/send.component';
import { BalanceComponent } from './balances/balance.component';
import { HistoryComponent } from './history/history.component';

import { AddressLookupComponent } from './addresslookup/addresslookup.component';

import { AddAddressLabelComponent } from './receive/modals/add-address-label/add-address-label.component';
import { NewAddressModalComponent } from './address-book/modal/new-address-modal/new-address-modal.component';
import { QrCodeModalComponent } from './shared/qr-code-modal/qr-code-modal.component';
import { SignatureAddressModalComponent } from './shared/signature-address-modal/signature-address-modal.component';
import { FixWalletModalComponent } from './send/fix-wallet-modal/fix-wallet-modal.component';
import { WalletFixedConfirmationComponent } from './send/fix-wallet-modal/wallet-fixed-confirmation/wallet-fixed-confirmation.component';
import { BumpFeeModalComponent } from './shared/transaction-table/bump-fee-modal/bump-fee-modal.component';
import { CoinSelectionComponent } from './send/coin-selection/coin-selection.component';
import { SendOutputComponent } from './send/send-output/send-output.component';
import { SettingsComponent } from './settings/settings.component';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    CoreUiModule.forRoot(),
    QRCodeModule
  ],
  declarations: [
    TransactionsTableComponent,
    AddressTableComponent,
    ReceiveComponent,
    SendComponent,
    HistoryComponent,
    AddressBookComponent,
    BalanceComponent,
    AddressLookupComponent,
    AddAddressLabelComponent,
    NewAddressModalComponent,
    QrCodeModalComponent,
    SignatureAddressModalComponent,
    FixWalletModalComponent,
    WalletFixedConfirmationComponent,
    BumpFeeModalComponent,
    CoinSelectionComponent,
    SendOutputComponent,
    SettingsComponent,
  ],
  exports: [
    TransactionsTableComponent,
    AddressTableComponent,
    BalanceComponent,
    /* sidebar lazy load*/
    ReceiveComponent,
    SendComponent,
    HistoryComponent,
    AddressBookComponent,
    SettingsComponent,
  ],
  entryComponents: [
    AddAddressLabelComponent,
    NewAddressModalComponent,
    QrCodeModalComponent,
    AddressLookupComponent,
    SignatureAddressModalComponent,
    /* modals for wallet fix */
    FixWalletModalComponent,
    WalletFixedConfirmationComponent,
    BumpFeeModalComponent,
  ],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WalletModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: WalletModule,
      providers: [
        AddressService,
        SendService,
        SettingsService,
      ]
    };
  }
}


export { AddressBookComponent } from './address-book/address-book.component';
export { ReceiveComponent } from './receive/receive.component';
export { SendComponent } from './send/send.component';
export { BalanceComponent } from './balances/balance.component';
export { HistoryComponent } from './history/history.component';
export { SettingsComponent } from './settings/settings.component';
