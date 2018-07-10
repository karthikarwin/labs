import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserPanelRoutingModule } from './user-panel-routing.module';
import { SideBarComponent } from './side-bar/side-bar.component';
import { UserPanelComponent } from './user-panel.component';
import { HomeComponent } from './home/home.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { SharedModule } from '../shared/shared.module';
import { RedemptionComponent } from './redemption/redemption.component';
import { SwitchComponent } from './switch/switch.component';
import { SipRegistrationComponent } from './sip-registration/sip-registration.component';
import { TransferComponent } from './transfer/transfer.component';
import { SettingsComponent } from './settings/settings.component';
import { ProfileComponent } from './profile/profile.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { SysPlansComponent } from './sys-plans/sys-plans.component';
import { WithdrawalComponent } from './withdrawal/withdrawal.component';
import { SidebarModule } from 'ng-sidebar';

@NgModule({
  imports: [
    CommonModule,
    UserPanelRoutingModule,
    SharedModule,
    SidebarModule.forRoot()
  ],
  declarations: [
    SideBarComponent,
    UserPanelComponent,
    HomeComponent,
    PortfolioComponent,
    RedemptionComponent,
    SwitchComponent,
    SipRegistrationComponent,
    TransferComponent,
    SettingsComponent,
    ProfileComponent,
    TransactionsComponent,
    SysPlansComponent,
    WithdrawalComponent
  ]
})
export class UserPanelModule { }
