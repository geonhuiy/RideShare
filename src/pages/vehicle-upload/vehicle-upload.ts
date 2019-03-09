import { Component } from '@angular/core';
import { ActionSheetController, LoadingController, NavController, NavParams, Platform } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { Vehicle } from '../../interface/vehicle';

/**
 * Generated class for the VehicleUploadPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-vehicle-upload',
  templateUrl: 'vehicle-upload.html',
})
export class VehicleUploadPage {
  loading: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private loadingCtrl: LoadingController,
              private platform: Platform,
              private dataProvider: DataProvider,
              private actionSheetCtrl: ActionSheetController) {
    this.loading = loadingCtrl.create({
      content: 'Uploading',
      spinner: 'ios'
    });
  }

  filedata = '';
  vehicle: Vehicle;
  // ************************* Action sheet *************************
  present() {
    const actionsheet = this.actionSheetCtrl.create({
      title: 'Choose image upload',
      buttons: [
        {
          text: 'Choose from gallery',
          icon: 'image',
          handler: () => {
            // Do something
          },
        },
        {
          text: 'Take picture from camera',
          icon: 'camera',
          handler: () => {
            // Do something
          }
        }
      ]
    });
    actionsheet.present();
  }

  // ************************* Action sheet *************************

  upload() {
    const formData = new FormData();

  }

}
