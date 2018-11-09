import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import mockgetpeerinfo from './mock-data/getpeerinfo.mock';
import mockproposerstatus from './mock-data/proposerstatus.mock';
import { RpcService } from '../../../core/core.module';

// TODO: create & move into the testing module
// TODO: add more calls, currently only used in SendComponent

@Injectable()
export class RpcMockService extends RpcService {

  constructor() { super(null, null); }

  call(method: string, params?: Array<any> | null): Observable<any> {
    return Observable.create(observer => {

      if (method === 'getpeerinfo') {
        observer.next(mockgetpeerinfo);
      } else if (method === 'proposerstatus') {
        observer.next(mockproposerstatus);
      } else {
        observer.next(true)
      }

      observer.complete();
    });
  }

}
