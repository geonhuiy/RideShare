import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DataProvider } from "../../providers/data/data";
import { Observable } from "rxjs";
import { Pic } from "../../interface/media";

/**
 * Generated class for the RidedetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-ridedetails',
  templateUrl: 'ridedetails.html',
})
export class RidedetailsPage {

  comment = {
    'file_id': 'getRide',
    'comment': 'dibs'
  };
  Id: string;
  url = 'http://media.mw.metropolia.fi/wbma/uploads/'
  item: Pic;
  uploader: string;
  destination: string;
  test: any;
  takenSeats: Observable<Comment[]>;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private dataProvider: DataProvider) {
  }

  ionViewDidLoad() {
    this.getDetails();
    this.getTakenSeats();
  }

  getDetails(){
    this.Id = this.navParams.get('Id');
    this.dataProvider.getSingleMedia(this.Id).subscribe(data => {
      this.item = data;
      this.getDestination(data.description);
      this.dataProvider.getUser(data.user_id).subscribe(user => {
        this.uploader = user.username;
      })
    });
  }

  getDestination(ride:string) {
    let res = ride.split('"');
    this.destination = (res[3] + " - " + res[7]);
  }

  getTakenSeats(){
    this.takenSeats = this.dataProvider.getTakenSeats(this.Id)
  }

  getSeat(){
    this.comment.file_id = this.Id;
    this.dataProvider.getSeat(this.comment).subscribe(res => {
      console.log(res);
    });
  }
}
