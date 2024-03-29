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

import { Injectable, OnDestroy } from '@angular/core';
import { Log } from 'ng2-logger'
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash'
import { Transaction } from './transaction.model';
import { map, flatMap } from 'rxjs/operators';

import { RpcService, RpcStateService, Commands, IpcService } from '../../../core/core.module';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable()
export class TransactionService implements OnDestroy {

  log: any = Log.create('transaction.service id:' + Math.floor((Math.random() * 1000) + 1));
  private destroyed: boolean = false;
  private listeningForUpdates: boolean = false;

  /* Stores transactions objects. */
  txs: Transaction[] = [];

  /* Pagination stuff */
  txCount: number = 0;
  currentPage: number = 0;
  totalPageCount: number = 0;

  filters: any = {
    include_watchonly: undefined,
    category: undefined,
    search: undefined,
    sort: undefined
  };

  /* states */
  loading: boolean = true;
  testnet: boolean = false;
  alreadyRetryingLoadTx: boolean = false;

  /* How many transactions do we display per page and keep in memory at all times.
     When loading more transactions they are fetched JIT and added to txs. */
  MAX_TXS_PER_PAGE: number = 10;
  PAGE_SIZE_OPTIONS: Array<number> = [10, 25, 50, 100, 250];

  constructor(
    private rpc: RpcService,
    private rpcState: RpcStateService,
    private ipc: IpcService,
  ) {
  }

  ngOnDestroy() {
    this.destroyed = true;
  }

  postConstructor(MAX_TXS_PER_PAGE: number): void {
    this.MAX_TXS_PER_PAGE = MAX_TXS_PER_PAGE;
    this.log.d(`postconstructor max tx per page changed to: ${MAX_TXS_PER_PAGE}`);
    this.log.d(`postconstructor called txs array: ${this.txs.length}`);

    // load the first transactions
    this.loadTransactions();

    // register the updates, every block / tx!
    this.registerUpdates();
    this.listeningForUpdates = true;
  }

  registerUpdates(): void {

    // prevent multiple listeners
    if (this.listeningForUpdates) {
      this.log.er(`Already listeniing for updates, postConstructor called twice?`);
      return;
    }

    // It doesn't get called sometimes ?
    // this.rpc.state.observe('blocks').throttle(val => Observable.interval(30000/*ms*/)).subscribe(block =>  {
    this.rpcState.observe('getblockchaininfo', 'blocks')
      .takeWhile(() => !this.destroyed)
      .distinctUntilChanged() // only update when blocks changes
      .skip(1) // skip the first one (shareReplay)
      .debounceTime(30 * 1000/*ms*/)
      .subscribe(block => {
        this.log.d(`--- update by blockcount: ${block} ---`);
        this.loadTransactions();
      });

    this.rpcState.observe('getwalletinfo', 'txcount')
      .takeWhile(() => !this.destroyed)
      .distinctUntilChanged() // only update when txcount changes
      .skip(1) // skip the first one (shareReplay)
      .subscribe(txcount => {
        this.log.d(`--- update by txcount${txcount} ---`);
        this.loadTransactions();
      });


    /* check if testnet -> block explorer url */
    this.rpcState.observe('getblockchaininfo', 'chain').take(1)
      .subscribe(chain => this.testnet = chain === 'test');
  }

  filter(filters: any): void {
    this.loading = true;
    this.filters = filters;
    this.log.d('--- update by filter ---');
    this.loadTransactions();
  }

  changePage(page: number): void {
    if (page < 0) {
      return;
    }
    this.loading = true;
    this.currentPage = page;
    this.loadTransactions();
  }

  /** Load transactions over RPC, then parse JSON and call addTransaction to add them to txs array. */
  loadTransactions(): Subject<any> {
    this.log.d('loadTransactions() start');

    this.countTransactions();

    const options = {
      'count': +this.MAX_TXS_PER_PAGE,
      'skip': +this.MAX_TXS_PER_PAGE * this.currentPage,
    };
    Object.keys(this.filters).map(filter => options[filter] = this.filters[filter]);

    // For testing purposes, to signal async call completion
    const result: Subject<any> = new Subject();

    this.log.d(`loadTransactions, call filtertransactions: ${JSON.stringify(options)}`);
    this.rpc.call(Commands.FILTERTRANSACTIONS, [options])
      .subscribe(
      (txResponse: Array<Object>) => {

        // The callback will send over an array of JSON transaction objects.
        this.log.d(`loadTransactions, supposedly tx per page: ${this.MAX_TXS_PER_PAGE}`);
        this.log.d(`loadTransactions, real tx per page: ${txResponse.length}`);

        if (txResponse.length !== this.MAX_TXS_PER_PAGE) {
          this.log.er(`loadTransactions, TRANSACTION COUNTS DO NOT MATCH (maybe last page?)`);
        }

        const newTxs: Array<any> = txResponse.map(tx => {
          if (tx !== undefined) {
            return new Transaction(tx);
          }
        });

        this.txs = newTxs;

        this.loading = false;
        this.alreadyRetryingLoadTx = false;
        this.log.d(`loadTransactions, txs array: ${this.txs.length}`);

        result.next(newTxs);
        result.complete();
      },
      (error) => {
        result.error(error);

        this.log.d(`loadTransactions, failed with error `, error);
        this.log.d(`... retrying every second ... `);
        this.retryLoadTransaction();
      }
    );

    return result;
  }

  /** Count the transactions (for a specific filter) */
  countTransactions(): void {
    const options = {
      'count': 999999,
    };
    Object.keys(this.filters).map(filter => options[filter] = this.filters[filter]);

    this.rpc.call(Commands.FILTERTRANSACTIONS, [options])
      .subscribe((txResponse: Array<Object>) => {
        this.log.d(`countTransactions, number of transactions after filter: ${txResponse.length}`);
        this.txCount = txResponse.length;
        return;
      });
  }

  // TODO: remove shitty hack
  // When the transaction
  retryLoadTransaction() {
    if (this.alreadyRetryingLoadTx || this.destroyed) {
      return; // abort
    }

    setTimeout(this.loadTransactions.bind(this), 1000);
  }

  /**
   * Return a transaction's URL in Block Explorer
   */
  getTransactionUrl(tx: Transaction): string {
    return `https://blockbook.thirdhash.com/tx/${tx.txid}`;
  }

  getExportBaseName(): string {
    const now = new Date();
    const dateString = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;

    return `unit-e-transactions-${dateString}.csv`;
  }

  /**
   * Prompt the user to export the transaction history
   */
  export(filters: any): Observable<any> {
    return Observable.create((observer) => {
      window['remote'].dialog.showSaveDialog({
          title: 'Export transactions',
          defaultPath: this.getExportBaseName(),
        },
        (path) => {
          if (!path) {
            observer.complete();
            return;
          }

          this.ipc.runCommand('hl-rpc-channel', null, {
            command: 'export-transactions',
            params: [filters, path],
          }).subscribe(observer);
        }
      );
    });
  }
}
