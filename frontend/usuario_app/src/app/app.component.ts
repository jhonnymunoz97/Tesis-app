import { Component } from "@angular/core";

import { Platform, AlertController } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";

import { OneSignal } from "@ionic-native/onesignal/ngx";
import { TabsPage } from "./tabs/tabs.page";
import { RutaService } from "./services/ruta.service";
import { Ruta } from "./models/ruta";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
})
export class AppComponent {
  rutas: Ruta[];
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private oneSignal: OneSignal,
    private alertCtrl: AlertController,
    private rutaService: RutaService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      if (this.platform.is("cordova")) {
        this.setupPush();
      }
    });
  }

  setupPush() {
    // I recommend to put these into your environment.ts
    this.oneSignal.startInit("c9ba3030-4787-4b84-ae4d-31494c773ca7", "1161834233");

    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.None);

    // Notifcation was received in general
    this.oneSignal.handleNotificationReceived().subscribe((data) => {
      let msg = data.payload.body;
      let title = data.payload.title;
      let additionalData = data.payload.additionalData;
      let idRuta = data.payload.additionalData.idRuta;
      this.showAlert(title, msg, additionalData.task);
      /*  this.rutaService.getRutas().subscribe((rutas: Ruta[]) => {
        rutas.forEach((ruta) => {
          if (ruta.$key == idRuta) {
            console.log("SOY");
            this.showAlert(title, msg, additionalData.task);
          }
        });
        this.rutas = rutas;
      }); */
    });

    // Notification was really clicked/opened
    /* this.oneSignal.handleNotificationOpened().subscribe((data) => {
      // Just a note that the data is a different place here!
      let additionalData = data.notification.payload.additionalData;

      this.showAlert("Tu recolector está en camino", "Saca la basura", additionalData.task);
    }); */

    this.oneSignal.endInit();
  }

  async showAlert(title, msg, task) {
    const alert = await this.alertCtrl.create({
      header: title,
      subHeader: msg,
      buttons: [
        {
          text: `OK`,
          handler: () => {
            TabsPage;
          },
        },
      ],
    });
    alert.present();
  }
}
