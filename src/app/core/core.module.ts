import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreRoutingModule } from './core-routing.module';
import { HeaderComponent } from './header/header.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { AuthGuard } from './_guards/auth.guard';
import { SharedModule } from '../shared/shared.module';
import { AuthService } from './_services/auth.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NotFoundComponent } from './not-found/not-found.component';
import { TokenInterceptor } from './token.interceptor';
import { AccountService } from './_services/account.service';
import { CasService } from './_services/cas.service';
import { CookieService } from 'ngx-cookie-service';
import { CookieModule } from 'ngx-cookie';
import { FundService } from './_services/fund.service';
import { UserIdleModule } from 'angular-user-idle';

import { ToastrModule } from 'ngx-toastr';
import { PaymentService } from './_services/payment.service';
import { ExampleComponent } from '../example/example.component';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';


@NgModule({
  imports: [
    CommonModule,
    CoreRoutingModule,
    SharedModule,
    HttpClientModule,
    UserIdleModule.forRoot({idle: 300, timeout: 30, ping: 0}),
    CookieModule.forRoot(),
    ToastrModule.forRoot({
      timeOut: 1000,
      preventDuplicates: true
    }),
    TypeaheadModule.forRoot()
  ],
  declarations: [HeaderComponent, WelcomeComponent, NotFoundComponent, ExampleComponent],
  exports: [HeaderComponent, ExampleComponent],
  providers: [
    AuthService,
    AuthGuard,
    AccountService,
    CasService,
    FundService,
    PaymentService,
    CookieService,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
  ]
})
export class CoreModule { }
