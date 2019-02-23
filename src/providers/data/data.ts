import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginResponse, RegisteredResponse, User } from '../../interface/user';

/*
  Generated class for the DataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DataProvider {
  mediaURL = 'http://media.mw.metropolia.fi/wbma/';

  constructor(public http: HttpClient) {
    // Do something
  }

  login(user: User) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
      }),
    };
    return this.http.post<LoginResponse>(this.mediaURL + 'login', user,
      httpOptions);
  }

  register(user: User) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
      }),
    };
    return this.http.post<RegisteredResponse>(this.mediaURL + 'users', user,
      httpOptions);
  }
}
