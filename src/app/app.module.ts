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
import { LoginRegisterPage } from '../pages/login-register/login-register';
import { TabsPage } from '../pages/tabs/tabs';
import { RidesPage } from '../pages/rides/rides';
import { DataProvider } from '../providers/data/data';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { GetridePage } from '../pages/getride/getride';
import { ShareridePage } from '../pages/shareride/shareride';
import { EditProfilePage } from '../pages/edit-profile/edit-profile';
import { Chooser } from '@ionic-native/chooser';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ProfilePage,
    LoginRegisterPage,
    TabsPage,
    RidesPage,
    GetridePage,
    ShareridePage,
    EditProfilePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    TabsPage,
    LoginRegisterPage,
    RidesPage,
    ProfilePage,
    GetridePage,
    ShareridePage,
    EditProfilePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    DataProvider,
    Chooser
  ]
})
export class AppModule {
}
