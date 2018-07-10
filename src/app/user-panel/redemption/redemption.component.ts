import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '@app/core';
import { FundService } from '@app/core';
import { User } from '../../core/_models/user';

@Component({
  selector: 'app-redemption',
  templateUrl: './redemption.component.html',
  styleUrls: ['./redemption.component.css']
})
export class RedemptionComponent implements OnInit {
  redemption: any;
  user: User;
  agreed: Boolean;
  redemptionForm: FormGroup;
  isUnits: Boolean;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private fs: FundService) {
      this.user = this.auth.getUserFromSession();

      this.fs.getIncompleteTrans(this.user.custId, 'redemption').subscribe((resp: any) => {
        console.log(resp);
        if (resp !== '' || resp !== null) {
          this.redemption = resp.jsonString;
        }
      }, err => {
        this.redemption = {};
      });
    }

  ngOnInit() {
    this.redemptionForm = this.fb.group({
      folioNo: ['', [Validators.required]],
      scheme: ['', [Validators.required]],
      redOpt: ['amount', [Validators.required]],
      amount: ['', [Validators.required]],
      unit: [],
      bank: ['', Validators.required],
      agreed: ['', Validators.required]
    });

    this.redemptionForm.get('redOpt').valueChanges
      .subscribe( value => {
        this.setRedeemOption(value);
      });
    this.redemptionForm.get('agreed').valueChanges
      .subscribe(agreed => {
        if (agreed) {
          this.agreed = true;
        } else {
          this.agreed = false;
        }
      });
  }

  setRedeemOption(value: String) {
    console.log(value);
    if (value === 'amount') {
      this.redemptionForm.get('unit').clearValidators();
      this.redemptionForm.get('amount').setValidators(Validators.required);
    } else if (value === 'unit') {
      this.redemptionForm.get('unit').setValidators(Validators.required);
      this.redemptionForm.get('amount').clearValidators();
    }
    this.redemptionForm.get('unit').updateValueAndValidity();
    this.redemptionForm.get('amount').updateValueAndValidity();
  }

  submitRedemption() {
    const username: any = this.user;
    console.log(this.redemptionForm.value);
    this.redemption = {
      customerId: parseInt(username.custId, 2),
      productId: this.redemptionForm.get('scheme').value,
      amountOrUnit: (this.redemptionForm.get('redOpt').value === 'amount') ? true : false,
      amount: parseFloat(this.redemptionForm.get('amount').value),
      bankId: parseInt(this.redemptionForm.get('bank').value, 2),
      accountNo: this.redemptionForm.get('folioNo').value
    };
    console.log(this.redemption);
    const updObj = {
      custId: this.user.custId,
      jsonString: JSON.stringify(this.redemption),
      screenName: 'redemption'
    };
    this.fs.updateIncompTrans(updObj).subscribe((resp) => {
      console.log(resp);
      /* this.fs.saveRedemption(redemption).subscribe((resp) => {
          console.log(resp);
        }); */
    });
  }

}
