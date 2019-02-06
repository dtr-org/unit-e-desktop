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

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedModule } from '../../shared/shared.module';
import { WalletModule } from '../wallet.module';

import { BalanceComponent } from './balance.component';
import { CoreModule } from 'app/core/core.module';

describe('BalanceComponent', () => {
  let component: BalanceComponent;
  let fixture: ComponentFixture<BalanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        WalletModule.forRoot(),
        CoreModule.forRoot()
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return a balance equal to 0 (getIntegralPart)', () => {
    expect(component.balance.getIntegralPart()).toBe('0');
  });

  it('should return a balance equal to 0 (getFractionalPart)', () => {
    expect(component.balance.getFractionalPart()).toBe('');
  });

  it('should not return a dot because its just 0, not 0.0 ', () => {
    expect(component.balance.dot()).toBe('');
  });

/*
  it('should get balance point', () => {
    component.getBalancePoint();
    expect(component.getBalancePoint).toBeTruthy();
  });

  it('should get balance after point', () => {
    component.getBalanceAfterPoint(true)
    expect(component.getBalanceAfterPoint).toBeTruthy();
  });

  it('should get type of balance', () => {
    component.getTypeOfBalance();
    expect(component.getTypeOfBalance).toBeTruthy();
  });
*/
});
