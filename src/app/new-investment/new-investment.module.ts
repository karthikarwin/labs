import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewInvestmentRoutingModule } from './new-investment-routing.module';
import { NewInvFormComponent } from './new-inv-form/new-inv-form.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    NewInvestmentRoutingModule,
    SharedModule
  ],
  declarations: [NewInvFormComponent]
})
export class NewInvestmentModule { }
