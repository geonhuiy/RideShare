import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs';
import { Pic } from '../../interface/media';
import { ShareridePage } from '../shareride/shareride';
import { DataProvider } from '../../providers/data/data';
import { RidedetailsPage } from '../ridedetails/ridedetails';
import {
  BaseArrayClass,
  Geocoder,
  GeocoderResult,
} from '@ionic-native/google-maps';
import { RideDetails } from '../../interface/ride';

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
  emptyArray: Observable<Pic[]>;
  title = {
    'title': 'getRide',
  };
  isSearching = false;
  name = '';
  search = '';
  today = new Date();
  rideDetail: RideDetails = {
    start: null,
    destination: null,
    timeDate: null,
    timeAdded: null,
    timeReached: null,
    rideDescription: null,
  };
  test = '';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private dataProvider: DataProvider,
  ) {
  }

  ionViewDidEnter() {
    this.getAllFiles();
  }

  getAllFiles() {
    if (localStorage.getItem('token') != null) {
      this.rideArray = this.dataProvider.getAllRides(this.title);
    } else {
      this.rideArray = this.emptyArray;
    }
  }

  getSearchFiles(search: string, item: Pic) {
    let res = item.description;
    let date = new Date(
      this.today.getFullYear() + '-' + (this.today.getMonth() + 1) + '-' +
      this.today.getDate());
    let date1 = new Date(JSON.parse(res).timeDate);
    if (date1 > date) {
      let data = (JSON.parse(res).start +
        JSON.parse(res).destination).toLowerCase();
      return data.includes(search.toLowerCase());
    }
  }

  checkSearch(search: string) {
    return search;
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

  viewRide(id: string) {
    this.navCtrl.push(RidedetailsPage, {
      Id: id,
    });
  }

  openShareRides() {
    this.navCtrl.push(ShareridePage);
  }
}
