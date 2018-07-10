import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from './loading/loading.component';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { OtpComponent } from './otp/otp.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { RecaptchaModule } from 'ng-recaptcha';
import { RecaptchaFormsModule } from 'ng-recaptcha/forms';
import { LoadingModule } from 'ngx-loading';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { NgxSpinnerModule } from 'ngx-spinner';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';

import { OwlMomentDateTimeModule } from 'ng-pick-datetime-moment';
import { MonthPickerComponent } from './month-picker/month-picker.component';
import {DpDatePickerModule} from 'ng2-date-picker';



@NgModule({
  imports: [
    CommonModule,
    AngularFontAwesomeModule,
    BsDropdownModule.forRoot(),
    BsDatepickerModule.forRoot(),
    TypeaheadModule.forRoot(),
    ModalModule.forRoot(),
    ReactiveFormsModule,
    FormsModule,
    PdfViewerModule,
    RecaptchaModule.forRoot(),
    RecaptchaFormsModule,
    LoadingModule,
    NgxSpinnerModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    OwlMomentDateTimeModule,
    DpDatePickerModule
  ],
  declarations: [LoadingComponent, OtpComponent, MonthPickerComponent],
  exports: [
    AngularFontAwesomeModule,
    BsDropdownModule,
    ReactiveFormsModule,
    BsDatepickerModule,
    OtpComponent,
    MonthPickerComponent,
    PdfViewerModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    LoadingModule,
    FormsModule,
    TypeaheadModule,
    NgxSpinnerModule, 
    OwlDateTimeModule, 
    OwlNativeDateTimeModule,
    OwlMomentDateTimeModule,
    DpDatePickerModule
  ]
})
export class SharedModule { }
