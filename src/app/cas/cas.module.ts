import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CasRoutingModule } from './cas-routing.module';
import { CasInfoComponent } from './cas-info/cas-info.component';
import { CasUploadComponent } from './cas-upload/cas-upload.component';
import { CasReviewComponent } from './cas-review/cas-review.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    CasRoutingModule,
    SharedModule
  ],
  declarations: [CasInfoComponent, CasUploadComponent, CasReviewComponent]
})
export class CasModule { }
