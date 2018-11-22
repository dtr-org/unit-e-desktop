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

import { TestBed, async } from '@angular/core/testing';
import { APP_BASE_HREF } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';

import { AppModule } from './app.module';

// import { RpcService } from './core/core.module';

import { AppComponent } from './app.component';

describe('AppComponent', () => {

  let component: AppComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        AppModule
      ],
      providers: [
        {provide: APP_BASE_HREF, useValue: '/'}
      ]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
    component = app;
  });
  /*
   it('should test firstTime running', () => {
   component.firsttime();
   expect(component.firsttime).toBe();
   });

   it('should sync', () => {
   component.sync();
   expect(component.syncing).toBeTruthy();
   });

   it('should unlock', () => {
   component.unlock();
   expect(component.unlock).toBeTruthy();
   });
   */
  /*
   it('should render title in a h1 tag', async(() => {
   const fixture = TestBed.createComponent(AppComponent);
   fixture.detectChanges();
   const compiled = fixture.debugElement.nativeElement;
   expect(compiled.querySelector('h1').textContent).toContain('app works!');
   }));
   */
/*it('should get isCollapsed', () => {
    expect(component.isCollapsed).toBeTruthy()
  });

  it('should get isFixed', () => {
    expect(component.isFixed).toBeFalsy();
  });

  it('should get log', () => {
    expect(component.log).toBeDefined();
  });

  it('should get title', () => {
    expect(component.title).toBe('');
  });
 */
});
