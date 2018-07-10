import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '@app/core';
import { FundService } from '@app/core';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.css']
})
export class TransferComponent implements OnInit {
  transferObj: any;
  user: any;
  notAnyDate: Boolean = true;
  agreed: Boolean;
  transferForm: FormGroup;
  isUnits: Boolean;

  constructor(private fb: FormBuilder, private fs: FundService, private auth: AuthService) {
    this.user = this.auth.getUserFromSession();
    this.fs.getIncompleteTrans(this.user.custId, 'transfer').subscribe((resp: any) => {
      console.log(resp);
      if (resp !== '' || resp !== null) {
        this.transferObj = resp.jsonString;
      }
    }, err => {
      this.transferObj = {};
    });
  }

  ngOnInit() {
    this.transferForm = this.fb.group({
      transferFrom: ['', [Validators.required]],
      switchValue: ['amount', [Validators.required]],
      amount: ['', [Validators.required]],
      unit: [],
      transferTo: ['', Validators.required],
      plan: ['', Validators.required],
      option: ['', Validators.required],
      stpFrequency: ['', Validators.required],
      stpDate: ['', Validators.required],
      fInsDate: ['', Validators.required],
      lInsDate: ['', Validators.required],
      fInsMonth: [''],
      lInsMonth: [''],
      fInsYear: [''],
      lInsYear: [''],
      untilCancel: [false],
      agreed: ['', Validators.required]
    });

    this.transferForm.get('switchValue').valueChanges
      .subscribe( value => {
        this.setRedeemOption(value);
      });
    this.transferForm.get('agreed').valueChanges
      .subscribe(agreed => {
        if (agreed) {
          this.agreed = true;
        } else {
          this.agreed = false;
        }
      });
  }

  transfer() {
    alert('Coming Soon...');

    const fInsDate = this.transferForm.value.fInsDate;
    const lInsDate = this.transferForm.value.lInsDate;

    const fInsStrDate = this.formatDate(this.fetchDay(fInsDate), this.fetchMonth(fInsDate), this.fetchYear(fInsDate));
    const lInsStrDate = this.formatDate(this.fetchDay(lInsDate), this.fetchMonth(lInsDate), this.fetchYear(lInsDate));
    console.log(this.transferForm.value);
    this.transferObj = {
      fromProductId: this.transferForm.value.transferFrom,
      toProductId: this.transferForm.value.transferTo,
      amountOrUnit: this.transferForm.value.switchValue,
      amount: this.transferForm.value.amount,
      frequency: this.transferForm.value.stpFrequency,
      firstInstallmentDate: fInsStrDate,
      lastInstallmentDate: lInsStrDate,
      continueTillNotify: this.transferForm.value.untilCancel,
      bankId: 2,
      accountNo: '121234',
      custId: this.user.custId
    };
    console.log(this.transferObj);

    const updObj = {
      custId: this.user.custId,
      jsonString: JSON.stringify(this.transferObj),
      screenName: 'transfer'
    };
    this.fs.updateIncompTrans(updObj).subscribe((resp) => {
      console.log(resp);
      /* this.fs.saveStp(this.transferObj).subscribe((resp) => {
          console.log(resp);
        }); */
    });
  }

  setRedeemOption(value: String) {
    console.log(value);
    if (value === 'amount') {
      this.transferForm.get('unit').clearValidators();
      this.transferForm.get('amount').setValidators(Validators.required);
    } else if (value === 'unit') {
      this.transferForm.get('unit').setValidators(Validators.required);
      this.transferForm.get('amount').clearValidators();
    }
    this.transferForm.get('unit').updateValueAndValidity();
    this.transferForm.get('amount').updateValueAndValidity();
  }

  changeFormat(e) {
    console.log(e.target.value);
    if (e.target.value !== '4') {
      this.notAnyDate = false;
    } else {
      this.notAnyDate = true;
    }
    console.log(this.transferForm.get('fInsDate').value);
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
