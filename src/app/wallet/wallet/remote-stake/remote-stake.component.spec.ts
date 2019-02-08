import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ModalsModule } from 'app/modals/modals.module';
import { CoreUiModule } from 'app/core-ui/core-ui.module';
import { CoreModule, RpcStateService, Commands } from 'app/core/core.module';
import { SharedModule } from 'app/wallet/shared/shared.module';

import { RemoteStakeComponent } from './remote-stake.component';
import { CoinSelectionComponent } from '../send/coin-selection/coin-selection.component';
import { SendOutputComponent } from '../send/send-output/send-output.component';
import { RemoteStakeService } from './remote-stake.service';
import mockgetwalletinfo from 'app/_test/core-test/rpc-test/mock-data/getwalletinfo.mock';

describe('RemoteStakeComponent', () => {
  let component: RemoteStakeComponent;
  let fixture: ComponentFixture<RemoteStakeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        RemoteStakeComponent,
        CoinSelectionComponent,
        SendOutputComponent,
      ],
      imports: [
        SharedModule,
        CoreModule.forRoot(),
        CoreUiModule.forRoot(),
        ModalsModule.forRoot(),
        NoopAnimationsModule
      ],
      providers: [
        RemoteStakeService,
        { provide: MatDialogRef },
      ]
    })
    .compileComponents();
  }));

  beforeEach(inject([RpcStateService], (svc: RpcStateService) => {
    svc.set(Commands.GETWALLETINFO, mockgetwalletinfo);

    fixture = TestBed.createComponent(RemoteStakeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the amount that can be staked remotely', () => {
    const nav = fixture.nativeElement;
    const amountHtml = nav.querySelectorAll('.amount')[0].innerHTML;
    expect(amountHtml).toBe('249.5795902');
  });
});
