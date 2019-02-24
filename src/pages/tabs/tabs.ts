import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { ProfilePage } from '../profile/profile';
import { RidesPage } from '../rides/rides';
import { LoginRegisterPage } from '../login-register/login-register';
import { DataProvider } from '../../providers/data/data';

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {
  Home = HomePage;
  Profile = ProfilePage;
  Rides = RidesPage;
  LoginRegister = LoginRegisterPage;

  token = localStorage.getItem('token');

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public dataProvider: DataProvider) {
  }

  ionViewDidLoad() {
    if (this.token !== 'undefined' && this.token !== null) {
      console.log('There is a token');
      this.dataProvider.loggedIn = true;
    } else {
      console.log('There is no token');
      this.dataProvider.loggedIn = false;
    }
  }

}
