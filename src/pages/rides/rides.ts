import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { GetridePage } from '../getride/getride';
import { ShareridePage } from '../shareride/shareride';

/**
 * Generated class for the RidesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-rides',
  templateUrl: 'rides.html',
})
export class RidesPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  openGetRides() {
    this.navCtrl.push(GetridePage);
  }

  openShareRides() {
    this.navCtrl.push(ShareridePage);
  }
}
