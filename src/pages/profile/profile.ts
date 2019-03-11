import { Component } from '@angular/core';
import {
  ActionSheetController,
  App,
  LoadingController,
  MenuController,
  NavController,
  NavParams,
} from 'ionic-angular';
import { User } from '../../interface/user';
import { DataProvider } from '../../providers/data/data';
import { Observable } from 'rxjs';
import { Pic, TagParam } from '../../interface/media';
import { EditProfilePage } from '../edit-profile/edit-profile';
import { VehicleUploadPage } from '../vehicle-upload/vehicle-upload';
import { Vehicle } from '../../interface/vehicle';
import { Camera, CameraOptions } from '@ionic-native/camera';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  loading: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private dataProvider: DataProvider,
    private app: App,
    private loadingCtrl: LoadingController,
    private actionSheetCtrl: ActionSheetController,
    private camera: Camera) {
  }

  profile: Observable<User>;
  profilePic = '';
  userVehiclePic = '';
  userVehicle: Vehicle = { seatNo: null, plateNo: null };
  profileTag: TagParam = { tag: '', file_id: null };
  filedata = '';
  profileBlob: Blob;

  ionViewDidEnter() {
    this.createLoading();
    this.loading.present();
    setTimeout(() => {
      this.loading.dismissAll();
    }, 350);
    this.getUserProfile();
    this.getProfilePics();
    this.getUserVehiclePic();
    this.getUserVehicle();
  }

  // ************************* Action sheet *************************
  present() {
    const actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Edit profile',
          role: 'Edit profile',
          icon: 'create',
          handler: () => {
            this.openEditProfile();
          },
        },
        {
          text: 'Upload vehicle information',
          icon: 'car',
          role: 'Upload vehicle information',
          handler: () => {
            this.openVehicleUpload();
          },
        },
        {
          text: 'Log out',
          icon: 'log-out',
          role: 'Log out',
          handler: () => {
            this.logout();
          },
        },
      ],
    });
    actionSheet.present();
  }

  presentUpload() {
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

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    this.dataProvider.loggedIn = false;
    this.navCtrl.parent.select(0);
  }

  getUserProfile() {
    this.profile = this.dataProvider.getUserProfile();
  }

  getProfilePics() {
    this.dataProvider.getProfilePic().subscribe(
      (response: Pic[]) => {
        this.profilePic = response.filter(
          obj => {
            return obj.user_id.toString() === localStorage.getItem('userId');
          },
        ).map(
          object => object.filename,
        )[0];
      },
    );
  }

  getUserVehiclePic() {
    this.dataProvider.getVehicles().subscribe(
      (response: Pic[]) => {
        this.userVehiclePic = response.filter(
          obj => {
            return obj.user_id.toString() === localStorage.getItem('userId');
          },
        ).map(
          object => object.filename,
        )[0];
      },
    );
  }

  getUserVehicle() {
    this.dataProvider.getVehicles().subscribe(
      (response: any) => {
        console.log(response);
        (this.userVehicle) = response.filter(
          obj => {
            return obj.user_id.toString() === localStorage.getItem('userId');
          },
        ).map(
          (object) => {
            return JSON.parse(object.description);
          },
        )[0];
      },
    );
  }

  openEditProfile() {
    this.app.getRootNav().
      push(EditProfilePage, { getProfile: this.getUserProfile() });
  }

  createLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Loading profile',
      spinner: 'ios',
    });
  }

  openVehicleUpload() {
    this.app.getRootNav().push(VehicleUploadPage);
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
        this.profileBlob = this.base64ToBlob(this.filedata);
        this.upload();

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
        this.profileBlob = this.base64ToBlob(this.filedata);
        this.upload();
      },
      err => {
        console.log(JSON.stringify(err));
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

  addTag(tag: TagParam) {
    this.dataProvider.addTag(tag).subscribe(
      res => {
        console.log(res);
      },
      err => {
        console.log(err);
      },
    );
  }

  upload() {
    const formData = new FormData();
    formData.append('title', 'profilePic');
    formData.append('description', '');
    formData.append('file', this.profileBlob);
    this.dataProvider.uploadMedia(formData).subscribe(
      response => {
        console.log(JSON.stringify(response));
        console.log('profile image uploaded');
        this.profileTag.file_id = response.file_id;
        this.profileTag.tag = 'profile';
        this.addTag(this.profileTag);
      },
      err => {
        console.log(err);
      },
    );
  }

}
