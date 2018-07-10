import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '@app/core';
import { User } from '../../core/_models/user';
import { FundService } from '@app/core';

@Component({
  selector: 'app-switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.css']
})
export class SwitchComponent implements OnInit {
  user: User;
  switch: any;
  agreed: Boolean;
  switchForm: FormGroup;
  isUnits: Boolean;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private fs: FundService) {
    this.user = this.auth.getUserFromSession();

    this.fs.getIncompleteTrans(this.user.custId, 'switch').subscribe((resp: any) => {
      console.log(resp);
      if (resp !== '' || resp !== null) {
        this.switch = resp.jsonString;
      }
    }, err => {
      this.switch = {};
    });
  }

  ngOnInit() {
    this.switchForm = this.fb.group({
      folioNo: ['', [Validators.required]],
      switchOut: ['', [Validators.required]],
      switchOption: ['full', [Validators.required]],
      switchValue: ['amount', [Validators.required]],
      amount: [true, [Validators.required]],
      unit: [],
      switchIn: ['', Validators.required],
      plan: ['', Validators.required],
      option: ['', Validators.required],
      agreed: ['', Validators.required]
    });

    this.switchForm.get('switchValue').valueChanges
      .subscribe( value => {
        this.setRedeemOption(value);
      });
    this.switchForm.get('agreed').valueChanges
      .subscribe(agreed => {
        if (agreed) {
          this.agreed = true;
        } else {
          this.agreed = false;
        }
      });
  }

  /* switchTrans() {
    alert('Coming Soon...');
  } */

  setRedeemOption(value: String) {
    console.log(value);
    if (value === 'amount') {
      this.switchForm.get('unit').clearValidators();
      this.switchForm.get('amount').setValidators(Validators.required);
    } else if (value === 'unit') {
      this.switchForm.get('unit').setValidators(Validators.required);
      this.switchForm.get('amount').clearValidators();
    }
    this.switchForm.get('unit').updateValueAndValidity();
    this.switchForm.get('amount').updateValueAndValidity();
  }

  switchTrans() {
    const updObj = {
      custId: this.user.custId,
      jsonString: JSON.stringify(this.switch),
      screenName: 'switch'
    };
    this.fs.updateIncompTrans(updObj).subscribe((resp) => {
      console.log(resp);
      const switchObj = {
        accountNumber: this.switchForm.value.folioNo,
        fromProductCode: this.switchForm.value.switchOut,
        toProductCode: this.switchForm.value.switchIn,
        switchOption: this.switchForm.value.switchOption,
        amountOrUnit: this.switchForm.value.switchValue,
        amount: this.switchForm.value.amount,
        bankId: 2
      };
      this.fs.saveSwitch(switchObj).subscribe((resp) => {
          console.log(resp);
      });
    }, err => {
      const switchObj = {
        accountNumber: this.switchForm.value.folioNo,
        fromProductCode: this.switchForm.value.switchOut,
        toProductCode: this.switchForm.value.switchIn,
        switchOption: this.switchForm.value.switchOption,
        amountOrUnit: this.switchForm.value.switchValue,
        amount: this.switchForm.value.amount,
        bankId: 2
      };
      this.fs.saveSwitch(switchObj).subscribe((resp) => {
          console.log(resp);
      });
    });
  }

}
