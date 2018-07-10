import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { AuthGuard } from './_guards/auth.guard';
import { LoginComponent } from '../user/login/login.component';
import { RegisterComponent } from '../user/register/register.component';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [
  {
    path: 'welcome',
    component: WelcomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'user',
    loadChildren: '../user/user.module#UserModule'
  },
  {
    path: 'investment',
    loadChildren: '../new-investment/new-investment.module#NewInvestmentModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard',
    loadChildren: '../user-panel/user-panel.module#UserPanelModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'cas',
    loadChildren: '../cas/cas.module#CasModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    redirectTo: 'user/login',
    pathMatch: 'full'
  },
  {
    path: '',
    redirectTo: 'user',
    pathMatch: 'full'
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class CoreRoutingModule { }
