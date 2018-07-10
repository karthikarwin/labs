import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.css']
})
export class OtpComponent implements OnInit {

  @Output() otpResp = new EventEmitter();

  otpForm: FormGroup;
  show: Boolean = true;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.otpForm = this.fb.group({
      otpVia: ['', Validators.required],
      otpCode: ['', Validators.required]
    });

    this.otpForm.get('otpVia').valueChanges
      .subscribe(agreed => {
        this.show = false;
      });
  }

  submitOtp() {
    console.log(this.otpForm.value);
    const otp = this.otpForm.value.otpCode;
    /* alert(`OTP applied Successfully`); */
    if (otp === '1234') {
      this.otpResp.emit('true');
    } else {
      this.otpResp.emit('true');
    }
  }

}
