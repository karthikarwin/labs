import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@app/core';

function passwordCheck(c: AbstractControl): {[key: string]: Boolean} | null {
  const passVal = c.get('password');
  const cPassVal = c.get('cpassword');
  if (passVal.pristine || cPassVal.pristine) {
    return null;
  }
  if (passVal.value !== cPassVal.value) {
    return { 'match' : true };
  }
  return null;
}

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  loadingBank: Boolean = false;
  errorMessage: any;
  isError: Boolean = false;
  resetPassForm: FormGroup;
  userReset: Array<any> = [];

  constructor(private fb: FormBuilder,
    private actRoute: ActivatedRoute,
    private router: Router,
    private auth: AuthService) {
    this.actRoute.queryParams.subscribe(params => {
      if (params) {
        // console.log(Object.keys(params)[0]);
        const b64 = Object.keys(params)[0];
        // console.log(atob(b64));
        const act_str = atob(b64);
        this.userReset = act_str.split(' ');
        // console.log(this.userReset);
      } else {
        this.router.navigateByUrl('/user/login');
      }
    });
  }

  ngOnInit() {
    const passPattern = '^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$';
    this.resetPassForm = this.fb.group({
      passwords: this.fb.group({
        password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(16), Validators.pattern(passPattern)]],
        cpassword: ['', [Validators.required]]
      }, {validator: passwordCheck})
    });
  }

  resetPassword() {
    // console.log(data.value);
    const password = this.resetPassForm.get('passwords').get('password').value;
    const resetPass = {
      'password': password,
      'username': this.userReset[0],
      'resetToken': this.userReset[1]
    };

    this.auth.sendResetData(resetPass).subscribe( res => {
      this.router.navigateByUrl('/user/login');

    }, err => {
      this.isError = true;
      this.errorMessage = err.error.message;
      this.loadingBank = false;
    });
}

}
