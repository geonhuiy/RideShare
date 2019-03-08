import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { GetridePage } from '../getride/getride';
import { Observable } from 'rxjs';
import { Pic } from '../../interface/media';
import { ShareridePage } from '../shareride/shareride';
import { DataProvider } from '../../providers/data/data';
import { Title } from '@angular/platform-browser';
import { RidedetailsPage } from '../ridedetails/ridedetails';

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
  rideArray: Observable<Pic[]>;
  title = {
    'title': 'getRide'
  };
  name = '';

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private dataProvider: DataProvider) {
  }

  ionViewDidEnter() {
    this.getAllFiles();
  }

  getAllFiles() {
    this.rideArray = this.dataProvider.getAllRides(this.title);
  }

  getDestination(ride: string) {
    let res = ride.split('"');
    return (res[3] + ' - ' + res[7]);
  }

  getUser(Id: string) {
    this.dataProvider.getUser(Id).subscribe(res => {
      this.name = res.username;
      console.log(res.username);
    });
    return this.name;
  }

  viewRide(id: string) {
    this.navCtrl.push(RidedetailsPage, {
      Id: id,
    });
  }

  openGetRides() {
    this.navCtrl.push(GetridePage);
  }

  openShareRides() {
    this.navCtrl.push(ShareridePage);
  }
}
