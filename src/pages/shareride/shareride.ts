import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { Chooser } from "@ionic-native/chooser";

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
  title = 'carpool';
  from = '';
  where = '';
  filedata = '';
  file;
  loading = false;
  myBlob = new Blob;
  fileSelected = false;
  @ViewChild('uploadRideForm') uploadRideForm;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private dataProvider: DataProvider,
              private chooser: Chooser) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShareridePage');
  }

  uploadRide() {
    //show spinner
    this.loading = true;
    const fd = new FormData();
    fd.append('title',this.title);
    fd.append('description',("from: " + this.from + "where: " + this.where));
    fd.append('file',this.myBlob);
    this.dataProvider.shareRide(fd).subscribe(
      (response: any) => {
        console.log(response);
        setTimeout(() => {
          this.wait();
        }, 2000, false);
      },
      error => {
        this.loading = false;
        console.log(error);
      });
  }

  wait(){
    this.loading = false;
    this.uploadRideForm.reset();
    this.fileSelected = false;
    this.navCtrl.pop().catch();
  }

  showPreview() {
    const reader = new FileReader();
    reader.onloadend = (evt) => {
      console.log(reader.result);
      this.filedata = reader.result;
    };

    if (this.myBlob.type.includes('video')){
      this.filedata ='http://via.placeholder.com/500x200/000?text=video';
    } else if (this.myBlob.type.includes('audio')){
      this.filedata ='http://via.placeholder.com/500x200/000?text=audio';
    } else {
      reader.readAsDataURL(this.myBlob);
    }
  }

  fileChoose() {
    console.log('this is filechoose!');
    this.chooser.getFile( 'image/*,video/*,audio/*')
      .then(file => {
        console.log(file);
        this.myBlob = new Blob([file.data], {type: file.mediaType});
        this.fileSelected = true;
        this.showPreview()
      })
      .catch((error: any) => {
        console.error(error)
      });
  };

  resetAll(){
    this.loading = false;
    this.uploadRideForm.reset();
    this.fileSelected = false;
    this.filedata = '';
  }
}
