import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewInvFormComponent } from './new-inv-form/new-inv-form.component';
import { AuthGuard } from '../core/_guards/auth.guard';

const routes: Routes = [
  {
    path: 'new-investment',
    component: NewInvFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: 'new-investment',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewInvestmentRoutingModule { }
