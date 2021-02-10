import { AuthService } from "./../services/auth.service";
import { DriverService } from "./../services/driver.service";
import { Driver } from "./../models/driver";
import { Component, OnInit } from "@angular/core";
import {
  CameraPosition,
  GoogleMap,
  GoogleMapOptions,
  GoogleMaps,
  ILatLng,
  LatLng,
  LocationService,
  MyLocation,
} from "@ionic-native/google-maps";
import { LoadingController, ToastController, Platform } from "@ionic/angular";
import { RutaService } from "../services/ruta.service";
import { Ruta } from "../models/ruta";
import { UserService } from "../services/user.service";
import { User } from "../models/user";
declare var google;
@Component({
  selector: "app-tab1",
  templateUrl: "tab1.page.html",
  styleUrls: ["tab1.page.scss"],
})
export class Tab1Page implements OnInit {
  rutas: Ruta[];
  driver: Driver;
  key = null;
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
  users: any[];
  ruta: Ruta;
  constructor(
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private platform: Platform,
    private toastController: ToastController,
    private driverService: DriverService,
    private rutaService: RutaService,
    private authService: AuthService,
    private userService: UserService
  ) {}
  async ngOnInit() {
    // Debido ngOnInit() inicia antes del evento
    // deviceready, debemos detectar cuando este evento se
    // ejecute para en ese momento cargar nuestro mapa sin problema alguno
    await this.platform.ready();
    this.map = GoogleMaps.create("map_canvas", this.options);
    this.getDrivers();
    this.getRutas();
    this.getUsers();
  }

  async iniciar() {
    this.color = "danger";
    await LocationService.getMyLocation().then(async (myLocation: MyLocation) => {
      const cameraPos: CameraPosition<ILatLng> = {
        target: { lat: myLocation.latLng.lat, lng: myLocation.latLng.lng },
        zoom: 20,
      };
      this.users.forEach(async (user: User) => {
        if (user.ruta == this.ruta.$key) {
          console.log(user);
          this.map.animateCamera(cameraPos);
          this.userService.sendNotification(user, this.ruta).subscribe(async (response) => {
            console.log(response);
            const toast = await this.toastController.create({
              message: "Enviando ubicación en tiempo real",
              duration: 8500,
              position: "top",
              translucent: true,
            });
            toast.present();
            this.driver.location = myLocation;
            this.driver.last_login = new Date();
            this.driverService.editDriver(this.driver);
          });
        }
      });
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

    for await (const {} of interval(3000)) {
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
      this.driver.location = myLocation;
      this.driver.last_login = new Date();
      this.driverService.editDriver(this.driver);
    }
  }

  getDrivers() {
    this.driverService.getDrivers().subscribe((drivers: Driver[]) => {
      let existe = false;
      drivers.forEach((driver: Driver) => {
        // tslint:disable-next-line: triple-equals
        if (driver.email == this.authService.currentUserValue.email) {
          existe = true;
          this.driver = driver;
        }
      });
      if (!existe) {
        this.driverService.addDriver(this.authService.currentUserValue);
        this.getDrivers();
      }
    });
  }
  getRutas() {
    this.rutaService.getRutas().subscribe((rutas: Ruta[]) => {
      this.rutas = rutas;
    });
  }

  getUsers() {
    this.userService.getUsers().subscribe((users: User[]) => {
      this.users = users;
    });
  }

  setRuta(i: number) {
    this.ruta = this.rutas[i];
    let directionsService = new google.maps.DirectionsService();
    directionsService.route(
      {
        origin: {
          lat: this.ruta.origin.lat,
          lng: this.ruta.origin.lng,
        },
        destination: {
          lat: this.ruta.destination.lat,
          lng: this.ruta.destination.lng,
        },
        waypoints: this.ruta.waypoints,
        travelMode: google.maps.TravelMode["DRIVING"],
      },
      (res, status) => {
        if (status == google.maps.DirectionsStatus.OK) {
          let decodedPoints = GoogleMaps.getPlugin().geometry.encoding.decodePath(res.routes[0].overview_polyline);
          this.map.clear();
          let newOptions: GoogleMapOptions = JSON.parse(
            JSON.stringify({
              camera: {
                target: new LatLng(this.ruta.origin.lat, this.ruta.destination.lng),
                zoom: 17,
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
            })
          );
          this.map.setOptions(newOptions);
          this.map.addPolyline({
            points: decodedPoints,
            color: "#4a4a4a",
            width: 4,
            geodesic: true,
          });
        }
      }
    );
  }
  onChange($event) {
    this.setRuta(parseInt($event.target.value));
  }
}
