import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  LoginResponse,
  RegisteredResponse, Update,
  User,
  UsernameStatus,
} from '../../interface/user';
import { Pic, SearchParam, TagParam, UploadResponse } from '../../interface/media';

/*
  Generated class for the DataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DataProvider {
  mediaURL = 'http://media.mw.metropolia.fi/wbma/';
  loggedIn = false;
  token = {
    headers: new HttpHeaders({
      'x-access-token': localStorage.getItem('token')
    })
  };

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

  getUser(Id: string){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        'x-access-token': localStorage.getItem('token'),
      }),
    };
    return this.http.get<User>(this.mediaURL + 'users/' + Id, httpOptions);
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

  uploadMedia(data: any) {
    return this.http.post<UploadResponse>(this.mediaURL + 'media', data, this.token);
  }

  getRides(searchParam: SearchParam) {
    const httpOptions = {
      headers: new HttpHeaders({
        'x-access-token': localStorage.getItem('token'),
      }),
    };
    return this.http.post<Pic[]>(this.mediaURL + 'media/search', searchParam, httpOptions);
  }

  getAllRides(title: any) {
    console.log("getting all rides!")
    const httpOptions = {
      headers: new HttpHeaders({
        'x-access-token': localStorage.getItem('token'),
      }),
    };
    return this.http.post<Pic[]>(this.mediaURL + 'media/search', title, httpOptions);
  }

  addTag(tag: TagParam) {
    const httpOptions = {
      headers: new HttpHeaders({
        'x-access-token': localStorage.getItem('token'),
      }),
    };
    return this.http.post<any>(this.mediaURL + 'tags', tag, httpOptions);
  }

  findByTag(tag: string) {
    return this.http.get<Pic[]>(this.mediaURL + 'tags/' + tag);
  }

  getSingleMedia(id: any) {
    return this.http.get<Pic>(this.mediaURL + 'media/' + id);
  }
}
