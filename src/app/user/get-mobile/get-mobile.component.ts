import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@app/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-get-mobile',
  templateUrl: './get-mobile.component.html',
  styleUrls: ['./get-mobile.component.css']
})
export class GetMobileComponent implements OnInit {

  user: any;
  enblBtn: Boolean = false;
  constructor(private auth: AuthService, private route: Router, private toastr: ToastrService) {
    if (this.auth.getAuthState()) {
      this.user = this.auth.getUserFromSession();
      if ( this.user.mobile !== null) {
        this.route.navigateByUrl('/welcome');
      }
    } else {
      this.route.navigateByUrl('/user/login');
    }
  }

  ngOnInit() {
  }

  onlyNumber(e) {
    // console.log(e.charCode);
    if ( e.charCode < 48 || e.charCode > 57 ) {
      return false;
    } else {
      return true;
    }
  }

  resolved(ev) {
    this.enblBtn = true;
  }

  getUserDetails(userform) {
    this.route.navigateByUrl('welcomuser');
  }

  saveMob(mobile) {
    console.log(mobile);
    const mobileObj = {
      custId: this.user.custId,
      mobileNumber: mobile
    };
    this.auth.saveMobileNo(mobileObj).subscribe((resp) => {
      console.log(resp);
      if (this.user.registrationCompleted) {
        this.toastr.success('Updated Successfully');
        this.route.navigateByUrl('/welcome');
      } else {
        this.route.navigateByUrl('/user/account-setup');
      }
    }, err => {
      this.toastr.error(err.error.message);
    });
  }

}
