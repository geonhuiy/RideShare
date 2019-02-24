import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { LoginResponse, RegisteredResponse, User } from '../../interface/user';
import { MyApp } from '../../app/app.component';

/**
 * Generated class for the LoginRegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-login-register',
  templateUrl: 'login-register.html',
})
export class LoginRegisterPage {
  userData: User = { username: null };
  registerData: User = { username: null };
  hasAccount = true;

  constructor(
    public navCtrl: NavController, public navParams: NavParams,
    private dataProvider: DataProvider) {
  }

  login() {
    this.dataProvider.login(this.userData).subscribe(
      (response: LoginResponse) => {
        console.log(response);
        localStorage.setItem('token', response.token);
        localStorage.setItem('userId', response.user.user_id.toString());
        this.dataProvider.loggedIn = true;
        this.navCtrl.parent.select(0);
      },
      error => {
        console.log(error);
      },
    );
  }

  register() {
    this.dataProvider.register(this.registerData).subscribe(
      (response: RegisteredResponse) => {
        console.log(response);
        this.userData.username = this.registerData.username;
        this.userData.password = this.registerData.password;
        this.dataProvider.login(this.userData);
        this.dataProvider.loggedIn = true;
        this.navCtrl.parent.select(0);
      },
    );
  }
}
