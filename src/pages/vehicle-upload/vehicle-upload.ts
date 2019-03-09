import { Component } from '@angular/core';
import { ActionSheetController, LoadingController, NavController, NavParams, Platform } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { Vehicle } from '../../interface/vehicle';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { TagParam } from '../../interface/media';

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
              private actionSheetCtrl: ActionSheetController,
              private camera: Camera) {
    this.loading = loadingCtrl.create({
      content: 'Uploading',
      spinner: 'ios'
    });
  }

  filedata = '';
  vehicle: Vehicle = { seatNo: null, plateNo: null };
  tag: string;
  vehicleTag: TagParam = { tag: 'vehicle' };
  vehicleBlob: Blob;

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
          }
        }
      ]
    });
    actionsheet.present();
  }

  // ************************* Action sheet *************************

  upload() {
    const formData = new FormData();
    formData.append('title', 'vehicle');
    formData.append('description', JSON.stringify(this.vehicle));
    formData.append('file', this.vehicleBlob);
    this.dataProvider.uploadMedia(formData).subscribe(
      response => {
        console.log(response);
        this.vehicleTag.file_id = response.file_id;
        this.vehicleTag.tag = 'userVehicle';
        this.addTag(this.vehicleTag);
      },
      err => {
        console.log(JSON.stringify(err));
      }
    );
  }

  addTag(tag: TagParam) {
    this.dataProvider.addTag(tag).subscribe(
      res => {
        console.log(res);
      }
    );
  }

  openCamera() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };
    this.camera.getPicture(options).then(
      imageData => {
        this.filedata = 'data:image/jpeg;base64,' + imageData;
        this.vehicleBlob = this.base64ToBlob(this.filedata);

      },
      err => {
        console.log(err);
      }
    );
  }

  openGallery() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum: false,
      targetWidth: 300,
      targetHeight: 300
    };
    this.camera.getPicture(options).then(
      imageData => {
        this.filedata = 'data:image/jpeg;base64,' + imageData;
        this.vehicleBlob = this.base64ToBlob(this.filedata);
      },
      err => {
        console.log(err);
      }
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
