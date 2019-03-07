import { Component } from '@angular/core';
import { App, LoadingController, NavController, NavParams } from 'ionic-angular';
import { User } from '../../interface/user';
import { DataProvider } from '../../providers/data/data';
import { LoginRegisterPage } from '../login-register/login-register';
import { Observable } from 'rxjs';
import { Pic } from '../../interface/media';
import { EditProfilePage } from '../edit-profile/edit-profile';

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
    private loadingCtrl: LoadingController) {
  }

  profile: Observable<User>;
  profilePic = '';

  ionViewDidEnter() {
    this.createLoading();
    this.loading.present();
    setTimeout(() => {
      this.loading.dismissAll();
    }, 350);
    this.getUserProfile();
    this.getProfilePics();
  }

  logout() {
    localStorage.removeItem('token');
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

  openEditProfile() {
    this.app.getRootNav().push(EditProfilePage, { getProfile: this.getUserProfile() });
  }

  createLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Loading profile',
      spinner: 'ios',
    });
  }

}
