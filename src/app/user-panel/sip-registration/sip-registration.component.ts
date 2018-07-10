import { Component, OnInit, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { FundService } from '@app/core';
import { Scheme } from '../../core/_models/scheme';
import { AuthService } from '@app/core';
import { User } from '../../core/_models/user';
import { PaymentService } from '@app/core';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import {DatePickerComponent, IDatePickerConfig} from 'ng2-date-picker';

declare var $;
declare var pnCheckoutShared;

@Component({
  selector: 'app-sip-registration',
  templateUrl: './sip-registration.component.html',
  styleUrls: ['./sip-registration.component.css']
})
export class SipRegistrationComponent implements OnInit {
  @ViewChild('dayPicker') datePicker: DatePickerComponent;
  token: string;
  transId: String;
  response: Boolean;
  responseObj: any;
  sipObj: any;
  user: User;
  folioNumber: any;
  dateFormat: String = 'DD-MM-YYYY';
  mandateAgreed: Boolean;
  agreed: Boolean;
  sipPaymentForm: FormGroup;
  mandateForm: FormGroup;
  isUnits: Boolean;
  step1: Boolean = true;
  step2: Boolean = false;
  step3: Boolean = false;
  fileName: String = '';
  notAnyDate: Boolean = false;
  scheme: Scheme = {
    'code': '',
    'name': '',
    'isActive': '',
    'firstNavDate': 0,
    'planName': 'Direct Plan',
    'invOption': 'Dividend',
    'invType': 'Debt'
  };
  schemes: Array<Scheme>;
  isPhyMandate: Boolean = true;
  schemesResp: Boolean = false;

  failure: Boolean;

  selectedScheme: Scheme;
  amount: any;
  typedAmount: any;
  selectedSchemeCode: String;
  selectedSchemeName: String;
  custBanks: any[];
  sipObjResp: any;
  typingTimer: any;
  typingInterval: any = 500;
  minAmount: any;
  sipAllowed: Boolean = false;
  sipFrequencies: Array<any> = [];
  minAmntArray: Array<any> = [];
  minInstallments: any;
  invDates: any[];
  otpSuccess: Boolean = false;

  firstStepActive: Boolean = true;
  secondStepActive: Boolean;
  thirdStepActive: Boolean;
  firstStepCompleted: Boolean;
  secondStepCompleted: Boolean;
  thirdStepCompleted: Boolean;


  asyncSelected: string;
  typeaheadLoading: boolean;
  typeaheadNoResults: boolean;
  dataSource: Observable<any>;
  proceedOtp: Boolean = false;

  entAmount: Boolean = false;
  entSipDate: Boolean = false;
  entFIDate: Boolean = false;
  entLIDate: Boolean = false;
  entBank: Boolean = false;

  today: Date = new Date();
  months: Array<String> = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];
  currentMonth = this.today.getMonth() + 1;
  monthss: Array<String> = [];

  config: IDatePickerConfig = {
    monthFormat: 'MMM',
    format: 'MM/YYYY'
  };
  years: Array<any> = [];
  fInsMonthVar: any = '';
  fInsYearVar: any = '';
  lInsMonthVar: any = '';
  lInsYearVar: any = '';

  constructor(
    private fb: FormBuilder,
    private fs: FundService,
    private auth: AuthService,
    private route: ActivatedRoute,
    private paymentService: PaymentService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {
    this.user = this.auth.getUserFromSession();
  }

  ngOnInit() {
    /* this.spinner.show(); */
    this.route.params.subscribe((params) => {
      console.log(params['id']);
      if (params['id']) {
        this.selectSchemeDets(params['id']);
      }
    });

    this.dataSource = Observable.create((observer: any) => {
      // Runs on every search
      this.fs.getSchemes(this.asyncSelected)
        .subscribe( (schemes: Array<any>) => {
          observer.next(schemes);
        });
    });

    const that = this;
    this.sipPaymentForm = this.fb.group({
      sipAmount: [0, [Validators.required]],
      sipFrequency: ['', Validators.required],
      sipDate: ['', Validators.required],
      fInsDate: [''],
      lInsDate: [''],
      fInsMonthYear: [''],
      untilCancel: [false],
      bank: ['', Validators.required],
      agreed: ['', Validators.required]
    });

    if (!this.selectedSchemeCode) {
      this.fs.getIncompleteTrans(this.user.custId, 'sip-register').subscribe((resp: any) => {
        console.log(resp);
        if (resp === null) {
          this.sipPaymentForm.patchValue({
            sipAmount: 0,
            sipFrequency: '',
            fInsDate: '',
            lInsDate: '',
            bank: 0,
            untilCancel: ''
          });
        } else {
          let showOld = confirm('Do you want to continue with previous transaction?');
          this.spinner.hide();
          if (showOld) {
            console.log('OK');
            this.sipObjResp = JSON.parse(resp);
            console.log(this.sipObjResp);
            this.selectedSchemeCode = this.sipObjResp.productId;
            this.selectedSchemeName = this.sipObjResp.productName;
            this.folioNumber = this.sipObjResp.accountNumber;
            this.sipPaymentForm.patchValue({
              sipAmount: this.sipObjResp.amount,
              sipFrequency: this.sipObjResp.frequency,
              fInsDate: this.sipObjResp.firstInstallmentDate,
              lInsDate: this.sipObjResp.lastInstallmentDate,
              bank: this.sipObjResp.bankId,
              untilCancel: this.sipObjResp.continueTillNotify
            });
            this.selectedSchemePrev(this.selectedSchemeCode);
            this.showStep3();
          } else {
            console.log('Not OK');
            this.sipObjResp = {
              amount: 0,
              accountNumber: '',
              productId: '',
              frequency: '',
              firstInstallmentDate: '',
              lastInstallmentDate: '',
              bankId: 0,
              continueTillNotify: ''
            };
          }
        }
      }, err => {
        this.sipObjResp = {
          amount: 0,
          accountNumber: '',
          productId: '',
          frequency: '',
          firstInstallmentDate: '',
          lastInstallmentDate: '',
          bankId: 0,
          continueTillNotify: ''
        };
      });
    }

    console.log('form', this.sipPaymentForm);

    /* this.custBanks = */
    if (this.user.clientBankResponse.length > 0) {
      this.custBanks = this.user.clientBankResponse;
    }


    this.mandateForm = this.fb.group({
      mandateType: ['0', Validators.required],
      fileInput: [this.fileName, Validators.required],
      mandateAgreed: ['', Validators.required]
    });

    this.sipPaymentForm.get('agreed').valueChanges
      .subscribe(agreed => {
        if (agreed) {
          this.agreed = true;
        } else {
          this.agreed = false;
        }
      });

    this.mandateForm.get('mandateAgreed').valueChanges
      .subscribe(mandateAgreed => {
        if (mandateAgreed) {
          this.mandateAgreed = true;
        } else {
          this.mandateAgreed = false;
        }
      });

    this.mandateForm.get('mandateType').valueChanges
      .subscribe(isEman => {
        console.log(isEman);
        if (isEman === '1') {
          this.isPhyMandate = false;
        } else {
          this.isPhyMandate = true;
        }
      });

    this.sipPaymentForm.get('sipDate').valueChanges
      .subscribe(isDate => {
        console.log(isDate);
      });

    for ( let i = 0; i < this.months.length; i++ ) {
      if (i > this.today.getMonth()) {
        this.monthss.push(this.months[i]);
      }
      console.log('hope', this.monthss);
    }

    for (let j = 0; j < 11; j++ ) {
      this.years.push(this.today.getFullYear() + j);
    }

  }


  changeTypeaheadLoading(e: boolean): void {
    this.typeaheadLoading = e;
  }

  typeaheadOnSelect(e: TypeaheadMatch): void {
    console.log('Selected value: ', e.item.code);
    this.selectScheme(e.item);
  }


  onFileChange($event) {
    const file = $event.target.files[0];
    this.mandateForm.controls['fileInput'].setValue(file ? file.name : '');
  }

  submitSip() {
    alert('Coming Soon...');
    console.log(this.sipPaymentForm);
  }

  checkFInDate(e) {
    console.log(e.target.value);
    if (e.target.value === '') {
      this.toastr.error('Select SIP Investment Date');
      this.entFIDate = false;
    } else {
      this.entFIDate = true;
    }
  }

  showStep1() {
    this.step1 = true;
    this.step2 = false;
    this.step3 = false;
    this.otpSuccess = false;
    this.amount = 0;
    this.sipAllowed = false;
    this.selectedSchemeCode = '';
    this.selectedSchemeName = '';
    this.firstStepActive = true;
    this.secondStepActive = false;
    this.thirdStepActive = false;
    this.firstStepCompleted = false;
    this.secondStepCompleted = false;
    this.thirdStepCompleted = false;
  }
  showStep2() {
    this.step2 = true;
    this.step1 = false;
    this.step3 = false;
    this.firstStepActive = false;
    this.secondStepActive = true;
    this.thirdStepActive = false;
    this.firstStepCompleted = true;
    this.secondStepCompleted = false;
    this.thirdStepCompleted = false;
  }
  showStep3() {
    this.step3 = true;
    this.step2 = false;
    this.step1 = false;
    this.response = false;
    this.firstStepActive = false;
    this.secondStepActive = false;
    this.thirdStepActive = true;
    this.firstStepCompleted = true;
    this.secondStepCompleted = true;
    this.thirdStepCompleted = false;
  }

  getSchemes(e) {
    const query = e.target.value;
    /* console.log(query.length);
    console.log(e.target.value); */
    const that = this;
    clearTimeout(this.typingTimer);
    if (query.length > 3) {
      this.typingTimer = setTimeout(() => {
        this.fs.getSchemes(query).subscribe( (schemes: Array<Scheme>) => {
          console.log(schemes);
          this.schemesResp = true;
          this.schemes = schemes;
          this.schemes = this.schemes.slice(0, 30);
        });
    }, this.typingInterval);
    }
  }

  checkMinBal(e) {
    if (e.target.value < this.minAmount) {
      alert ('Minimum amount is ' + this.minAmount);
      this.entSipDate = false;
    } else {
      this.entSipDate = true;
    }
  }

  selectScheme(code) {
    console.log(code);
    this.selectedSchemeCode = code.code;
    this.selectedSchemeName = code.name;

    this.fs.getSchemeDetails(this.selectedSchemeCode).subscribe((details: Scheme) => {
      /* console.log(details); */
      this.selectedScheme = details;
      console.log(this.selectedScheme);
      this.schemesResp = false;
      this.showStep2();
      this.asyncSelected = '';
      let leng = details.transferInvestDetails.length;
      this.sipFrequencies = [];
      for (let i = 0; i < leng; i++) {
        if (details.transferInvestDetails[i].loadType === 'SIP') {
          console.log(details.transferInvestDetails[i].loadType);
          this.sipAllowed = true;
          this.sipFrequencies.push(details.transferInvestDetails[i].frequency);
        }
      }
      console.log(this.sipFrequencies);
    });
  }

  selectSchemeDets(code) {
    console.log(code);
    this.selectedSchemeCode = code;

    this.fs.getSchemeDetails(this.selectedSchemeCode).subscribe((details: Scheme) => {
      /* console.log(details); */
      this.selectedScheme = details;
      this.selectedSchemeName = details.name;
      console.log(this.selectedScheme);
      this.schemesResp = false;
      this.spinner.hide();
      this.showStep2();
      let leng = details.transferInvestDetails.length;

      for (let i = 0; i < leng; i++) {
        if (details.transferInvestDetails[i].loadType === 'SIP') {
          console.log(details.transferInvestDetails[i].loadType);
          this.sipAllowed = true;
          this.sipFrequencies.push(details.transferInvestDetails[i].frequency);
        }
      }
      console.log(this.sipFrequencies);
    });
  }

  selectedSchemePrev(code) {
    console.log(code);
    /* this.selectedSchemeCode = code.productId;
    this.selectedSchemeName = code.schemeName; */

    this.fs.getSchemeDetails(code).subscribe((details: Scheme) => {
      console.log('Selected', details);
      this.selectedScheme = details;
      this.minAmount = details.minInvestment;
      console.log(this.selectedScheme);
      this.selectedSchemeCode = this.selectedScheme.code;
      this.selectedSchemeName = this.selectedScheme.name;
    });
  }

  selectedFreq(e) {
    /* console.log(e.target.value); */
    let freq = e.target.value;
    if (freq === '') {
      console.log('Select some frequency');
      this.toastr.error('Select Some Frequency');
      this.entAmount = false;
      this.minAmount = 0;
    } else {
      const leng = this.selectedScheme.transferInvestDetails.length;
      for (let i = 0; i < leng; i++) {
        if (this.selectedScheme.transferInvestDetails[i].loadType === 'SIP' && this.selectedScheme.transferInvestDetails[i].frequency === freq) {
          this.minAmount = this.selectedScheme.transferInvestDetails[i].minInvamount;
          this.minInstallments = this.selectedScheme.transferInvestDetails[i].minInstallments;
          this.invDates = this.selectedScheme.transferInvestDetails[i].invdates.split(',');
          this.entAmount = true;
        }
      }
      console.log('1', this.minAmount);
      console.log('2', this.minInstallments);
      console.log('3', this.invDates);
    }
  }


  setFolio(e) {
    this.folioNumber = e.target.value;
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

  sendMandate() {
    const custId = this.auth.getUserFromSession().custId;
    const amount = parseInt(this.sipPaymentForm.get('sipAmount').value, 10);
    const frequency = this.sipPaymentForm.get('sipFrequency').value;
    const sipDate = this.sipPaymentForm.get('sipDate').value;
    const untilCancel = this.sipPaymentForm.get('untilCancel').value;
    /* const fInsDate = this.sipPaymentForm.get('fInsDate').value;
    const lInsDate = this.sipPaymentForm.get('lInsDate').value; */
    const fInsStrDate = this.sipPaymentForm.get('fInsDate').value;
    const lInsStrDate = this.sipPaymentForm.get('lInsDate').value;
    const bank = parseInt(this.sipPaymentForm.get('bank').value, 10);
    /* const fInsStrDate = this.formatDate(this.fetchDay(fInsDate), this.fetchMonth(fInsDate), this.fetchYear(fInsDate));
    const lInsStrDate = this.formatDate(this.fetchDay(lInsDate), this.fetchMonth(lInsDate), this.fetchYear(lInsDate)); */
    /* const fInsStrDate = `${fInsDate.getDate().padStart(2, '0')}-${(fInsDate.getMonth() + 1).padStart(2, '0')}-${fInsDate.getFullYear()}`;
    const lInsStrDate = `${lInsDate.getDate().padStart(2, '0')}-${lInsDate.getMonth() + 1}-${lInsDate.getFullYear()}`; */
    console.log('Date', fInsStrDate);
    console.log('Date', lInsStrDate);
    this.sipObj = {
      customerId: custId,
      productId: this.selectedSchemeCode,
      amount: amount,
      accountNumber: '',
      frequency: frequency,
      firstInstallmentDate: fInsStrDate,
      lastInstallmentDate: lInsStrDate,
      bankId: bank,
      continueTillNotify: untilCancel
    };

    const sipObjStr = {
      customerId: custId,
      productId: this.selectedSchemeCode,
      productName: this.selectedSchemeName,
      amount: amount,
      accountNumber: '',
      frequency: frequency,
      firstInstallmentDate: fInsStrDate,
      lastInstallmentDate: lInsStrDate,
      bankId: bank,
      continueTillNotify: untilCancel
    };

    const updObj = {
      custId: this.user.custId,
      jsonString: JSON.stringify(sipObjStr),
      screenName: 'sip-register'
    };
    this.fs.updateIncompTrans(updObj).subscribe((resp) => {
      console.log(resp);
      this.fs.saveSip(this.sipObj).subscribe((respo) => {
        console.log(respo);
        this.showStep3();
      });
    });
  }


  goToPay() {
    /* this.openPay(); */
    this.typedAmount = this.sipPaymentForm.get('sipAmount').value;
    const fInsStrDate = this.sipPaymentForm.get('fInsDate').value;
    const lInsStrDate = this.sipPaymentForm.get('lInsDate').value;
    this.paymentService.getTranxId().subscribe((id: String) => {
      console.log('TranxID -> ', id);
      this.transId = id;
      const strToSend = `T144702|${id}|${this.typedAmount}|1234567890|${this.user.custId}|${this.user.mobile}|${this.user.username}|${fInsStrDate}|${lInsStrDate}|100|M|MNTH|||||9278435371UWATRP`;

      console.log('strToSend -> ', strToSend);

      this.paymentService.getHashed(strToSend).subscribe((str) => {
        console.log('Token -> ', str);
        this.token = str;
        this.openPay();
      }, err => {
        console.log(err);
      });
    }, err => {
      console.log(err.error.text);
    });
  }

  openPay() {
    // alert('ok');
    const fInsStrDate = this.sipPaymentForm.get('fInsDate').value;
    const lInsStrDate = this.sipPaymentForm.get('lInsDate').value;
    const configJson = {
      'tarCall': false,
      'features': {
          'showPGResponseMsg': true,
          'enableNewWindowFlow': true,
          'enableExpressPay': true,
          'siDetailsAtMerchantEnd': true,
          'enableSI': true
      },
    'consumerData': {
          'deviceId': 'WEBSH2',
          'token': this.token,
            'returnUrl': '',
            'responseHandler': $.proxy(this.handleResponse, this),
            'paymentMode': 'all',
            'merchantLogoUrl': 'https://www.paynimo.com/CompanyDocs/company-logo-md.png',
            'merchantId': 'T144702',
            'consumerId': this.user.custId,
            'consumerMobileNo': this.user.mobile,
            'consumerEmailId': this.user.username,
            'txnId': this.transId,
            'items': [{
                'itemId': 'Test',
                'amount': this.typedAmount,
                'comAmt': '0'
            }],
          'customStyle': {
              'PRIMARY_COLOR_CODE': '#3977b7',
              'SECONDARY_COLOR_CODE': '#FFFFFF',
              'BUTTON_COLOR_CODE_1': '#1969bb',
              'BUTTON_COLOR_CODE_2': '#FFFFFF'
          },
          'accountNo': '1234567890',    // Pass this if accountNo is captured at merchant side for eMandate/eSign
          'accountType': 'Saving',	//  Available options Saving, Current and CC for Cash Credit, only for eSign
          'accountHolderName': 'Name',  // Pass this if accountHolderName is captured at merchant side for eSign only
          'aadharNo': '829801716575',   // Pass this if aadharNo is captured at merchant side for eSign only
          'ifscCode': 'ICIC0000001',        // Pass this if ifscCode is captured at merchant side for eSign only
          'debitStartDate': fInsStrDate,
          'debitEndDate': lInsStrDate,
          'maxAmount': '100',
          'amountType': 'M',
          'frequency': 'MNTH'
      }
    };
    $.pnCheckout(configJson);
    if (configJson.features.enableNewWindowFlow) {
        pnCheckoutShared.openNewWindow();
    }
  }

  fInsMonthh(e) {
    console.log(e.target.value);
    this.fInsMonthVar = e.target.value;
    if ( this.fInsMonthVar !== '' && this.fInsYearVar !== '') {
      this.entLIDate = true;
    } else {
      this.entLIDate = false;
    }
  }
  fInsYearr(e) {
    console.log(e.target.value);
    this.fInsYearVar = e.target.value;
    if ( this.fInsMonthVar !== '' && this.fInsYearVar !== '') {
      this.entLIDate = true;
    } else {
      this.entLIDate = false;
    }
  }

  lInsMonthh(e) {
    console.log(e.target.value);
    this.lInsMonthVar = e.target.value;
    /* if ( this.fInsMonthVar !== '' && this.fInsYearVar !== '') {
      this.entLIDate = true;
    } else {
      this.entLIDate = false;
    } */
  }
  lInsYearr(e) {
    console.log(e.target.value);
    this.lInsYearVar = e.target.value;
    /* if ( this.fInsMonthVar !== '' && this.fInsYearVar !== '') {
      this.entLIDate = true;
    } else {
      this.entLIDate = false;
    } */
  }

  handleResponse(res) {
    if (typeof res !== 'undefined' && typeof res.paymentMethod !== 'undefined' && typeof res.paymentMethod.paymentTransaction !== 'undefined' && typeof res.paymentMethod.paymentTransaction.statusCode !== 'undefined' && res.paymentMethod.paymentTransaction.statusCode === '0300') {
        console.log('success');
        this.responseObj = res;
        // success block
    } else if (typeof res !== 'undefined' && typeof res.paymentMethod !== 'undefined' && typeof res.paymentMethod.paymentTransaction !== 'undefined' && typeof res.paymentMethod.paymentTransaction.statusCode !== 'undefined' && res.paymentMethod.paymentTransaction.statusCode === '0398') {
        // initiated block
        console.log(JSON.stringify(res));
    } else {
        // error block
        this.responseObj = JSON.stringify(res);
        console.log('Result : ', this.responseObj);
        this.readResp(res);
    }
    console.log('Result1 : ', this.responseObj);
  }

  readResp(res: any) {
    // alert(res);
    const statusCode = res.paymentMethod.paymentTransaction.statusCode;
    if ( statusCode === '0399' ) {
      this.failure = true;
    } else {
      this.failure = false;
    }
    this.response = true;
    this.responseObj = res;
  }

  otpResponse(boole) {
    console.log(boole);
    this.otpSuccess = JSON.parse(boole);
    if (boole === 'false') {
      alert('Wrong OTP');
    }
  }

}
