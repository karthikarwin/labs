import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { AuthService } from './_services/auth.service';
import { Observable } from 'rxjs/Observable';
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(public auth: AuthService) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    /* console.log('Here', request); */
    // tslint:disable-next-line:max-line-length
    if (request.url !== 'https://api.ipinfodb.com/v3/ip-city/?key=093e0d540afe1d1e16e80931173b74c7faa5b298c2e481a4be0d66f58b732a68&format=json') {
      if (this.auth.getToken() !== null) {
        request = request.clone({
          setHeaders: {
            'Authorization': `${this.auth.getToken()}`,
            'Access-Control-Allow-origin': 'http://localhost:4200'
          }
        });
        return next.handle(request);
      } else {
        request = request.clone({
          setHeaders: {
            'Access-Control-Allow-origin': '*'
          }
        });
        return next.handle(request);
      }
    } else {
      return next.handle(request);
    }
  }
}

/* 'Access-Control-Allow-Headers': 'Authorization',
'Authorization': `${this.auth.getToken()}`,
'Content-Type': 'application/json; charset=utf-8',
'Access-Control-Allow-origin': 'http://localhost:4200' */
