import { Component, ViewChild } from "@angular/core";
import { Nav, Platform, Events } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { MyEstatesPage } from "../pages/pages";
import { LocationsPage, EstatesPage, HomePage } from "../pages/pages";
import { EstatePersistanceProvider } from "../providers/estate-persistance/estate-persistance";
import { RoyalEstatesApiProvider } from "../providers/royal-estates/royal-estates";

@Component({
  templateUrl: "app.html"
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any = MyEstatesPage;
  estates = [];

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public persistance: EstatePersistanceProvider,
    public customApi: RoyalEstatesApiProvider,
    public events: Events
  ) {
    this.initializeApp();
    this.estates = this.persistance.getSavedEstates();
    events.subscribe("savedEstates:updated", data => {
      events.unsubscribe("savedEstates:updated");
      this.estates = this.persistance.getSavedEstates();
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  itemTapped($event, item) {
    this.customApi.setCurrentEstate(item);
    this.nav.push(HomePage, { item: item });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  goToLocations() {
    this.nav.push(LocationsPage);
  }

  goToSavedEstates() {
    this.nav.push(EstatesPage);
  }
}