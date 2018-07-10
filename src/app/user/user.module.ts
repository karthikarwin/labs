import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { AccountSetupComponent } from './account-setup/account-setup.component';
import { SharedModule } from '../shared/shared.module';
import { GetMobileComponent } from './get-mobile/get-mobile.component';

@NgModule({
  imports: [
    CommonModule,
    UserRoutingModule,
    SharedModule
  ],
  declarations: [LoginComponent, RegisterComponent, ForgotPasswordComponent, AccountSetupComponent, GetMobileComponent]
})
export class UserModule { }
