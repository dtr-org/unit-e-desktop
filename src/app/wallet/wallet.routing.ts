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

import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OverviewComponent } from './overview/overview.component';
import {
  AddressBookComponent,
  HistoryComponent,
  ReceiveComponent,
  SendComponent,
  SettingsComponent,
} from './wallet/wallet.module';
import { RemoteStakeComponent } from './wallet/remote-stake/remote-stake.component';

//   { path: '', redirectTo: '/wallet/overview', pathMatch: 'full' },
const routes: Routes = [
  { path: '', redirectTo: 'overview', pathMatch: 'full' },
  { path: 'overview', component: OverviewComponent, data: { title: 'Overview' } },
  { path: 'receive', component: ReceiveComponent, data: { title: 'Receive' } },
  { path: 'send', component: SendComponent, data: { title: 'Send' } },
  { path: 'stake', component: RemoteStakeComponent, data: { title: 'Stake Remotely' } },
  { path: 'history/:search', component: HistoryComponent, data: { title: 'History' } },
  { path: 'history', component: HistoryComponent, data: { title: 'History' } },
  { path: 'address-book', component: AddressBookComponent, data: { title: 'Address Book' } },
  { path: 'settings', component: SettingsComponent, data: { title: 'Settings' } },
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
