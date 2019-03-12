import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import {
  IonicApp,
  IonicErrorHandler,
  IonicModule,
  NavController,
} from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ProfilePage } from '../pages/profile/profile';
import { TabsPage } from '../pages/tabs/tabs';
import { RidesPage } from '../pages/rides/rides';
import { DataProvider } from '../providers/data/data';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ShareridePage } from '../pages/shareride/shareride';
import { EditProfilePage } from '../pages/edit-profile/edit-profile';
import { Chooser } from '@ionic-native/chooser';
import { ThumbnailPipe } from '../pipes/thumbnail/thumbnail';
import { RidedetailsPage } from '../pages/ridedetails/ridedetails';
import { VehicleUploadPage } from '../pages/vehicle-upload/vehicle-upload';
import { Camera } from '@ionic-native/camera';
import { UsernamePipe } from '../pipes/username/username';
import { GoogleMaps } from '@ionic-native/google-maps';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ProfilePage,
    TabsPage,
    RidesPage,
    ShareridePage,
    EditProfilePage,
    ThumbnailPipe,
    UsernamePipe,
    RidedetailsPage,
    VehicleUploadPage,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp, {
      scrollAssist: false,
      autoFocusAssist: false
    }),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    TabsPage,
    RidesPage,
    ProfilePage,
    ShareridePage,
    EditProfilePage,
    RidedetailsPage,
    VehicleUploadPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Chooser,
    Camera,
    GoogleMaps,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    DataProvider,
  ]
})
export class AppModule {
}
