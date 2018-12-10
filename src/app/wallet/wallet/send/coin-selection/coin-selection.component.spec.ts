import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { CoreUiModule } from 'app/core-ui/core-ui.module';
import { CoinSelectionComponent } from './coin-selection.component';

import { RpcService } from 'app/core/rpc/rpc.service';
import { RpcMockService } from 'app/_test/core-test/rpc-test/rpc-mock.service';


describe('CoinSelectionComponent', () => {
  let component: CoinSelectionComponent;
  let fixture: ComponentFixture<CoinSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoinSelectionComponent ],
      imports: [
        CoreUiModule.forRoot(),
      ],
      providers: [
        { provide: RpcService, useClass: RpcMockService },
        { provide: Router, useValue: { } },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoinSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
