import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FundService } from '@app/core';
import { AuthService } from '@app/core';
import { PaymentService } from '@app/core';
import { Scheme } from '../../core/_models/scheme';
import { User } from '../../core/_models/user';
/* import { debounceTime } from 'rxjs/operator/debounceTime';
import { Subject } from 'rxjs/Subject'; */
declare var $;
declare var pnCheckoutShared;
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-new-inv-form',
  templateUrl: './new-inv-form.component.html',
  styleUrls: ['./new-inv-form.component.css']
})
export class NewInvFormComponent implements OnInit {
  
  firstStepActive: Boolean = true;
  secondStepActive: Boolean;
  thirdStepActive: Boolean;
  firstStepCompleted: Boolean;
  secondStepCompleted: Boolean;
  thirdStepCompleted: Boolean;
  transId: String;
  token: String;
  failure: Boolean;
  @ViewChild('para', {read: ElementRef}) paraP: ElementRef;


  lumpsum: any;
  user: User;
  isSipAllowed: Boolean = false;
  error: string;
  response: Boolean;
  responseObj: any;
  step1: Boolean = true;
  step2: Boolean = false;
  step3: Boolean = false;
  selectedScheme: Scheme;
  amount: any;
  typedAmount: any = 10;
  selectedSchemeCode: String;
  selectedSchemeName: String;
  schemes: Array<Scheme>;
  schemesResp: Boolean = false;
  typingTimer: any;
  typingInterval: any = 500;
  otpSuccess: Boolean = false;

  selected: string;
  states: Array<any>;
  minAmount: any;
  minAmountOK: boolean;

  asyncSelected: string;
  typeaheadLoading: boolean;
  typeaheadNoResults: boolean;
  dataSource: Observable<any>;
  noScheme: Boolean = false;

  proceedOtp: Boolean = false;
  

  /* $save: Subject<void> = new Subject<void>(); */

  constructor(
    private fs: FundService,
    private auth: AuthService,
    private paymentService: PaymentService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {
    this.user = this.auth.getUserFromSession();

    this.dataSource = Observable.create((observer: any) => {
      // Runs on every search
      this.fs.getSchemes(this.asyncSelected)
        .subscribe( (schemes: Array<any>) => {
          if (schemes.length > 0) {
            this.noScheme = false;
            observer.next(schemes);
          } else {
            observer.next(schemes);
            this.toastr.error('This Scheme is not in approved list, Please search a different Scheme');
            /* this.asyncSelected = ''; */
            this.noScheme = true;
          }
        });
    });
  }

  ngOnInit() {
    
    this.spinner.show();
    /* this.getSchemes(); */

    this.fs.getIncompleteTrans(this.user.custId, 'lumpsum').subscribe((resp: any) => {
      console.log(resp);
      if (resp !== '' || resp !== null) {
        let showOld = confirm('Do you want to continue with Previous transaction?');
        this.spinner.hide();
        if (showOld) {
          this.lumpsum = JSON.parse(resp);
          console.log(this.lumpsum.productId);
          /* this.selectedScheme(this.lumpsum.productId); */
          this.selectedSchemePrev(this.lumpsum.productId);
          /* this.selectedSchemeCode = this.lumpsum.productId; */
          this.typedAmount = this.lumpsum.amount;
          /* this.selectedSchemeName = this.lumpsum.schemeName; */
          this.showStep3();
        }
      } else {
        this.lumpsum = {};
      }
    }, err => {
      this.lumpsum = {};
    });
  }

  changeTypeaheadLoading(e: boolean): void {
    this.typeaheadLoading = e;
  }

  typeaheadOnSelect(e: TypeaheadMatch): void {
    console.log('Selected value: ', e.item.code);
    this.selectScheme(e.item);
  }

  showStep1() {
    this.step1 = true;
    this.step2 = false;
    this.step3 = false;
    this.otpSuccess = false;
    this.amount = 0;
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
  showResponse() {
    this.thirdStepCompleted = true;
    this.response = true;
  }

  getSchemes(e) {
    const query = e.target.value;
    /* const query = 'HDFC'; */
    /* console.log(query.length);
    console.log(e.target.value); */
    const that = this;
    clearTimeout(this.typingTimer);
    if (query.length > 3) {
      this.typingTimer = setTimeout(() => {
        this.fs.getSchemes(query).subscribe( (schemes: Array<Scheme>) => {
          console.log(schemes);
          this.schemes = schemes;
          this.schemesResp = true;
          this.schemes = this.schemes.slice(0, 30);
        });
      }, this.typingInterval);

      /* this.$save.next(query); */
    }
  }

  selectScheme(code) {
    console.log(code);
    this.selectedSchemeCode = code.code;
    this.selectedSchemeName = code.name;

    this.fs.getSchemeDetails(this.selectedSchemeCode).subscribe((details: Scheme) => {
      /* console.log(details); */
      this.selectedScheme = details;
      this.minAmount = details.minInvestment;
      this.schemesResp = false;
      this.showStep2();
      this.asyncSelected = '';
      const leng = details.transferInvestDetails.length;
      for (let i = 0; i < leng; i++) {
        if (details.transferInvestDetails[i].loadType === 'SIP') {
          console.log(details.transferInvestDetails[i].loadType);
          this.isSipAllowed = true;
        }
      }

      /* if ((this.selectedScheme.transferInvestDetails.length > 0) && (this.selectedScheme.transferInvestDetails[0].loadType !== 'SIP')) {
        this.isSipAllowed = false;
      } else {
        this.isSipAllowed = true;
      } */
      console.log(this.selectedScheme);
    });
  }

  selectedSchemePrev(code: any) {
    console.log(code);
    /* this.selectedSchemeCode = code.productId;
    this.selectedSchemeName = code.schemeName; */

    this.fs.getSchemeDetails(code).subscribe((details: Scheme) => {
      /* console.log(details); */
      this.selectedScheme = details;
      this.minAmount = details.minInvestment;
      this.schemesResp = false;
      console.log(this.selectedScheme);
      this.selectedSchemeCode = this.selectedScheme.code;
      this.selectedSchemeName = this.selectedScheme.name;
    });
  }
  /* saveAmount() {
    console.log(this.typedAmount);
  } */

  saveLumpsum() {
    this.spinner.show();
    this.typedAmount = this.amount;
    if (this.amount < 500) {
      this.error = 'Amount should be minimum of 500 INR and should not exceed 100000 INR';
    } else {
      /* const custId = this.auth.getUserFromSession().custId; */
      this.lumpsum = {
        'productId': this.selectedSchemeCode,
        'amount': this.typedAmount,
        'schemeName': this.selectedSchemeName
      };
      console.log('lumpSumObj', this.lumpsum);
      const updObj = {
        custId: this.user.custId,
        screenName: 'lumpsum',
        jsonString: JSON.stringify(this.lumpsum)
      };
      this.fs.updateIncompTrans(updObj).subscribe((resp) => {
        console.log(resp);
        /* this.fs.saveLumpsum(lumsumObj).subscribe((data) => {
            console.log(data);
            this.showStep3();
          }); */
          this.proceedOtp = true;
          this.spinner.hide();
      }, err => {
        this.spinner.hide();
        this.toastr.error(err.message);
      });
    }
  }

  checkMin() {
    if (this.amount < this.minAmount) {
      alert('Minimum Amount should be ' + this.minAmount);
      this.minAmountOK = false;
    } else {
      this.minAmountOK = true;
    }
  }

  goToPay() {
    /* this.openPay(); */
    this.paymentService.getTranxId().subscribe((id: String) => {
      console.log('TranxID -> ', id);
      this.transId = id;
      const strToSend = `T144702|${id}|${this.typedAmount}||${this.user.custId}|${this.user.mobile}|${this.user.username}||||||||||9278435371UWATRP`;

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
      /* console.log('Here1 ->', this.token);
      console.log('Here2 ->', this.transId); */
      const configJson = {
        'tarCall': false,
        'features': {
            'showPGResponseMsg': true,
            'enableNewWindowFlow': true
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
            }
        }
      };
      $.pnCheckout(configJson);
      if (configJson.features.enableNewWindowFlow) {
          pnCheckoutShared.openNewWindow();
      }
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
    let statusCode = res.paymentMethod.paymentTransaction.statusCode;
    if ( statusCode === '0399' ) {
      this.failure = true;
    } else {
      this.failure = false;
    }
    this.response = true;
    this.responseObj = res;
  }

  otpResponse(boole) {
    this.spinner.show();
    console.log(boole);
    this.otpSuccess = JSON.parse(boole);
    if (this.otpSuccess) {
      this.showStep3();
      this.spinner.hide();
    } else {
      alert('Wrong OTP');
    }
  }

}
