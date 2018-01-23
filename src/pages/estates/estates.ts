import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, LoadingController } from "ionic-angular";
import { RoyalEstatesApiProvider } from "../../providers/royal-estates/royal-estates";
import { HomePage } from "../pages";
/**
 * Generated class for the EstatesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-estates",
  templateUrl: "estates.html"
})
export class EstatesPage {
  location: any;
  estates = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public customApi: RoyalEstatesApiProvider,
    public loadingController: LoadingController
  ) {
    this.location = navParams.get("item");
  }

  ionViewDidLoad() {
    if (this.location) {
      let loader = this.loadingController.create({
        content: "Getting estates in " + this.location.name,
        spinner: "dots"
      });
      loader.present().then(() => {
        this.customApi
          .getLocationEstateData(this.location)
          .subscribe(data => {
            this.estates = data.estates;
            loader.dismiss();
          });
      });
    } else {
      let loader = this.loadingController.create({
        content: "Getting estates from all over.",
        spinner: "dots"
      });
      loader.present().then(() => {
        this.customApi.getAllEstatesData().subscribe(data => {
          this.estates = [];
          data.map(location => {
            this.estates = this.estates.concat(location);
          });
          this.location = { name: "All Over" };
          loader.dismiss();
        });
      });
    }
  }
  itemClicked($event, item) {
    this.customApi.setCurrentEstate(item);
    if (this.location.name === "All Over") {
      this.location.name = item.locationName;
      this.location["id"] = item.locationId;
      this.customApi.getLocationEstateData(this.location).subscribe(data => {
        this.estates = data.estates;
      });
    }
    this.navCtrl.push(HomePage, { item: item });
  }
}