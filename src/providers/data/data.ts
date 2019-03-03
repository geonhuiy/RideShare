import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  LoginResponse,
  RegisteredResponse, Update,
  User,
  UsernameStatus,
} from '../../interface/user';

/*
  Generated class for the DataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DataProvider {
  mediaURL = 'http://media.mw.metropolia.fi/wbma/';
  loggedIn = false;

  constructor(public http: HttpClient) {
    // Do something
  }

  login(user: User) {
    return this.http.post<LoginResponse>(this.mediaURL + 'login', user);
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

  getUserProfile() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        'x-access-token': localStorage.getItem('token'),
      }),
    };
    return this.http.get<User>(this.mediaURL + 'users/user', httpOptions);
  }

  getProfilePic() {
    return this.http.get(this.mediaURL + 'tags/profile');
  }

  getUserName(username: string) {
    return this.http.get<UsernameStatus>(
      this.mediaURL + 'users/username/' + username);
  }

  updateUserData(updateData: Update) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        'x-access-token': localStorage.getItem('token'),
      }),
    };
    return this.http.put(this.mediaURL + 'users', updateData, httpOptions);
  }
}
