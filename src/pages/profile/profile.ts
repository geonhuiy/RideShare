import { Component } from '@angular/core';
import { ActionSheetController, App, LoadingController, MenuController, NavController, NavParams } from 'ionic-angular';
import { User } from '../../interface/user';
import { DataProvider } from '../../providers/data/data';
import { Observable } from 'rxjs';
import { Pic } from '../../interface/media';
import { EditProfilePage } from '../edit-profile/edit-profile';
import { VehicleUploadPage } from '../vehicle-upload/vehicle-upload';
import { Vehicle } from '../../interface/vehicle';

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
    private actionSheetCtrl: ActionSheetController) {
  }

  profile: Observable<User>;
  profilePic = '';
  userVehiclePic = '';
  userVehicle = '';

  ionViewDidEnter() {
    this.createLoading();
    this.loading.present();
    setTimeout(() => {
      this.loading.dismissAll();
    }, 350);
    this.getUserProfile();
    this.getProfilePics();
    this.getUserVehiclePic();
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
          }
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
          }
        }
      ]
    });
    actionSheet.present();
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
      }
    );
  }

  openEditProfile() {
    this.app.getRootNav().push(EditProfilePage, { getProfile: this.getUserProfile() });
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

}
