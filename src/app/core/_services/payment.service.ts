import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@env/environment';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class PaymentService {

    private baseUrl: String = environment.baseUrl;

    response: any;

  constructor(private http: HttpClient) { }

  getTranxId(): Observable<String> {
      return this.http.get(this.baseUrl + 'transaction/id', {responseType: 'text'});
  }

  getHashed(delimited: String) {
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type', 'text/plain');
      return this.http.post(this.baseUrl + 'hash/sha512', delimited, {headers, responseType: 'text'});
  }

  /* openPay() {
    // alert('ok');
    const configJson = {
      'tarCall': false,
      'features': {
          'showPGResponseMsg': true,
          'enableNewWindowFlow': true
      },
     'consumerData': {
          'deviceId': 'WEBSH2',
          'token': 'cd16486053bcc72e69060d468d6598de3cdb2e25ba5b030634b79caec20404db755599b9bd9cc567e5ce7e044f44c64d3ae3dcd6049973d705991452d7a5c0af',
          'returnUrl': '',
          'responseHandler': this.handleResponse,
          'paymentMode': 'all',
          'merchantLogoUrl': 'https://www.paynimo.com/CompanyDocs/company-logo-md.png',
          'merchantId': 'T144702',
          'consumerId': 'c964634',
          'consumerMobileNo': '9791033743',
          'consumerEmailId': 'thomas.elavarasu@gmail.com',
          'txnId': '1481197581115',
          'items': [{
              'itemId': 'Test',
              'amount': '10',
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
        this.response = res;
        // success block
    } else if (typeof res !== 'undefined' && typeof res.paymentMethod !== 'undefined' && typeof res.paymentMethod.paymentTransaction !== 'undefined' && typeof res.paymentMethod.paymentTransaction.statusCode !== 'undefined' && res.paymentMethod.paymentTransaction.statusCode === '0398') {
        // initiated block
        console.log(JSON.stringify(res));
        this.response = res;
    } else {
        // error block
        console.log('no - ', JSON.stringify(res));
        this.response = res;
    }
    // alert(res);
  } */

}
