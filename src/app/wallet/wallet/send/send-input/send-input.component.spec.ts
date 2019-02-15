import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';

import { SendInputComponent } from './send-input.component';
import { CoinSelectionComponent } from '../coin-selection/coin-selection.component';
import { SharedModule } from 'app/wallet/shared/shared.module';
import { CoreUiModule } from 'app/core-ui/core-ui.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RpcService, RpcStateService, IpcService, Commands } from 'app/core/core.module';
import { RpcMockService } from 'app/_test/core-test/rpc-test/rpc-mock.service';

describe('SendInputComponent', () => {
  let component: SendInputComponent;
  let fixture: ComponentFixture<SendInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CoinSelectionComponent,
        SendInputComponent,
      ],
      imports: [
        SharedModule,
        CoreUiModule.forRoot(),
        NoopAnimationsModule
      ],
      providers: [
        IpcService,
        { provide: RpcService, useClass: RpcMockService },
        RpcStateService,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct initial balance', inject([RpcService], (rpc: RpcMockService) => {
    return new Promise((resolve) => {
      rpc.call(Commands.GETWALLETINFO).subscribe(() => {
        fixture.detectChanges();
        const balanceElt = fixture.nativeElement.querySelector('.amount');
        expect(balanceElt.innerText).toBe('249.5795902');
        resolve();
      });
    });
  }));
});
