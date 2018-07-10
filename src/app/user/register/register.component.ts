import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AuthService } from '@app/core';
import { ToastrService } from 'ngx-toastr';
import { UserIdleService } from 'angular-user-idle';

function passwordCheck(c: AbstractControl): {[key: string]: Boolean} | null {
  const passVal = c.get('password');
  const cPassVal = c.get('cnfPassword');
  if (passVal.pristine || cPassVal.pristine) {
    return null;
  }
  if (passVal.value !== cPassVal.value) {
    return { 'match' : true };
  }
  return null;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  signUpForm: FormGroup;
  matchError: Boolean = false;
  enblBtn: Boolean = false;
  showWelcomeMsgSec: Boolean = false;
  userMailId: string;
  loadingBank: Boolean = false;
  isError: Boolean = false;
  errorMessage: String;
  btnClicked: Boolean = false;

  constructor(private router: Router, private fb: FormBuilder,
              private auth: AuthService,
              private toastr: ToastrService,
              private userIdle: UserIdleService) {
                if (this.auth.getAuthState()) {
                  if (this.auth.isRegistrationCompleted()) {
                    this.router.navigateByUrl('welcome')
                  } else {
                    this.router.navigateByUrl('user/account-setup');
                  }
                } else {
                  this.userIdle.stopWatching();
                }
  }

  ngOnInit() {
    const emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
    const passwordPattern = '^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$';
    this.signUpForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(emailPattern)]],
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(150)]],
      passwords: this.fb.group({
        password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(16), Validators.pattern(passwordPattern)]],
        cnfPassword: ['', Validators.required],
      }, {validator: passwordCheck}),
      mobile: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      recaptchaReactive: [null, Validators.required]
    });
  }


  signUp() {
    this.loadingBank = true;
    this.btnClicked = true;
    this.userMailId = this.signUpForm.get('email').value;
    this.auth.signUp(this.signUpForm.value)
      .subscribe( (data) => {
        this.loadingBank = false;
        this.showWelcomeMsgSec = true;
        this.toastr.success('Registered Successfully');
      }, err => {
        /* this.btnClicked = false; */
        this.toastr.error(err.error.message, 'SignUp Error');
        this.loadingBank = false;
      });
  }

  onlyNumber(e) {
  // console.log(e.charCode);
    if ( e.charCode < 48 || e.charCode > 57 ) {
      return false;
    } else {
      return true;
    }
  }

  gotoLandinPage() {
    this.router.navigateByUrl('welcomuser');
  }

  showInvAccountPage() {
  this.router.navigateByUrl('invaccountsetup');
  }

  goToLogin() {
    this.router.navigateByUrl('/user/login');
  }
}
