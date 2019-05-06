/*
 * Copyright (C) 2017-2018 The Particl developers
 * Copyright (C) 2018-2019 The Unit-e developers
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

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { Log } from 'ng2-logger';

import { ReleaseNotification } from '../../core-ui/main/release-notification/release-notification.model';
import { environment } from '../../../environments/environment.prod';

@Injectable()
export class ClientVersionService {

  private log: any = Log.create('ClientVersionService');

  public releasesUrl: string = environment.releasesUrl;

  constructor(private http: HttpClient) { }

  getCurrentVersion(): Observable<ReleaseNotification> {
    return this.http.get(this.releasesUrl).pipe(
      map(response => response as ReleaseNotification),
      catchError(this.handleError<ReleaseNotification>('error while update'))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation: string = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.log.error(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
