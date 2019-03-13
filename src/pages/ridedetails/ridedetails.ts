import { Component } from '@angular/core';
import {
  AlertController,
  NavController,
  NavParams,
  Refresher,
} from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { Observable } from 'rxjs';
import { Pic } from '../../interface/media';

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
    'comment': 'dibs',
  };
  Id: string;
  url = 'http://media.mw.metropolia.fi/wbma/uploads/';
  item: Pic;
  uploader: string;
  destination: string;
  rideDescription: string;
  stars: number;
  noStars: number;
  time: string;
  test: any;
  today = new Date();
  rate = {
    'file_id': '',
    'rating': '',
  };
  rating = 0;
  rateCount = 0;
  rated = false;
  commented: boolean;
  takenSeats: Observable<Comment[]>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private dataProvider: DataProvider,
    private alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    this.getDetails();
    this.getTakenSeats();
    this.comment.file_id = this.Id;
    this.checkComments();
    this.stars = 4;
    this.noStars = 5 - this.stars;
    this.getRate();
  }

  getDetails() {
    this.Id = this.navParams.get('Id');
    this.dataProvider.getSingleMedia(this.Id).subscribe(data => {
      this.item = data;
      this.getDestination(data.description);
      this.dataProvider.getUser(data.user_id).subscribe(user => {
        this.uploader = user.username;
      });
    });
  }

  getDestination(ride: string) {
    this.destination = (JSON.parse(ride).start + ' - ' +
      JSON.parse(ride).destination);
    this.time = (JSON.parse(ride).timeAdded + ' - ' +
      JSON.parse(ride).timeReached);
    this.rideDescription = JSON.parse(ride).rideDescription;
  }

  getTakenSeats() {
    this.takenSeats = this.dataProvider.getTakenSeats(this.Id);
  }

  getSeat() {
    if (!this.commented) {
      console.log('no comments were found');
      this.dataProvider.getSeat(this.comment).subscribe(res => {
        console.log(res);
        this.ionViewDidLoad();
      });
    } else {
      this.presentAlert('You already have taken a spot!');
    }
  }

  cancelSeat(commentId: any) {
    if (this.commented) {
      console.log('comments were found');
      this.dataProvider.cancelSeat(commentId).subscribe(res => {
        console.log(res);
        this.ionViewDidLoad();
      });
    } else {
      this.presentAlert('You have nothing to cancel!');
    }
  }

  checkComments() {
    this.commented = false;
    console.log('checking for comments');
    this.dataProvider.getTakenSeats(this.Id).subscribe(data => {
      console.log('subscribe');
      if (data) {
        console.log('found data');
        data.forEach(element => {
          console.log(element.user_id + ' - ' + localStorage.getItem('userId'));
          if (element.user_id == localStorage.getItem('userId')) {
            this.commented = true;
          } else {
          }
          ;
        });
      }
      ;
    });
  }

  myComment(id: any) {
    return id == localStorage.getItem('userId');
  }

  isExpiredRide(item: Pic) {
    let date = new Date(
      this.today.getFullYear() + '-' + (this.today.getMonth() + 1) + '-' +
      this.today.getDate());
    let date1 = new Date(JSON.parse(item.description).timeDate);
    return (date1 < date);
  }

  addRate(rate: string) {
    console.log('rating now: ' + rate);
    this.rate.file_id = this.Id;
    this.rate.rating = rate;
    this.dataProvider.addRating(this.rate).subscribe(res => {
      console.log(res);
    });
    this.ionViewDidLoad();
  }

  getRate() {
    this.dataProvider.getRating().subscribe(res => {
      //console.log(res);
      res.forEach(element => {
        if (element.user_id == localStorage.getItem('userId') &&
          element.file_id == this.Id) {
          this.rated = true;
        }
        this.dataProvider.getSingleMedia(element.file_id).subscribe(data => {
          //console.log(data);
          if (data.user_id == this.item.user_id) {
            let i = 0;
            if (this.rateCount > 0 && this.rating > 0) {
              i = this.rating * this.rateCount;
            }
            this.rateCount++;
            this.rating = (i + element.rating) / this.rateCount;
            //console.log("in data " + this.rating);
          }
        });
      });
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
