import { Observable } from 'rxjs';
import { Pic } from '../../interface/media';
import { ShareridePage } from '../shareride/shareride';
import { RidedetailsPage } from '../ridedetails/ridedetails';
import { Component, ViewChild } from '@angular/core';
import { AlertController, NavController, NavParams, Refresher } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import {
  LoginResponse,
  RegisteredResponse,
  User,
  UsernameStatus,
} from '../../interface/user';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  rideArray: Observable<Pic[]>;
  emptyArray: Observable<Pic[]>;
  ownRides = [];
  comments: any[];
  rides: Pic[];
  title = {
    'title': 'getRide'
  };
  name = '';
  welcome = '';
  userData: User = { username: null };
  registerData: User = { username: null };
  hasAccount = true;
  today = new Date();

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

  ionViewDidEnter() {
    if (!this.loggedIn()) {
      this.dataProvider.onSlides = true;
    } else {
      this.dataProvider.onSlides = false;
      this.getUser();
      this.getAllFiles();
    }
  }

  getAllFiles() {
    let i = 0;
    if (this.loggedIn()) {
      this.rideArray = this.dataProvider.getAllRides(this.title);
      this.dataProvider.getComments().subscribe(res => {
        while (res[i]) {
          if(!this.ownRides.includes(res[i].file_id)){
          this.ownRides[i] = res[i].file_id;
        }
          console.log(this.ownRides);
          i++;
        }
      });
    } else {
      this.rideArray = this.emptyArray;
    }
  }

  isYourRide(item: Pic) {
    let date = new Date(this.today.getFullYear()+'-'+(this.today.getMonth()+1)+'-'+this.today.getDate());
    let date1 = new Date(JSON.parse(item.description).timeDate);
    if(date1 > date){
      return this.ownRides.includes(item.file_id);
    }
  }

  isExpiredRide(item: Pic) {
    let date = new Date(this.today.getFullYear()+'-'+(this.today.getMonth()+1)+'-'+this.today.getDate());
    let date1 = new Date(JSON.parse(item.description).timeDate);
    return (date1 < date);
  }

  getUser() {
    if (this.loggedIn()) {
      this.dataProvider.getUser(localStorage.getItem('userId')).subscribe(
        res => {
          this.welcome = 'Welcome to RideShare ' + res.username + '!';
        });
    } else {
      this.welcome = 'Welcome to RideShare!';
    }
  }

  loggedIn() {
    return (localStorage.getItem('token') != null && localStorage.getItem('userId') != null);
  }

  getDestination(ride: string) {
    return (JSON.parse(ride).start + ' - ' + JSON.parse(ride).destination);
  }

  getDate(ride: string) {
    return (JSON.parse(ride).timeDate);
  }

  getTime(ride: string) {
    return (JSON.parse(ride).timeAdded + ' - ' + JSON.parse(ride).timeReached);
  }

  /*
  getUser(Id: string) {
    this.dataProvider.getUser(Id).subscribe(res => {
      this.name = res.username;
      console.log(res.username);
    });
    return this.name;
  }
  */

  viewRide(id: string) {
    this.navCtrl.push(RidedetailsPage, {
      Id: id,
    });
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
        this.ionViewDidEnter();
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
      buttons: [ 'OK' ],
    });
    alert.present();
  }
}
