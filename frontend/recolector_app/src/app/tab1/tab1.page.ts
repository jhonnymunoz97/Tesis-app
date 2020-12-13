import { Component, OnInit } from "@angular/core";
import {
  CameraPosition,
  GoogleMap,
  GoogleMapOptions,
  GoogleMaps,
  GoogleMapsEvent,
  ILatLng,
  LatLng,
  LocationService,
  MyLocation,
} from "@ionic-native/google-maps";
import { LoadingController, ToastController, Platform } from "@ionic/angular";

@Component({
  selector: "app-tab1",
  templateUrl: "tab1.page.html",
  styleUrls: ["tab1.page.scss"],
})
export class Tab1Page implements OnInit {
  color = "success";
  options: GoogleMapOptions = {
    camera: {
      target: new LatLng(-1.05458, -80.45445),
      zoom: 13,
    },
    controls: {
      compass: true,
      myLocationButton: true,
      myLocation: true, // (blue dot)
      indoorPicker: true,
      zoom: true, // android only
      mapToolbar: true, // android only
    },
    building: true,
    gestures: {
      scroll: true,
      tilt: true,
      zoom: true,
      rotate: false,
    },
  };
  map: GoogleMap;
  loading: any;
  constructor(
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private platform: Platform,
    private toastController: ToastController
  ) {}
  async ngOnInit() {
    // Debido ngOnInit() inicia antes del evento
    // deviceready, debemos detectar cuando este evento se
    // ejecute para en ese momento cargar nuestro mapa sin problema alguno
    await this.platform.ready();
    this.map = GoogleMaps.create("map_canvas", this.options);
  }

  async iniciar() {
    this.color = "danger";
    await LocationService.getMyLocation().then(async (myLocation: MyLocation) => {
      const cameraPos: CameraPosition<ILatLng> = {
        target: { lat: myLocation.latLng.lat, lng: myLocation.latLng.lng },
        zoom: 20,
      };
      this.map.animateCamera(cameraPos);
      const toast = await this.toastController.create({
        message: "Enviando ubicación en tiempo real",
        duration: 8500,
        position: "top",
        translucent: true,
      });
      toast.present();
    });
    function delay(t) {
      return new Promise((resolve) => setTimeout(resolve, t));
    }

    async function* interval(t) {
      while (true) {
        const now = Date.now();
        yield "hello";
        await delay(now - Date.now() + t);
      }
    }

    for await (const greeting of interval(3000)) {
      this.getAndSetLocation();
    }
  }

  parar() {
    this.color = "danger";
    window.location.reload();
  }

  async getAndSetLocation() {
    const myLocation = await this.map.getMyLocation();
    if (myLocation.accuracy < 20) {
      const cameraPos: CameraPosition<ILatLng> = {
        target: { lat: myLocation.latLng.lat, lng: myLocation.latLng.lng },
      };
      this.map.animateCamera(cameraPos);
    }
  }
}
