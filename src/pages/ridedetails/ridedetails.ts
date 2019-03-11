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
  rideDescription: string;
  time: string;
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

  getDestination(ride: string) {
    this.destination = (JSON.parse(ride).start + ' - ' + JSON.parse(ride).destination);
    this.time = (JSON.parse(ride).timeAdded + ' - ' + JSON.parse(ride).timeReached);
    this.rideDescription = JSON.parse(ride).rideDescription;
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

  cancelSeat(commentId:any){
    if(this.commented){
      console.log("comments were found");
      this.dataProvider.cancelSeat(commentId).subscribe(res => {
        console.log(res);
        this.ionViewDidLoad();
      });
    }else{
      this.presentAlert('You have nothing to cancel!');
    }
  }

  checkComments(){
    this.commented = false;
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

  myComment(id:any){
    return id == localStorage.getItem("userId");
  }

  presentAlert(message: string) {
    const alert = this.alertCtrl.create({
      title: message,
      buttons: [ 'OK' ],
    });
    alert.present();
  }
}
