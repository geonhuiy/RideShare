import { Component } from '@angular/core';
import { ActionSheetController, NavController, NavParams } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { Pic, SearchParam } from '../../interface/media';
import { Observable } from 'rxjs';
import { selectValueAccessor } from '@angular/forms/src/directives/shared';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { RideDetails } from '../../interface/ride';

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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private dataProvider: DataProvider,
    private camera: Camera,
    private  actionSheetCtrl: ActionSheetController) {
  }

  filedata = '';
  rideDetail: RideDetails = {
    start: null,
    destination: null,
    timeDate: null,
    timeAdded: null,
    timeReached: null,
    rideDescription: null
  };
  rideBlob: Blob;

  // ************************* Action sheet *************************
  present() {
    const actionsheet = this.actionSheetCtrl.create({
      title: 'Choose image upload',
      buttons: [
        {
          text: 'Choose from gallery',
          icon: 'image',
          handler: () => {
            this.openGallery();
          },
        },
        {
          text: 'Take picture from camera',
          icon: 'camera',
          handler: () => {
            this.openCamera();
          },
        },
      ],
    });
    actionsheet.present();
  }

  // ************************* Action sheet *************************

  upload() {
    const formData = new FormData();
    formData.append('title', 'getRide');
    formData.append('description', JSON.stringify(this.rideDetail));
    formData.append('file', this.rideBlob);
    this.dataProvider.uploadMedia(formData).subscribe(
      response => {
        console.log(response);
      },
      err => {
        console.log(JSON.stringify(err));
      },
    );
  }

  openCamera() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
    };
    this.camera.getPicture(options).then(
      imageData => {
        this.filedata = 'data:image/jpeg;base64,' + imageData;
        this.rideBlob = this.base64ToBlob(this.filedata);

      },
      err => {
        console.log(err);
      },
    );
  }

  openGallery() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum: false,
      targetWidth: 300,
      targetHeight: 300,
    };
    this.camera.getPicture(options).then(
      imageData => {
        this.filedata = 'data:image/jpeg;base64,' + imageData;
        this.rideBlob = this.base64ToBlob(this.filedata);
      },
      err => {
        console.log(err);
      },
    );
  }

  base64ToBlob(dataURL: string) {
    const byteString = atob(dataURL.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ ab ], { type: 'image/jpeg' });
  }
}
