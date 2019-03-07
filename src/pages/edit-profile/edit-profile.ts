import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { Update, UsernameStatus } from '../../interface/user';

/**
 * Generated class for the EditProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfilePage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private dataProvider: DataProvider) {
  }

  updateData: Update = {};
  usernameCheck = true;
  @ViewChild('updateform') updateForm;

  updateProfile() {
    this.dataProvider.updateUserData(this.updateData).subscribe(
      (res) => {
        console.log(res);
      },
      (err) => {
        console.log(err);
      },
    );
    this.navCtrl.pop();
  }

  checkUsername() {
    this.dataProvider.getUserName(this.updateData.username).subscribe(
      (response: UsernameStatus) => {
        if (response.available) {
          this.usernameCheck = true;
        } else {
          this.updateForm.form.controls['updateUsername'].setErrors(
            { 'incorrect': true });
          this.usernameCheck = false;
        }
      },
    );
  }
}
