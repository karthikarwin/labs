import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BankDetails } from '../../core/_models/bank';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AccountService } from '@app/core';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '@app/core';
import { ToastrService } from 'ngx-toastr';
/* import { CookieService } from 'ngx-cookie'; */

@Component({
  selector: 'app-account-setup',
  templateUrl: './account-setup.component.html',
  styleUrls: ['./account-setup.component.css']
})
export class AccountSetupComponent implements OnInit {
  cookieValue: string;
  bankList: Array<BankDetails>;
  @ViewChild('inputBank') bn: ElementRef;
  accountInfo: FormGroup;
  panBlur: Boolean;
  aadharBlur: Boolean;
  micrBlur: Boolean;
  ifscBlur: Boolean;
  user: any;
  panNo: any;
  aadharNo: any;
  bankDetailsFromApi: BankDetails;
  loadingBank: Boolean = false;
  isPanValid: Boolean = false;
  isPanInvalid: Boolean = false;
  isaadhaarValid: Boolean = false;
  isaadhaarInvalid: Boolean = false;
  account: Object = {
    'pan': '',
    'aadhaar': ''
  };
  loadingPAN = false;
  loadingaadhaar = false;
  formStep2: Boolean = true;
  formStep3: Boolean = true;
  PANClassActive = true;
  PANClassCompleted = false;
  aadharClassActive = false;
  aadharClassCompleted = false;
  bankClassActive = false;
  bankClassCompleted = false;
  types: any;

  step2: any = {
    showNext: true,
    showPrev: true
  };

  step3: any = {
    showSecret: false
  };

  data: any = {};
  typingTimer: any;
  typingInterval: any = 500;

  isCompconsted: Boolean = false;


  constructor(private elRef: ElementRef,
              private auth: AuthService,
              private accService: AccountService,
              private router: Router,
              private fb: FormBuilder,
              private toastr: ToastrService,
              private cookieService: CookieService) {
                this.user = this.auth.getUserFromSession();
                if (this.user.registrationCompleted) {
                  this.router.navigateByUrl('/welcome');
                }
            }

  ngOnInit() {
    this.cookieValue = this.cookieService.get('JSESSIONID');
    this.cookieService.deleteAll('/wmp-server', 'quantlabs.in');
    console.log('Found', this.cookieValue);
    this.getAccType();
    const panPattern = '^[a-zA-Z]{5}\\d{4}[a-zA-Z]{1}$';
    const aadhaarPattern = '^\\d{4}\\d{4}\\d{4}$';
    const micrPattern = '^\\d{9}$';
    const ifscPattern = '^[A-Za-z]{4}[a-zA-Z0-9]{7}$';
    /* if (sessionStorage.getItem('currentUser')) {
      this.user = JSON.parse(sessionStorage.getItem('currentUser'));
    } */
    this.accountInfo = this.fb.group({
      panNumber: ['', [Validators.required, Validators.pattern(panPattern)]],
      aadharNumber: [{ value: '', disabled: true }, [Validators.required, Validators.pattern(aadhaarPattern)]],
      micrCode: [{ value: '', disabled: true }, [Validators.pattern(micrPattern)]],
      ifscCode: [{ value: '', disabled: true }, [Validators.pattern(ifscPattern)]],
      bankName: [''],
      branchName: [''],
      accountNumber: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(12), Validators.maxLength(12)]],
      accountType: [{ value: '', disabled: true }, Validators.required]
    });
    const that = this;
  }

  getAccType() {
    this.accService.getAccType().subscribe( (types) => {
      this.types = types;
    }, err => {
      console.log(err);
    });
  }

  onCompconste(event) {
    this.isCompconsted = true;
  }

  validatePAN(event) {
    this.loadingPAN = true;
    if (event.target.value !== '' && event.target.value.length === 10) {
      if (this.accountInfo.get('panNumber').valid) {
        setTimeout(() => {
          this.panNo = event.target.value.toUpperCase();
          this.loadingPAN = false;
          this.isPanValid = true;
          this.isPanInvalid = false;
          this.accountInfo.get('aadharNumber').enable();
          this.elRef.nativeElement.querySelector('#inputaadhaar').focus();
          this.PANClassCompleted = true;
          this.aadharClassActive = true;
        }, 1000);
      } else {
        setTimeout(() => {
          this.loadingPAN = false;
          this.isPanValid = false;
          this.isPanInvalid = true;
          this.elRef.nativeElement.querySelector('#inputPan').focus();
        }, 1000);
      }
    } else {
      this.loadingPAN = false;
      this.isPanValid = false;
      this.isPanInvalid = false;
    }
  }

  validateaadhaar(event) {
    this.loadingaadhaar = true;
    const aadhaar = this.accountInfo.get('aadharNumber');
    if (event.target.value !== '' && event.target.value.length === 12) {
      if (aadhaar.valid) {
        setTimeout(() => {
          this.aadharNo = event.target.value;
          this.loadingaadhaar = false;
          this.isaadhaarValid = true;
          this.isaadhaarInvalid = false;
          this.accountInfo.get('micrCode').enable();
          this.accountInfo.get('ifscCode').enable();
          this.accountInfo.get('accountNumber').enable();
          this.accountInfo.get('accountType').enable();
          this.bankClassActive = true;
          this.aadharClassCompleted = true;
        }, 1000);
      } else {
        setTimeout(() => {
          this.loadingaadhaar = false;
          this.isaadhaarValid = false;
          this.isaadhaarInvalid = true;
          this.aadharClassCompleted = true;
        }, 1000);
      }
    } else {
      this.loadingaadhaar = false;
      this.isaadhaarValid = false;
      this.isaadhaarInvalid = false;
    }
  }

  onlyNumber(e) {
    // console.log(e.charCode);
    if ( e.charCode < 48 || e.charCode > 57 ) {
      return false;
    } else {
      return true;
    }
  }

  getBankByMICR(e) {
    const code = e.target.value;
    this.loadingBank = true;
    if (code !== '' && code.length === 9 && e.target.validity.valid) {
      this.accService.getBank(code).subscribe( (bankDetails: BankDetails) => {
        console.log(bankDetails);
        /* this.bankDetailsFromApi =  bankDetails[0]; */
        const code1 = bankDetails[0].ifscCode;

        // Get Details from IFSC

        this.accService.getBankIfsc(code1).subscribe( (bankDetails1: BankDetails) => {
          console.log(bankDetails1);
          this.bankDetailsFromApi =  bankDetails1[0];
          this.accountInfo.controls['bankName'].setValue(bankDetails1[0].bankName);
          this.accountInfo.controls['ifscCode'].setValue(bankDetails1[0].ifscCode);
          this.accountInfo.controls['branchName'].setValue(bankDetails1[0].branch);
          this.accountInfo.controls['micrCode'].setValue(bankDetails1[0].micrNumber);
          this.loadingBank = false;
          this.elRef.nativeElement.querySelector('#inputAccNo').focus();
        }, err => {
          this.loadingBank = false;
          this.accountInfo.controls['bankName'].setValue('');
          this.accountInfo.controls['ifscCode'].setValue('');
          this.accountInfo.controls['branchName'].setValue('');
          this.accountInfo.controls['micrCode'].setValue('');
          /* this.toastr.error('The requested Bank details not available in the database'); */
        });

        /* this.accountInfo.controls['bankName'].setValue(bankDetails[0].bankName);
        this.accountInfo.controls['branchName'].setValue(bankDetails[0].branch);
        this.accountInfo.controls['ifscCode'].setValue(bankDetails[0].ifscCode);
        this.loadingBank = false;
        this.elRef.nativeElement.querySelector('#inputAccNo').focus(); */
      }, err => {
        this.loadingBank = false;
        this.accountInfo.controls['bankName'].setValue('');
        this.accountInfo.controls['branchName'].setValue('');
        this.accountInfo.controls['ifscCode'].setValue('');
        this.toastr.error('Invalid IFSC Code');
      });
    } else {
      this.loadingBank = false;
      this.accountInfo.controls['bankName'].setValue('');
      this.accountInfo.controls['branchName'].setValue('');
      this.accountInfo.controls['ifscCode'].setValue('');
    }
  }

  getBankByIFSC(e) {
    const code = e.target.value;
    console.log(e);
    this.loadingBank = true;
    if (code !== '' && code.length === 11 && e.target.validity.valid) {
      this.accService.getBankIfsc(code).subscribe( (bankDetails: BankDetails) => {
        console.log(bankDetails);
        this.loadingBank = false;
        if (bankDetails[0].length > 0) {
          this.bankDetailsFromApi =  bankDetails[0];
          this.accountInfo.controls['bankName'].setValue(bankDetails[0].bankName);
          this.accountInfo.controls['branchName'].setValue(bankDetails[0].branch);
          this.accountInfo.controls['micrCode'].setValue(bankDetails[0].micrNumber);
          this.elRef.nativeElement.querySelector('#inputAccNo').focus();
        } else {
          this.accountInfo.controls['bankName'].setValue('');
          this.accountInfo.controls['branchName'].setValue('');
          this.accountInfo.controls['micrCode'].setValue('');
          this.toastr.error('Invalid IFSC Code');
          this.elRef.nativeElement.querySelector('#inputIFSC').focus();
        }
      }, err => {
        this.loadingBank = false;
        this.accountInfo.controls['bankName'].setValue('');
        this.accountInfo.controls['branchName'].setValue('');
        this.accountInfo.controls['micrCode'].setValue('');
        this.toastr.error('Invalid IFSC Code');
      });
    } else {
      this.loadingBank = false;
      this.accountInfo.controls['bankName'].setValue('');
      this.accountInfo.controls['branchName'].setValue('');
      this.accountInfo.controls['micrCode'].setValue('');
    }
  }

  saveCusBankDetails() {
    // console.log(data.value);
    if (this.accountInfo.valid) {
      const formToSubmit = {
        'panNumber': this.accountInfo.get('panNumber').value,
        'aadharNumber': this.accountInfo.get('aadharNumber').value,
        'ifscCode': this.accountInfo.get('ifscCode').value,
        'accountNumber': this.accountInfo.get('accountNumber').value,
        'accountType': parseInt(this.accountInfo.get('accountType').value, 10),
        'customerId': this.user.custId
      };
      // console.log('formToSubmit', formToSubmit);
      this.accService.submitCustomerDetails(formToSubmit).subscribe( (resp) => {
        this.toastr.success('Updated Successfully');
        this.router.navigateByUrl('/welcome');
      }, err => {
        /* this.toastr.error(err.error.message); */
      });
    } else {
      this.toastr.error('Fill All the details');
    }
  }

  /* getBanksListMicr() {
    const micrCode = this.accountInfo.get('micrCode').value;
    if (micrCode.length > 3) {
      this.accService.getBank(micrCode).subscribe( (bankDetails: Array<BankDetails>) => {
        this.bankList = bankDetails;
        this.bankList = this.bankList.slice(0, 30);
      });
    }
  } */

  getBanksListMicr() {
    const code = this.accountInfo.get('micrCode').value;
    const that = this;
    clearTimeout(this.typingTimer);
    if (code.length > 0) {
      this.typingTimer = setTimeout(() => {
        this.accService.getBank(code).subscribe( (bankDetails: Array<BankDetails>) => {
          this.bankList = bankDetails;
          this.bankList = this.bankList.slice(0, 30);
        });
      }, this.typingInterval);
    }
  }

  getBanksListIfsc() {
    const code = this.accountInfo.get('ifscCode').value;
    const that = this;
    clearTimeout(this.typingTimer);
    if (code.length > 4) {
      this.typingTimer = setTimeout(() => {
        this.accService.getBankIfsc(code).subscribe( (bankDetails: Array<BankDetails>) => {
          this.bankList = bankDetails;
          this.bankList = this.bankList.slice(0, 30);
        }, err => {
          this.toastr.error('Error Occured');
        });
      }, this.typingInterval);
    }
  }

  /* searchMICR(thiss) {
    // const code = thiss.accountInfo.get('micrCode').value;
    console.log(thiss);
    this.accService.getBank(thiss).subscribe( (bankDetails: Array<BankDetails>) => {
      this.bankList = bankDetails;
      this.bankList = this.bankList.slice(0, 30);
    });
  } */

  /* getBanksListIfsc() {
    const ifscCode = this.accountInfo.get('ifscCode').value;
    if (ifscCode.length > 4) {
      this.accService.getBankIfsc(ifscCode).subscribe( (bankDetails: Array<BankDetails>) => {
        this.bankList = bankDetails;
        this.bankList = this.bankList.slice(0, 30);
      });
    }
  } */
}
