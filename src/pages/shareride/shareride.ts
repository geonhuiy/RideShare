import { Component, ViewChild } from '@angular/core';
import {
  ActionSheetController,
  NavController,
  NavParams,
  Platform,
} from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { RideDetails } from '../../interface/ride';
import {
  GoogleMap, GoogleMapOptions,
  GoogleMaps,
  GoogleMapsEvent,
  LatLng, LocationService,
  Marker,
  MarkerOptions, MyLocation,
} from '@ionic-native/google-maps';

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
    private  actionSheetCtrl: ActionSheetController,
    private  googleMaps: GoogleMaps,
    private platform: Platform) {
  }

  filedata = '';
  rideBlob: Blob;
  @ViewChild('map_canvas') element;
  map: GoogleMap;

  rideDetail: RideDetails = {
    start: null,
    destination: null,
    timeDate: null,
    timeAdded: null,
    timeReached: null,
    rideDescription: null,
  };

  ionViewDidLoad() {
    this.platform.ready().then(() => {
      this.initMap();
    });
  }

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

  // ************************* Image upload *************************
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

  // ************************* Image upload *************************

  // ************************* Maps *************************

  /*initMap() {
    let map: GoogleMap = this.googleMaps.create(this.element.nativeElement);
    map.one(GoogleMapsEvent.MAP_READY).then(
      (data: any) => {
        let coordinates: LatLng = new LatLng(33.6396965, -84.4304574);
        let position = {
          target: coordinates,
          zoom: 17,
        };
        map.animateCamera(position);

        let markerOptions: MarkerOptions = {
          position: coordinates,
          title: 'Some point',
          icon: 'pin',
        };
        const marker = map.addMarker(markerOptions).then(
          ((marker: Marker) => {
            marker.showInfoWindow();
          }),
        );
      });
  }*/

  initMap() {
    LocationService.getMyLocation().then(
      (currentLocation: MyLocation) => {
        let options: GoogleMapOptions = {
          camera: {
            target: currentLocation.latLng,
            zoom: 10,
          },
        };
        this.map = GoogleMaps.create('map_canvas', options);
        // Adding markers
        /*let markerOptions: MarkerOptions = {
          position: currentLocation.latLng,
          title: 'Exposing my house',
        };
        const marker = this.map.addMarker(markerOptions).then(
          ((marker: Marker) => {
            marker.showInfoWindow();
          })
        );*/
      },
    );
  }

  // ************************* Maps *************************
}
