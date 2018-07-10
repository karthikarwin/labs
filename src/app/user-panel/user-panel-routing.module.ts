import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { UserPanelComponent } from './user-panel.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { RedemptionComponent } from './redemption/redemption.component';
import { SwitchComponent } from './switch/switch.component';
import { TransferComponent } from './transfer/transfer.component';
import { SipRegistrationComponent } from './sip-registration/sip-registration.component';
import { SettingsComponent } from './settings/settings.component';
import { ProfileComponent } from './profile/profile.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { SysPlansComponent } from './sys-plans/sys-plans.component';
import { WithdrawalComponent } from './withdrawal/withdrawal.component';
import { AuthGuard } from '../core/_guards/auth.guard';

const routes: Routes = [
  {
    path: 'user',
    component: UserPanelComponent,
    children: [
      {
        path: 'home',
        component: HomeComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'portfolio',
        component: PortfolioComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'redemption',
        component: RedemptionComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'switch',
        component: SwitchComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'transfer',
        component: TransferComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'sip-register',
        component: SipRegistrationComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'sip-register/:id',
        component: SipRegistrationComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'settings',
        component: SettingsComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'transactions',
        component: TransactionsComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'sys-plans',
        component: SysPlansComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'withdrawal',
        component: WithdrawalComponent,
        canActivate: [AuthGuard]
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'user',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserPanelRoutingModule { }
