import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../_models/user';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { environment } from '@env/environment';
import { Router } from '@angular/router';

@Injectable()
export class AuthService {
  @Output() getLoggedInName: EventEmitter<Boolean> = new EventEmitter();

  private baseUrl: String = environment.baseUrl;
  private ipToken: String = '093e0d540afe1d1e16e80931173b74c7faa5b298c2e481a4be0d66f58b732a68';

  username: any;
  public token: any;

  constructor(private http: HttpClient, private router: Router) {
    if (sessionStorage.getItem('Token')) {
      this.token = sessionStorage.getItem('Token');
      /* this.loggedIn.next(true); */
    }
    this.getAuthState();
  }

  /* isLoggedIn(): Observable<Boolean> {
    return this.loggedIn.asObservable();
  } */

  // getting AuthState of the user
  getAuthState(): Boolean {
    if (sessionStorage.getItem('Token') && sessionStorage.getItem('currentUser')) {
      this.getLoggedInName.emit(true);
      return true;
    } else {
      return false;
    }
  }

  getUserFromSession(): User {
    if (sessionStorage.getItem('currentUser')) {
      const user = JSON.parse(sessionStorage.getItem('currentUser'));
      return user;
    } else {
      this.getUser().subscribe((user: any) => {
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        return user;
      }, err => {
        console.log(err);
        return null;
      });
    }
    return null;
  }

  isRegistrationCompleted() {
    if (sessionStorage.getItem('currentUser')) {
      const user = JSON.parse(sessionStorage.getItem('currentUser'));
      if (user.registrationCompleted) {
        return true;
      } else {
        return false;
      }
    } else {
      this.getUser().subscribe((user: any) => {
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        this.isRegistrationCompleted();
      }, err => {
        console.log(err);
        return false;
      });
    }
  }

  getClientLocation() {
    const headers = new HttpHeaders();
    headers.set('Access-Control-Allow-Headers', ['Access-Control-Allow-Origin', 'X-Requested-With']);
    headers.set('Access-Control-Allow-Origin', '*');
    /* return this.http.get('https://json.geoiplookup.io/apis', {headers}); */
    return this.http.get('https://api.ipinfodb.com/v3/ip-city/?key=' + this.ipToken + '&format=json');
  }

  getToken(): string {
    if (sessionStorage.getItem('Token')) {
      this.token = sessionStorage.getItem('Token');
      return this.token;
    }
    return null;
  }

  signUp(signUpForm) {
    const userDetails = {
      'name': signUpForm.name,
      'username': signUpForm.email,
      'password': signUpForm.passwords.password,
      'mobile': signUpForm.mobile
    };
    // console.log(userDetails);
    return this.http.post(this.baseUrl + 'sign-up', userDetails);
  }

  // For Login http call
  loginDetails(loginFrm: any) {
    const formData = {
      'username': loginFrm.email,
      'password': loginFrm.password
    };
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post(this.baseUrl + 'sign-in', formData, { observe: 'response' });
  }

  saveCustLocation(ipInfo) {
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'application/json; charset=utf-8');
    headers.set('Access-Control-Allow-origin', '*');
    headers.set('Authorization', this.token);
    return this.http.post(this.baseUrl + 'update-customer-location', ipInfo, {headers: headers});
  }

  // Save mobile number
  saveMobileNo(mobileObj) {
    return this.http.post(this.baseUrl + 'update-mobile', mobileObj);
  }

  resetPass(resetForm) {
    const formData = {
      'name': '',
      'username': resetForm.forgetEmail
    };
    return this.http.post(this.baseUrl + 'forget-password', formData);
  }

  getUser(): Observable<User> {
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'application/json; charset=utf-8');
    headers.set('Authorization', this.getToken());
    return this.http.get<User>(this.baseUrl + 'user');
  }

  sendResetData(formData) {
    return this.http.post(this.baseUrl + 'reset-password', formData);
  }

  logOutSub() {
    sessionStorage.clear();
  }

  logOut(formData) {
    const formData1 = {
      'userName': formData.email
    };
    console.log('2', formData1);
    return this.http.post(this.baseUrl + 'sign-out', formData1);
  }

  signOut() {
    this.getLoggedInName.emit(false);
    return this.http.post(this.baseUrl + 'logout', {});
  }

}
