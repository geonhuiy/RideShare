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
import { VehicleUploadPage } from '../vehicle-upload/vehicle-upload';
import { RidesPage } from '../rides/rides';

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
        this.navCtrl.pop();
      },
      err => {
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
      },
    );
  }

  // Creates a blob from the base64 DATAURL from gallery/camera
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

  // Initializes map with current position
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

  // Converts a readable address into a LatLng
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
        // If starting position is modified, removes the current starting marker
        if (this.startMarker) {
          this.startMarker.remove();
        }
        // Adds a starting marker on the map
        this.startMarker = this.map.addMarkerSync({
          'position': results[0].position,
          'title': JSON.stringify(results),
        });
      },
    );
  }

  // Converts the destination address into a LatLng
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
        // If destination position is modified, removes current destination marker
        if (this.destinationMarker) {
          this.destinationMarker.remove();
        }
        // Adds a destination marker on the map
        this.destinationMarker = this.map.addMarkerSync({
          'position': results[0].position,
          'title': JSON.stringify(results),
        });
      },
    );
  }

  // Converts a LatLng into a readable address
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
  // Converts a LatLng into a readable address
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
      },
    );
  }
}

// ************************* Maps *************************

