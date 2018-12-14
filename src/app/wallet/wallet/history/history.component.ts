/*
 * Copyright (C) 2017-2018 The Particl developers
 * Copyright (C) 2018 The Unit-e developers
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

import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Log } from 'ng2-logger';

import { Dates } from 'app/core/util/dates';


export enum DateRange {
  ALL = 'all',
  TODAY = 'today',
  THIS_WEEK = 'this_week',
  THIS_MONTH = 'this_month',
  LAST_MONTH = 'last_month',
  THIS_YEAR = 'this_year',
  CUSTOM = 'custom',
};

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  private log: any = Log.create('history.component');

  @ViewChild('transactions') transactions: any;

  categories: Array<any> = [
    { title: 'All transactions',   value: 'all',               icon: ''},
    { title: 'Sent',               value: 'send',              icon: 'send'},
    { title: 'Received',           value: 'receive',           icon: 'receive'},
    { title: 'Coinstake',          value: 'coinbase',          icon: 'currency-dollar'},
    // { title: 'Immature',         value: 'immature'          },
    // { title: 'Orphan',           value: 'orphan'            },
  ];

  sortings: Array<any> = [
    { title: 'By time',                  value: 'time'          },
    { title: 'By amount',                value: 'amount'        },
    { title: 'By address',               value: 'address'       },
    { title: 'By category',              value: 'category'      },
    { title: 'By confirmations',         value: 'confirmations' },
    { title: 'By transaction ID (txid)', value: 'txid'          }
  ];

  dateFilters: Array<any> = [
    { title: 'All',        value: DateRange.ALL,        },
    { title: 'Today',      value: DateRange.TODAY,      },
    { title: 'This week',  value: DateRange.THIS_WEEK,  },
    { title: 'This month', value: DateRange.THIS_MONTH, },
    { title: 'Last month', value: DateRange.LAST_MONTH, },
    { title: 'This year',  value: DateRange.THIS_YEAR,  },
    { title: 'Custom...',  value: DateRange.CUSTOM,     },
  ];

  types: Array<any> = [
    { title: 'All types', value: 'all'      },
    { title: 'Public',  value: 'standard'   },
  ];

  filters: any = {
    category: undefined,
    search:   undefined,
    sort:     undefined,
    type:     undefined
  };

  dateRange: DateRange = DateRange.ALL;
  fromDate: Date;
  toDate: Date;

  public selectedTab: number = 0;

  constructor(private route: ActivatedRoute) {
    this.default();
    this.filters.search = route.snapshot.paramMap.get('search') || '';
  }

  ngOnInit(): void {
    /* may be used if we concatenate some filters https://stackoverflow.com/a/47797083 */
    if (this.filters.search) {
      this.filter();
    }
  }

  default(): void {
    this.selectedTab = 0;
    this.filters = {
      category: 'all',
      sort:     'time',
      search:   ''
    };

    this.dateRange = DateRange.ALL;
    this.fromDate = Dates.today();
    this.toDate = new Date(this.fromDate.getFullYear(), this.fromDate.getMonth(), this.fromDate.getDate() + 1);
  }

  changeCategory(index: number): void {
    this.selectedTab = index;
    this.transactions.resetPagination();
    this.filters.category = this.categories[index].value;
    this.filter();
  }

  sortList(event: any): void {
    this.filters.sort = event.value;
    this.filter();
  }

  filter(): void {
    const dateFilters = this.getDateFilters();
    this.filters.from = dateFilters.from;
    this.filters.to = dateFilters.to;

    this.log.d(`displaying transactions from ${dateFilters.from} to ${dateFilters.to}`);

    this.transactions.filter(this.filters);
  }

  clear(): void {
    this.default();
    this.filter();
  }

  getDateFilters() {
    let from: Date = Dates.epoch(), to: Date = Dates.now();

    switch (this.dateRange) {
      case DateRange.TODAY:
        from = Dates.today();
        break;
      case DateRange.THIS_WEEK:
        from = Dates.startOfWeek();
        break;
      case DateRange.THIS_MONTH:
        from = Dates.startOfMonth()
        break;
      case DateRange.LAST_MONTH:
        [from, to] = [Dates.startOfLastMonth(), Dates.startOfMonth()];
        break;
      case DateRange.THIS_YEAR:
        from = Dates.startOfYear();
        break;
      case DateRange.CUSTOM:
        [from, to] = [this.fromDate, this.toDate];
        break;
    }

    return { from: Math.floor(from.getTime() / 1000), to: Math.floor(to.getTime() / 1000) };
  }
}
