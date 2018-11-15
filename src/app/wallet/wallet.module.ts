import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreUiModule } from '../core-ui/core-ui.module';
import { SharedModule } from './shared/shared.module';
import { WalletModule } from './wallet/wallet.module';

import { OverviewComponent } from './overview/overview.component';
import { StakingInfoComponent } from './overview/widgets/stakinginfo/stakinginfo.component';

import 'hammerjs';

import { routing } from './wallet.routing';


@NgModule({
  declarations: [
    OverviewComponent,
    StakingInfoComponent,
  ],
  imports: [
    CommonModule,
    routing,
    SharedModule,
    WalletModule.forRoot(),
    CoreUiModule
  ],
  entryComponents: [
  ],
  exports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class WalletViewsModule {
  constructor() {
  }
}
