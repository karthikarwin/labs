import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';

@Injectable()
export class CasService {

  private baseUrl: String = environment.baseUrl;

  constructor(private http: HttpClient) { }


  pdfImport(pdfData) {
    // console.log(pdfData);
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'multipart/form-data');
    const user = JSON.parse(sessionStorage.getItem('currentUser'));
    const token1 = sessionStorage.getItem('Token');
    /* headers.set('Authorization', token1);
    console.log('token', token1); */
    return this.http.post(this.baseUrl + 'import/' + user.custId, pdfData, {headers});
  }


  getStatements() {
    const user = JSON.parse(sessionStorage.getItem('currentUser'));
    const pdf = JSON.parse(sessionStorage.getItem('pdfData'));
    return this.http.get(this.baseUrl + 'account-statement/' + pdf.documentId);
  }

  agreeCasApi(agreed) {
    const user = JSON.parse(sessionStorage.getItem('currentUser'));
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'application/json');
    headers.set('Origin', '*');
    return this.http.post(this.baseUrl + 'acknowledge-statement/' + user.custId + '/' + agreed, {});
  }


  getStatementHeaders() {
    const user = JSON.parse(sessionStorage.getItem('currentUser'));
    return this.http.get(this.baseUrl + 'statement-header/' + user.custId);
  }

}
