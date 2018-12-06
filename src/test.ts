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

// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/dist/long-stack-trace-zone';
import 'zone.js/dist/proxy.js';
import 'zone.js/dist/sync-test';
import 'zone.js/dist/jasmine-patch';
import 'zone.js/dist/async-test';
import 'zone.js/dist/fake-async-test';
import { TestBed, getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

import { RpcService } from 'app/core/core.module';
import { RpcMockService } from 'app/_test/core-test/rpc-test/rpc-mock.service';

import { TransactionService } from 'app/wallet/wallet/shared/transaction.service';
import { MockTransactionService } from 'app/wallet/wallet/shared/transaction.mockservice';

import { Log } from 'ng2-logger';

// Unfortunately there's no typing for the `__karma__` variable. Just declare it as any.
declare var __karma__: any;
declare var require: any;

// Prevent Karma from running prematurely.
__karma__.loaded = function () {};

Log.setProductionMode();

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);

// We make sure our mock services are used in all unit tests
const oldConfigureTestingModule = TestBed.prototype.configureTestingModule;
getTestBed().configureTestingModule = function (moduleDef: any) {
  if (!('providers' in moduleDef)) {
    moduleDef.providers = [];
  }
  moduleDef.providers.push(
    { provide: RpcService, useClass: RpcMockService },
    { provide: TransactionService, useClass: MockTransactionService },
  );
  oldConfigureTestingModule.call(this, moduleDef);
}

// Then we find all the tests.
const context = require.context('./', true, /\.spec\.ts$/);
// And load the modules.
context.keys().map(context);
// Finally, start Karma to run the tests.
__karma__.start();
