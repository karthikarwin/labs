import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '@app/core';
import { FundService } from '@app/core';

@Component({
  selector: 'app-withdrawal',
  templateUrl: './withdrawal.component.html',
  styleUrls: ['./withdrawal.component.css']
})
export class WithdrawalComponent implements OnInit {
  withdrawalObj: any;
  user: any;
  notAnyDate: Boolean = true;
  agreed: Boolean;
  withdrawalForm: FormGroup;
  isUnits: Boolean;

  constructor(private fb: FormBuilder, private auth: AuthService,
  private fs: FundService) {
    this.user = this.auth.getUserFromSession();

    this.fs.getIncompleteTrans(this.user.custId, 'withdrawal').subscribe((resp: any) => {
      console.log(resp);
      if (resp !== '' || resp !== null) {
        this.withdrawalObj = resp.jsonString;
      }
    }, err => {
      this.withdrawalObj = {};
    });
  }

  ngOnInit() {
    this.withdrawalForm = this.fb.group({
      folioNo: ['', [Validators.required]],
      withdrawFrom: ['', [Validators.required]],
      withdrawValue: ['amount', [Validators.required]],
      amount: ['', [Validators.required]],
      unit: [],
      swpFrequency: ['', Validators.required],
      swpDate: ['', Validators.required],
      fInsDate: ['', Validators.required],
      lInsDate: ['', Validators.required],
      fInsMonth: [''],
      lInsMonth: [''],
      fInsYear: [''],
      lInsYear: [''],
      untilCancel: [false],
      bank: ['', Validators.required],
      agreed: ['', Validators.required]
    });

    this.withdrawalForm.get('withdrawValue').valueChanges
      .subscribe( value => {
        this.setRedeemOption(value);
      });
    this.withdrawalForm.get('agreed').valueChanges
      .subscribe(agreed => {
        if (agreed) {
          this.agreed = true;
        } else {
          this.agreed = false;
        }
      });
  }

  withdrawal() {
    console.log(this.withdrawalForm.value);

    const fInsDate = this.withdrawalForm.value.fInsDate;
    const lInsDate = this.withdrawalForm.value.lInsDate;

    const fInsStrDate = this.formatDate(this.fetchDay(fInsDate), this.fetchMonth(fInsDate), this.fetchYear(fInsDate));
    const lInsStrDate = this.formatDate(this.fetchDay(lInsDate), this.fetchMonth(lInsDate), this.fetchYear(lInsDate));


    this.withdrawalObj = {
      fromProductId: this.withdrawalForm.value.withdrawFrom,
      amountOrUnit: this.withdrawalForm.value.withdrawValue,
      amount: this.withdrawalForm.value.amount,
      frequency: this.withdrawalForm.value.swpFrequency,
      firstInstallmentDate: fInsStrDate,
      lastInstallmentDate: lInsStrDate,
      isContinueTillNotify: this.withdrawalForm.value.untilCancel,
      bankId: 2,
      accountNo: this.withdrawalForm.value.folioNo,
      custId: this.user.custId
    };

    const updObj = {
      custId: this.user.custId,
      jsonString: JSON.stringify(this.withdrawalObj),
      screenName: 'withdrawal'
    };
    this.fs.updateIncompTrans(updObj).subscribe((resp) => {
      console.log(resp);
      /* this.fs.saveSwp(this.withdrawalObj).subscribe((resp) => {
          console.log(resp);
        }); */
    });

    console.log(this.withdrawalObj);
  }

  setRedeemOption(value: String) {
    console.log(value);
    if (value === 'amount') {
      this.withdrawalForm.get('unit').clearValidators();
      this.withdrawalForm.get('amount').setValidators(Validators.required);
    } else if (value === 'unit') {
      this.withdrawalForm.get('unit').setValidators(Validators.required);
      this.withdrawalForm.get('amount').clearValidators();
    }
    this.withdrawalForm.get('unit').updateValueAndValidity();
    this.withdrawalForm.get('amount').updateValueAndValidity();
  }

  changeFormat(e) {
    console.log(e.target.value);
    if (e.target.value !== '4') {
      this.notAnyDate = false;
    } else {
      this.notAnyDate = true;
    }
    console.log(this.withdrawalForm.get('fInsDate').value);
  }

  formatDate(day, month, year): String {
    const fullDate = `${day}-${month}-${year}`;
    return fullDate;
  }
  fetchDay(obj) {
    let day = obj.getDate().toString();
    day = String('00' + day).slice(-2);
    return day;
  }
  fetchMonth(obj) {
    let month = obj.getMonth() + 1;
    month = month.toString();
    month = String('00' + month).slice(-2);
    return month;
  }
  fetchYear(obj) {
    let year = obj.getFullYear();
    year = String('0000' + year).slice(-4);
    return year;
  }
}
