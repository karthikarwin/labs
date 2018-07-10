import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@env/environment';

@Injectable()
export class FundService {

  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  // To get Schemes while searching by scheme name
  getSchemes(schemeName) {
    return this.http.get(this.baseUrl + 'redis-cache/scheme/by-name/' + schemeName);
  }

  // To get scheme details after selected the scheme
  getSchemeDetails(schemeCode) {
    return this.http.get(this.baseUrl + 'scheme/by-code/' + schemeCode);
  }

  // To save redemption 
  saveRedemption(redeemObj) {
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post(this.baseUrl + 'redeem', redeemObj, {headers});
  }

  // To save switch transaction
  saveSwitch(switchObj) {
    return this.http.post(this.baseUrl + 'switch-scheme', switchObj);
  }

  // To save lumpsum transaction of the user
  saveLumpsum(lObj) {
    return this.http.post(this.baseUrl + 'lumpsum-transaction', lObj);
  }

  // To save SIP transaction of the user
  saveSip(sipObject) {
    return this.http.post(this.baseUrl + 'register-sip', sipObject);
  }

  // To save STP transactions of the users
  saveStp(stpObj) {
    return this.http.post(this.baseUrl + 'register-stp', stpObj);
  }

  // To save SWP transactions of the users
  saveSwp(swpObj) {
    return this.http.post(this.baseUrl + 'register-swp', swpObj);
  }

  // To get User specific Schemes
  getUserSchemes(id) {
    return this.http.get(this.baseUrl + 'client-schemes/' + id);
  }

  // Update incomplete transactions
  updateIncompTrans(objData) {
    console.log(objData);
    return this.http.post(this.baseUrl + 'update-incomplete-transaction', objData);
  }

  // Get incomplete transactions
  getIncompleteTrans(id, screenn) {
    return this.http.get(this.baseUrl + 'get-incomplete-transaction/' + id + '/' + screenn);
  }

}
