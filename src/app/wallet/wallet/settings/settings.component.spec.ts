import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoreUiModule } from 'app/core-ui/core-ui.module';

import { SnackbarService } from 'app/core/core.module';
import { IpcService } from 'app/core/ipc/ipc.service';
import { SettingsComponent } from './settings.component';
import { SettingsService } from './settings.service';


describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingsComponent ],
      imports: [
        CoreUiModule.forRoot(),
      ],
      providers: [
        SettingsService,
        SnackbarService,
        { provide: IpcService, useValue: {} },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
