import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { Pic, SearchParam } from '../../interface/media';
import { Observable } from 'rxjs';
import { selectValueAccessor } from '@angular/forms/src/directives/shared';

/**
 * Generated class for the ShareridePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-shareride',
  templateUrl: 'shareride.html',
})
export class ShareridePage {

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private dataProvider: DataProvider) {
  }

  ridesArray: Observable<Pic[]>;
  ride = {
    start: '',
    destination: ''
  };

  ionViewDidEnter() {

  }

  findPassengers() {
    this.findByTag(JSON.stringify(this.ride));
  }

  getAllRides(searchParam: SearchParam) {
    this.ridesArray = this.dataProvider.getRides(searchParam);
    this.dataProvider.getRides(searchParam).subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.log(error);
      });
  }

  findByTag(tag: string) {
    this.ridesArray = this.dataProvider.findByTag(tag);
    this.dataProvider.findByTag(JSON.stringify(this.ride)).subscribe(
      res => {
        console.log(res);
      }
    );
  }

}
