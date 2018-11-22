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
import { MatDialogRef } from '@angular/material';

import { CoreModule } from '../../../../../core/core.module';
import { SharedModule } from '../../../../../wallet/shared/shared.module';
import { ModalsModule } from '../../../../../modals/modals.module';
import { CoreUiModule } from '../../../../core-ui.module';

import { ConsoleModalComponent } from './console-modal.component';

describe('ConsoleModalComponent', () => {
  let component: ConsoleModalComponent;
  let fixture: ComponentFixture<ConsoleModalComponent>;
  const cmds = [
    'help',
    'getaddressbalance rSoZtLcT1RySGgVKFchkwBXowFjJzufScc',
    'walletpassphrase "passphrase" 9999',
    'sendtypeto "ute" "ute" [{ address: "rSoZtLcT1RySGgVKFchkwBXowFjJzufScc" }]',
    'somecommand [ test1,  test2]',
    'somecommand { test1: "testests",  testes2 : "testest1232"}'
  ]
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        CoreModule.forRoot(),
        ModalsModule,
        CoreUiModule.forRoot()
      ],
      providers: [
        /* deps */
        { provide: MatDialogRef}
        ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsoleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should parse mutiple commands', () => {
    let mockParse = component.queryParser(cmds[0]);
    expect(mockParse.length).toEqual(1);
    mockParse = component.queryParser(cmds[1]);
    expect(mockParse[1]).toEqual('rSoZtLcT1RySGgVKFchkwBXowFjJzufScc');
    mockParse = component.queryParser(cmds[2]);
    expect(mockParse[2]).toEqual('9999');
    mockParse = component.queryParser(cmds[3]);
    expect(mockParse[3]).toEqual('[{address:"rSoZtLcT1RySGgVKFchkwBXowFjJzufScc"}]');
    mockParse = component.queryParser(cmds[4]);
    expect(mockParse[1]).toEqual('[test1,test2]');
    mockParse = component.queryParser(cmds[5]);
    expect(mockParse[1]).toEqual('{test1:"testests",testes2:"testest1232"}');
  });

});
