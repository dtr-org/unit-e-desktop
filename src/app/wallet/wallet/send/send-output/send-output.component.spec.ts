import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { MaterialModule } from 'app/core-ui/material/material.module';

import { SendOutputComponent } from './send-output.component';
import { TransactionOutput } from '../transaction-builder.model';

describe('SendOutputComponent', () => {
  let component: SendOutputComponent;
  let fixture: ComponentFixture<SendOutputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendOutputComponent ],
      imports: [
        MaterialModule,
        NoopAnimationsModule,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendOutputComponent);
    component = fixture.componentInstance;
    component.txo = new TransactionOutput();

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
