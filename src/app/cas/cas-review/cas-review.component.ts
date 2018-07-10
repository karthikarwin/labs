import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CasService } from '@app/core';
import { ToastrService } from 'ngx-toastr';

export interface Stheader {
  'name'?: '';
  'panNo'?: '';
  'mailId'?: '';
}
@Component({
  selector: 'app-cas-review',
  templateUrl: './cas-review.component.html',
  styleUrls: ['./cas-review.component.css']
})
export class CasReviewComponent implements OnInit {
  pdfRes: any;
  total: any;
  isAgreed: Boolean = false;
  statements: Array<any>;
  user: any;
  stheaders: Stheader;
  errorMessage: any;

  constructor(private router: Router,
  private casService: CasService, private toastr: ToastrService) {
    if (sessionStorage.getItem('currentUser')) {
      this.user = JSON.parse(sessionStorage.getItem('currentUser'));
    }

   }

  ngOnInit() {
    this.casService.getStatementHeaders().subscribe( (stheaders: Stheader) => {
      // console.log(stheaders);
      this.stheaders = stheaders;
    });
    this.casService.getStatements().subscribe( (stmnt: Array<any>) => {
      this.statements = stmnt;
      let sum = 0;
      for ( let i = 0; i < this.statements.length; i++) {
        sum += stmnt[i].marketValue;
      }
      this.total = sum;
      // console.log(this.statements);
      // console.log(this.total);
    });
  }

  onChecked(ev) {
    // console.log(ev);
    if (ev.target.checked) {
      this.isAgreed = true;
    } else {
      this.isAgreed = false;
    }
  }

  agreeCas(isAgreed) {
    /* this.router.navigateByUrl('/dashboard'); */
    this.casService.agreeCasApi(isAgreed).subscribe( (anyy) => {
      if (isAgreed) {
        this.router.navigateByUrl('/dashboard');
      } else {
        this.router.navigateByUrl('/cas/cas-upload');
      }
    }, err => {
      /* this.router.navigateByUrl('/dashboard'); */
        this.errorMessage = err.error.message;
        this.toastr.error(this.errorMessage);
    });
  }
  rejectCas() {
    console.log(false);
  }
}
