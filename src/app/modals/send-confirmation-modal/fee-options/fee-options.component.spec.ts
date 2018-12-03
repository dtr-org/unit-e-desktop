import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'app/core-ui/material/material.module';

import { CoreModule } from 'app/core/core.module';
import { FeeOptionsComponent } from './fee-options.component';
import { SendService } from 'app/wallet/wallet/send/send.service';
import { SendMockService } from 'app/_test/wallet-test/send-test/send-mock.service';

describe('FeeOptionsComponent', () => {
  let component: FeeOptionsComponent;
  let fixture: ComponentFixture<FeeOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CoreModule.forRoot(),
        BrowserAnimationsModule,
        MaterialModule,
      ],
      declarations: [ FeeOptionsComponent ],
      providers: [
        { provide: SendService, useClass: SendMockService },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeeOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
