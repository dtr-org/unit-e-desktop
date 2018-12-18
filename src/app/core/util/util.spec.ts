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

import { TestBed, inject } from '@angular/core/testing';

import { AddressHelper, Duration, DateFormatter } from './utils';
import { Amount } from './amount';


describe('AddressHelper', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AddressHelper]
    });
  });

  it('should be created', inject([AddressHelper], (address: AddressHelper) => {
    expect(address).toBeTruthy();
  }));

  it('should test testnet address', inject([AddressHelper], (addressHelper: AddressHelper) => {
    const testAddress = 'pXvYNzP4UoW5UD2C27PzbFQ4ztG2W4Xakx';
    expect(addressHelper.testAddress(testAddress, 'public')).toBe(true);
    expect(addressHelper.getAddress(testAddress)).toEqual(testAddress);
  }));

  it('should test mainnet address', inject([AddressHelper], (addressHelper: AddressHelper) => {
    const mainAddress = 'PtF9rU2qR9JYBPvE3irVmeZn1YTsi3A9w9';
    expect(addressHelper.testAddress(mainAddress, 'public')).toBe(true);
    expect(addressHelper.getAddress(mainAddress)).toEqual(mainAddress);
  }));

});

describe('Amount', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Amount]
    });
  });
  const mockAmount = '5.6';
  const amount = new Amount(mockAmount);

  const mockAmountTwo = '0.006';
  const amountTwo = new Amount(mockAmountTwo);

  it('should be created', () => {
    expect(amount).toBeTruthy();
  });

  it('should validate fractional amounts', () => {
    expect(amount.toString()).toEqual(mockAmount);
    expect(amount.getIntegerPart()).toEqual('5');
    expect(amount.getFractionalPart()).toEqual('6');
    expect(amount.dot()).toBe('.');

    expect(amountTwo.toString()).toEqual(mockAmountTwo);
    expect(amountTwo.getIntegerPart()).toEqual('0');
    expect(amountTwo.getFractionalPart()).toEqual('006');
    expect(amountTwo.dot()).toBe('.');
  });

  it('should allow representing maximum amount of UTE', () => {
    const a = new Amount('2718281828');
    expect(a.getIntegerPart()).toEqual('2718281828');
    expect(a.getFractionalPart()).toEqual('');

    for (let i = 1; i < 10; i++) {
      const b = new Amount(`2718281827.9999999${i}`);
      expect(b.getIntegerPart()).toEqual('2718281827');
      expect(b.getFractionalPart()).toEqual(`9999999${i}`);
    }
  });

  it('should detect if number contain a dot', () => {
    expect(new Amount('27').dot()).toEqual('');
    expect(new Amount('27.5').dot()).toEqual('.');
    expect(new Amount('-27').dot()).toEqual('');
    expect(new Amount('-27.5').dot()).toEqual('.');
  });

  it('should allow adding two amounts', () => {
    const sum = new Amount('33.2').add(new Amount('0.90000001'));
    expect(sum.getIntegerPart()).toEqual('34');
    expect(sum.getFractionalPart()).toEqual('10000001');
  });

  it('should allow negating amounts', () => {
    const negative = new Amount('33.2').negate();
    expect(negative.toString()).toEqual('-33.2');
    expect(negative.getIntegerPart()).toEqual('-33');
  });

  it('should allow adding negative amounts', () => {
    const sum = new Amount('33.2').add(new Amount('-0.90000001'));
    expect(sum.getIntegerPart()).toEqual('32');
    expect(sum.getFractionalPart()).toEqual('29999999');
  });
});

describe('Duration', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Duration]
    });
  });
  const mockRemainingTime = 2852457;
  const duration = new Duration(mockRemainingTime);
  it('should be created', () => {
    expect(duration).toBeTruthy();
  });

  it('should return duration', () => {
    expect(duration.getShortReadableDuration()).toEqual('1 months');
  });

});

describe('DateFormatter', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DateFormatter]
    });
  });
  const mockDate = new Date();
  const dateFormat = new DateFormatter(mockDate);
  it('should be created', () => {
    expect(dateFormat).toBeTruthy();
  });

});

