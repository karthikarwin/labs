import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '@app/core';
import { SendIpInfo, ReceiveIpInfo } from '../../core/_models/ipInfo';
import { HttpResponse } from '@angular/common/http';
import { User } from '../../core/_models/user';
import { ToastrService } from 'ngx-toastr';
import { UserIdleService } from 'angular-user-idle';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  tokenB: string;
  isError1: Boolean = false;
  isError: Boolean = false;
  resetPassForm: FormGroup;
  token: any;
  currentUser: any;
  errorOccured: Boolean = false;
  errorMessage: any;
  loggedIn: boolean;
  /* user: SocialUser; */
  user: any;
  btnEnable: Boolean = false;
  GuserDetails: any;
  showOtherMailFrm: Boolean = false;
  maildata: any;
  showPasswordAssistence: Boolean = false;
  custLocationObj: any;
  loadingBank: Boolean = false;
  loginForm: FormGroup;
  isGmailUser: Boolean;
  ipInfo: any = {};
  ripInfo: any = {};
  btnClicked: Boolean = false;



  constructor(
              private route: Router,
              private actRoute: ActivatedRoute,
              private fb: FormBuilder,
              private auth: AuthService,
              private toastr: ToastrService,
              private userIdle: UserIdleService,
              private spinner: NgxSpinnerService) {
  }
  ngOnInit() {
    if (this.actRoute.queryParams) {
      this.actRoute.queryParams.subscribe( params => {
        if (params['token'] !== undefined) {
          this.spinner.show();
          this.token = params['token'];
          this.isGmailUser = JSON.parse(params['isGmailUser']);
          console.log('gmail', this.isGmailUser);
          this.ipInfo.username = params['username'];
          if (this.isGmailUser) {
            console.log('Came inside gmail');
            if (this.token) {
              this.tokenB = 'Bearer ' + this.token;
              sessionStorage.setItem('Token', this.tokenB);
              this.ipInfo.sessionId = this.token;
              this.saveIpInfo();
            }
          } else {
            this.spinner.hide();
            this.errorMessage = 'You are already registered with password. Please go with normal signin';
            this.toastr.error(this.errorMessage, 'Login Error');
          }
        }
      });
    }


    if (this.auth.getAuthState()) {
      this.saveIpInfo();
      if (this.auth.isRegistrationCompleted()) {
        this.route.navigateByUrl('welcome');
      } else {
        this.route.navigateByUrl('user/account-setup');
      }
    } else {
      this.userIdle.stopWatching();
    }


    const emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(emailPattern)]],
      password: ['', [Validators.required]]
    });

    this.resetPassForm = this.fb.group({
      forgetEmail: ['', [Validators.required, Validators.pattern(emailPattern)]]
    });
  }

  saveIpInfo() {
    const session = this.auth.getToken().replace(/Bearer /g, '');
    this.auth.getClientLocation()
      .subscribe( (res: any) => {
        console.log(res);
        this.ipInfo.city = res.cityName;
        this.ipInfo.countrycode = res.countryCode;
        this.ipInfo.countryname = res.countryName;
        this.ipInfo.ipaddress = res.ipAddress;
        this.ipInfo.latitude = parseFloat(res.latitude);
        this.ipInfo.longitude = parseFloat(res.longitude);
        this.ipInfo.regioncode = res.countryCode;
        this.ipInfo.regionname = res.regionName;
        this.ipInfo.timezone = res.timeZone;
        this.ipInfo.zipcode = res.zipCode;
        this.ipInfo.sessionId = session;

        this.auth.saveCustLocation(this.ipInfo).subscribe((resu: any) => {
          this.auth.getUser().subscribe((userData: User) => {
            this.currentUser = userData;
            this.spinner.hide();
              sessionStorage.setItem('currentUser', JSON.stringify(this.currentUser));
              if (this.currentUser.mobile === null) {
                this.toastr.success('Logged In Successfully');
                this.spinner.hide();
                this.route.navigateByUrl('user/complete-registration');
              } else if (!this.currentUser.registrationCompleted) {
                this.toastr.success('Logged In Successfully');
                this.spinner.hide();
                this.route.navigateByUrl('user/account-setup');
              } else {
                this.toastr.success('Logged In Successfully');
                this.spinner.hide();
                this.route.navigateByUrl('welcome');
              }
          }, err => {
            this.errorMessage = err.error.message;
            this.toastr.error(this.errorMessage, 'Login Error');
          });
        }, err => {
          console.log(err);
        });
      }, err => {
        this.ipInfo.city = 'Chennai';
        this.ipInfo.countrycode = 'IN';
        this.ipInfo.countryname = 'India';
        this.ipInfo.ipaddress = '223.31.225.226';
        this.ipInfo.latitude = 13.0833;
        this.ipInfo.longitude = 80.2833;
        this.ipInfo.regioncode = 'TN';
        this.ipInfo.regionname = 'Tamil Nadu';
        this.ipInfo.timezone = 'Asia/Kolkata';
        this.ipInfo.zipcode = '600016';
        this.ipInfo.sessionId = session;

        this.auth.saveCustLocation(this.ipInfo).subscribe((resu: any) => {
          this.auth.getUser().subscribe((userData: User) => {
            this.currentUser = userData;
              sessionStorage.setItem('currentUser', JSON.stringify(this.currentUser));
              if (this.currentUser.mobile === null) {
                this.toastr.success('Logged In Successfully');
                this.route.navigateByUrl('user/complete-registration');
              } else if (!this.currentUser.registrationCompleted) {
                this.toastr.success('Logged In Successfully');
                this.route.navigateByUrl('user/account-setup');
              } else {
                this.toastr.success('Logged In Successfully');
                this.route.navigateByUrl('welcome');
              }
          }, err => {
            this.isError = true;
            this.errorMessage = err.error.message;
            this.toastr.error(this.errorMessage, 'Login Error');
          });
        }, err => {
          console.log(err);
        });
      });
      // return true;
  }

  goToRegister() {
    this.route.navigateByUrl('user/register');
  }


  signOut(): void {
  // this.auth.signOut();
  }


  getOtherMailDetails(mailData) {
    this.showOtherMailFrm = true;
  }

  loginUser() {
    this.btnClicked = true;
    this.loadingBank = true;
    this.isError = false;
    this.auth.loginDetails(this.loginForm.value)
      .subscribe( (user: HttpResponse<any>) => {
        console.log(user.headers.get('authorization'));
        const token = user.headers.get('authorization');
        sessionStorage.setItem('Token', token);
        this.ipInfo.username = this.loginForm.get('email').value;
        this.saveIpInfo();
      }, err => {
        if (err.status === 401) {
          this.btnClicked = false;
          this.isError = true;
          this.errorMessage = err.error.message;
          if (this.errorMessage === 'Authentication Failed: Cannot pass null or empty values to constructor') {
            this.toastr.error('You have registered using your Google Credentials. Please click on Google SignIn', 'Login Error');
          } else {
            this.toastr.error(this.errorMessage, 'Login Error');
          }
          this.loadingBank = false;
        } else {
          this.isError = true;
          this.btnClicked = false;
          this.errorMessage = err.error.message;
          this.toastr.error(this.errorMessage, 'Login Error');
          this.loadingBank = false;
        }
      });
  }


  displayPasswordAssistence() {
    this.showPasswordAssistence = true;
  }

  resetPassword() {
    this.loadingBank = true;
    console.log(this.resetPassForm.value);
    this.auth.resetPass(this.resetPassForm.value)
      .subscribe(data => {
        alert('Reset Password link has been sent.')
        this.showPasswordAssistence = false;
        this.loadingBank = false;
      }, err => {
        this.isError1 = true;
        this.errorMessage = err.error.message;
        this.toastr.error(this.errorMessage, 'Login Error');
        this.loadingBank = false;
      });
  }
}
