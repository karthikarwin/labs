import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CasInfoComponent } from './cas-info/cas-info.component';
import { CasUploadComponent } from './cas-upload/cas-upload.component';
import { CasReviewComponent } from './cas-review/cas-review.component';


const routes: Routes = [
  {
    path: 'cas-info',
    component: CasInfoComponent
  },
  {
    path: 'cas-upload',
    component: CasUploadComponent
  },
  {
    path: 'cas-review',
    component: CasReviewComponent
  },
  {
    path: '',
    redirectTo: 'cas-info',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CasRoutingModule { }
