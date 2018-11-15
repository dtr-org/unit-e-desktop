import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';

import { SharedModule } from '../../../shared/shared.module';
import { WalletModule } from '../../../wallet/wallet.module';
import { CoreModule, RpcService, Commands } from '../../../../core/core.module';

import { StakingInfoComponent } from './stakinginfo.component';

import { RpcMockService } from '../../../../_test/core-test/rpc-test/rpc-mock.service';
import { CoreUiModule } from '../../../../core-ui/core-ui.module';


describe('StakingInfoComponent', () => {
  let component: StakingInfoComponent;
  let fixture: ComponentFixture<StakingInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        WalletModule.forRoot(),
        CoreModule.forRoot(),
        CoreUiModule.forRoot(),
      ],
      declarations: [ StakingInfoComponent ],
      providers: [
        { provide: RpcService, useClass: RpcMockService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StakingInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the initial proposer status', () => {
    expect(component.severity).toBe('success');
  })

  it('should display the correct proposer status after an RPC call', () => {
    inject([RpcService], (rpc: RpcMockService) => {
      rpc.proposerStatus()
        .subscribe((x) => {
          expect(component.severity).toBe('alert');
        });
    })
  });
});
