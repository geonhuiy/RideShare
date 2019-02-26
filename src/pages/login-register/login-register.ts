import { Component, ViewChild } from '@angular/core';
import { AlertController, NavController, NavParams } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import {
  LoginResponse,
  RegisteredResponse,
  User,
  UsernameStatus,
} from '../../interface/user';

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
  private passwordCheck: string;
  private usernameCheck = true;
  private passwordMatch = true;
  private registering = true;
  @ViewChild('loginForm') loginForm;
  @ViewChild('registerForm') registerForm;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private dataProvider: DataProvider,
    private alertCtrl: AlertController,
  ) {
  }

  login() {
    this.dataProvider.login(this.userData).subscribe(
      (response: LoginResponse) => {
        console.log(response);
        localStorage.setItem('token', response.token);
        localStorage.setItem('userId', response.user.user_id.toString());
        this.dataProvider.loggedIn = true;
        this.navCtrl.parent.select(0);
        if (this.hasAccount) {
          this.loginForm.reset();
        } else {
          this.registerForm.reset();
        }
      },
      error => {
        console.log(error);
      },
    );
  }

  register() {
    if (this.usernameCheck && this.passwordMatch) {
      this.dataProvider.register(this.registerData).subscribe(
        (response: RegisteredResponse) => {
          console.log(response);
          this.registering = true;
          this.userData.username = this.registerData.username;
          this.userData.password = this.registerData.password;
          this.login();
        },
        (error) => {
          console.log(error);
        },
      );
    } else {
      this.presentAlert('Please fix errors in the form');
    }

  }

  checkUsername() {
    this.dataProvider.getUserName(this.registerData.username).subscribe(
      (response: UsernameStatus) => {
        console.log(response);
        console.log(this.registerForm);
        if (response.available) {
          this.usernameCheck = true;
        } else {
          this.registerForm.form.controls['newUsername'].setErrors(
            { 'incorrect': true });
          this.usernameCheck = false;
        }
      },
      error => {
        console.log(error);
      });
  }

  checkPassword() {
    this.passwordMatch = this.registerData.password === this.passwordCheck;
  }

  presentAlert(message: string) {
    const alert = this.alertCtrl.create({
      title: message,
      buttons: ['OK'],
    });
    alert.present();
  }
}
