import { Component, ViewChild } from '@angular/core';
import {
  ActionSheetController, ModalController,
  NavController,
  NavParams,
  Platform,
} from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { LatLong, RideDetails } from '../../interface/ride';
import {
  BaseArrayClass,
  Geocoder, GeocoderRequest, GeocoderResult,
  GoogleMap, GoogleMapOptions,
  GoogleMaps,
  GoogleMapsEvent, ILatLng,
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
    private platform: Platform,
    private modalCtrl: ModalController) {
  }

  filedata = '';
  rideBlob: Blob;
  @ViewChild('map_canvas') element;
  map: GoogleMap;
  isSearching = false;
  startMarker: Marker;
  destinationMarker: Marker;
  start: string;
  destination: string;
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

  initMap() {
    LocationService.getMyLocation().then(
      (currentLocation: MyLocation) => {
        let options: GoogleMapOptions = {
          camera: {
            target: currentLocation.latLng,
            zoom: 9,
          },
        };
        this.map = GoogleMaps.create('map_canvas', options);
      },
    );
  }

  geocodeStart(event) {
    Geocoder.geocode({
      'address': this.start,
    }).then(
      (results: GeocoderResult[]) => {
        if (!results.length) {
          this.isSearching = false;
          return null;
        }
        this.rideDetail.start = JSON.stringify(results[0].position);
        if (this.startMarker) {
          this.startMarker.remove();
        }

        this.startMarker = this.map.addMarkerSync({
          'position': results[0].position,
          'title': JSON.stringify(results),
        });
      },
    );
  }

  geocodeDestination(event) {
    Geocoder.geocode({
      'address': this.destination,
    }).then(
      (results: GeocoderResult[]) => {
        if (!results.length) {
          this.isSearching = false;
          return null;
        }
        this.rideDetail.destination = JSON.stringify(results[0].position);
        if (this.destinationMarker) {
          this.destinationMarker.remove();
        }
        this.destinationMarker = this.map.addMarkerSync({
          'position': results[0].position,
          'title': JSON.stringify(results),
        });
      },
    );
  }

  reverseStartGeocode($event) {
    Geocoder.geocode({
      'position': JSON.parse(this.rideDetail.start),
    }).then(
      (results: GeocoderResult[]) => {
        if (results.length === 0) {
          return null;
        }
        let address: any = results[0].extra.lines;
        this.rideDetail.start = address;
      },
    );
  }

  reverseDestinationGeocode($event) {
    Geocoder.geocode({
      'position': JSON.parse(this.rideDetail.destination),
    }).then(
      (results: GeocoderResult[]) => {
        if (results.length === 0) {
          return null;
        }

        let address: any = results[0].extra.lines;
        this.rideDetail.destination = address;
        console.log(JSON.stringify(results));
        console.log(address);
      },
    );
  }
}

// ************************* Maps *************************

