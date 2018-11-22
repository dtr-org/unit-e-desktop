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

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Log, Level } from 'ng2-logger';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  Log.setProductionMode();  // disables logging
  enableProdMode();
}

if (environment.envName === 'dev') {
  // TODO: dev env logging config, see https://github.com/darekf77/ng2-logger
  Log.onlyModules('(.*?)');
  // Comment out to see debug messages
  // Log.onlyLevel(Level.ERROR, Level.INFO, Level.WARN);
}

const log: any = Log.create('main');

platformBrowserDynamic().bootstrapModule(AppModule)
  .then(success => log.d('Ready. (env: ' + environment.envName + ')'))
  .catch(err => console.error(err));
