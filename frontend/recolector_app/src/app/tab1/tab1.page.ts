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
  color = "danger";
  options: GoogleMapOptions = {
    camera: {
      target: new LatLng(-1.05458, -80.45445),
      zoom: 15,
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
  };
  map: GoogleMap;
  loading: any;
  constructor(public loadingCtrl: LoadingController, public toastCtrl: ToastController, private platform: Platform) {}
  async ngOnInit() {
    // Debido ngOnInit() inicia antes del evento
    // deviceready, debemos detectar cuando este evento se
    // ejecute para en ese momento cargar nuestro mapa sin problema alguno
    await this.platform.ready();
    this.map = GoogleMaps.create("map_canvas", this.options);
  }

  loadMap() {
    this.color = "success";
    LocationService.getMyLocation().then((myLocation: MyLocation) => {
      const cameraPos: CameraPosition<ILatLng> = {
        target: { lat: myLocation.latLng.lat, lng: myLocation.latLng.lng },
      };
      this.map.animateCamera(cameraPos);
    });
    // const watch = this.geolocation.watchPosition();
    /* watch.subscribe((data: any) => {
      const cameraPos: CameraPosition<ILatLng> = {
        target: { lat: data.coords.lat, lng: data.coords.lng },
      };
      this.map.moveCamera(cameraPos);
    }); */
  }
}
