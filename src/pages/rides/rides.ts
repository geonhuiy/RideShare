import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs';
import { Pic } from '../../interface/media';
import { ShareridePage } from '../shareride/shareride';
import { DataProvider } from '../../providers/data/data';
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
  rides: Pic[];
  title = {
    'title': 'getRide'
  };
  name = '';
  search = '';

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

  getSearchFiles(search: string, item: Pic) {
    let res = item.description.toLowerCase().split('"');
    let data = (res[3] + res[7]);
    return data.includes(search.toLowerCase());
  }

  checkSearch(search: string) {
    return search;
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

  openShareRides() {
    this.navCtrl.push(ShareridePage);
  }
}
