import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';

@Injectable()
export class AccountService {

  private baseUrl: String = environment.baseUrl;

  constructor(
    private http: HttpClient
  ) { }


  getAccType() {
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'application/json');
    return this.http.get( this.baseUrl + 'account-type', {headers});
  }

  submitCustomerDetails(bankDetails) {
    // console.log('Bank', bankDetails);
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'application/json');
    headers.set('Origin', '*');
    return this.http.post(this.baseUrl + 'customer-bank', bankDetails);
  }

  getBank(bankCode) {
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'application/json');
    headers.set('Access-Control-Allow-origin', '*');
    const bankCode1 = { 'micr' : bankCode };
    return this.http.get( this.baseUrl + 'redis-cache/bank/micr/' + bankCode, { headers });
  }
  getBankIfsc(bankCode) {
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'application/json');
    headers.set('Access-Control-Allow-origin', '*');
    return this.http.get( this.baseUrl + 'redis-cache/banks/' + bankCode, { headers });
  }

}
