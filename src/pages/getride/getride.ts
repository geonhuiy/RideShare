import { Component } from '@angular/core';
import { LoadingController, NavController, NavParams, Platform } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { Chooser } from '@ionic-native/chooser';
import { TagParam, UploadResponse } from '../../interface/media';

/**
 * Generated class for the GetridePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-getride',
  templateUrl: 'getride.html',
})
export class GetridePage {

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private dataProvider: DataProvider,
              private loadingCtrl: LoadingController,
              private chooser: Chooser,
              private platform: Platform) {
  }

  isAndroid = this.platform.is('android');
  isPc = this.platform.is('core');
  file: File;
  mediaBlob: Blob;
  filedata = '';
  ride = {
    'start': '',
    'destination': '',
  };
  file_id: number;
  tag: string;
  newTag: TagParam = { file_id: null, tag: null };

  handleChange($event) {
    // console.log($event.target.files[0]);
    this.file = $event.target.files[0];
    this.showPreview();
  }

  showPreview() {
    const reader = new FileReader();
    reader.onloadend = (evt) => {
      this.filedata = reader.result;
    };
    if (this.isPc) {
      reader.readAsDataURL(this.file);
    } else if (this.isAndroid) {
      reader.readAsDataURL(this.mediaBlob);
    }
  }

  upload() {
    const fd = new FormData();
    fd.append('title', 'getRide');
    fd.append('description', JSON.stringify(this.ride));
    if (this.isPc) {
      fd.append('file', this.file);
    } else if (this.isAndroid) {
      fd.append('file', this.mediaBlob);
    }
    this.dataProvider.uploadMedia(fd).subscribe(
      res => {
        console.log(res.file_id);
        this.newTag.file_id = res.file_id;
        this.newTag.tag = JSON.stringify(this.ride);
        this.addTag(this.newTag);
      },
    );
  }

  addTag(tag: TagParam) {
    this.dataProvider.addTag(tag).subscribe(
      res => {
        console.log(res);
      }
    );
  }

  choose() {
    this.chooser.getFile('image/*').then(
      file => {
        this.mediaBlob = new Blob([ file.data ],
          { type: file.mediaType });
        this.showPreview();
      }).catch(
      (err) => {
        console.log(err);
      }
    );
  }
}
