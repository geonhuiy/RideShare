import { Component } from '@angular/core';
import { AlertController, NavController, NavParams, Refresher } from 'ionic-angular';
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
  commented: boolean;
  takenSeats: Observable<Comment[]>;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private dataProvider: DataProvider,
              private alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    this.getDetails();
    this.getTakenSeats();
    this.comment.file_id = this.Id;
    this.checkComments();
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
    if(!this.commented){
      console.log("no comments were found");
      this.dataProvider.getSeat(this.comment).subscribe(res => {
        console.log(res);
        this.ionViewDidLoad();
      });
    }else{
      this.presentAlert('You already have taken a spot!');
    }
  }

  checkComments(){
    console.log("checking for comments");
    this.dataProvider.getTakenSeats(this.Id).subscribe(data => {
      console.log("subscribe");
      if(data){
        console.log("found data");
        data.forEach(element => {
          console.log(element.user_id + " - " + localStorage.getItem("userId"));
          if(element.user_id == localStorage.getItem("userId")) {
            console.log("true");
            this.commented = true;
          }else{
            console.log("false");
          };
        });
      };
    });
  }

  presentAlert(message: string) {
    const alert = this.alertCtrl.create({
      title: message,
      buttons: [ 'OK' ],
    });
    alert.present();
  }
}
