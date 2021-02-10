import { AuthService } from "./../services/auth.service";
import { DriverService } from "./../services/driver.service";
import { Component, OnInit } from "@angular/core";
import { CameraPosition, GoogleMap, GoogleMapOptions, GoogleMaps, ILatLng, LatLng } from "@ionic-native/google-maps";
import { LoadingController, ToastController, Platform } from "@ionic/angular";
import { RutaService } from "../services/ruta.service";
import { Ruta } from "../models/ruta";
import { NotiService } from "../services/notifications.service";
import { User } from "../models/user";
import { UserService } from "../services/user.service";
import { Driver } from "../models/driver";
import { OneSignal } from "@ionic-native/onesignal/ngx";

declare var google;
@Component({
  selector: "app-tab1",
  templateUrl: "tab1.page.html",
  styleUrls: ["tab1.page.scss"],
})
export class Tab1Page implements OnInit {
  indexRuta = 0;
  rutas: Ruta[] = null;
  user: User;
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
  drivers: Driver[];
  constructor(
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private platform: Platform,
    private toastController: ToastController,
    private driverService: DriverService,
    private userService: UserService,
    private rutaService: RutaService,
    private notificationService: NotiService,
    private authService: AuthService
  ) {}
  async ngOnInit() {
    // Debido ngOnInit() inicia antes del evento
    // deviceready, debemos detectar cuando este evento se
    // ejecute para en ese momento cargar nuestro mapa sin problema alguno
    await this.platform.ready();
    this.map = GoogleMaps.create("map_canvas", this.options);
    this.getDrivers();
    this.getUsers();
    this.getRutas();
    this.getAndSetLocation();
  }

  async iniciar() {
    const toast = await this.toastController.create({
      message: "Ruta guardada",
      duration: 8500,
      position: "top",
      translucent: true,
    });
    console.log("Usuario:");
    console.log(this.user);
    console.log("Ruta:");
    console.log(this.rutas[this.indexRuta]);
    /* toast.present(); */
    this.userService.editUser(this.user).then(() => {
      toast.present();
    });
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
        zoom: 18,
      };
      this.map.animateCamera(cameraPos);
      this.user.location = myLocation;
      this.user.last_login = new Date();
      // this.user.ruta = this.rutas[this.indexRuta];
      this.userService.editUser(this.user);
    }
  }

  getUsers() {
    this.userService.getUsers().subscribe((users: User[]) => {
      let existe = false;
      users.forEach((user: User) => {
        // tslint:disable-next-line: triple-equals
        if (user.email == this.authService.currentUserValue.email) {
          existe = true;
          this.user = user;
          this.user.$key = user.$key;
          OneSignal.getPlugin().setEmail(user.email);
        }
      });
      if (!existe) {
        this.userService.addUser(this.authService.currentUserValue);
        this.getUsers();
      }
    });
  }
  getDrivers() {
    this.driverService.getDrivers().subscribe((drivers: Driver[]) => {
      this.drivers = drivers;
    });
  }
  getRutas() {
    this.rutaService.getRutas().subscribe((rutas: Ruta[]) => {
      this.rutas = rutas;
    });
  }

  setRuta(i: number) {
    this.indexRuta = i;
    const ruta = this.rutas[i];
    let directionsService = new google.maps.DirectionsService();
    directionsService.route(
      {
        origin: {
          lat: ruta.origin.lat,
          lng: ruta.origin.lng,
        },
        destination: {
          lat: ruta.destination.lat,
          lng: ruta.destination.lng,
        },
        waypoints: ruta.waypoints,
        travelMode: google.maps.TravelMode["DRIVING"],
      },
      (res, status) => {
        if (status == google.maps.DirectionsStatus.OK) {
          let decodedPoints = GoogleMaps.getPlugin().geometry.encoding.decodePath(res.routes[0].overview_polyline);
          this.map.clear();
          let newOptions: GoogleMapOptions = JSON.parse(
            JSON.stringify({
              camera: {
                target: new LatLng(ruta.origin.lat, ruta.destination.lng),
                zoom: 14,
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
        this.user.ruta = this.rutas[this.indexRuta].$key;
      }
    );
  }
  add() {
    this.indexRuta++;
    if (this.rutas && this.indexRuta >= this.rutas.length) {
      this.indexRuta = 0;
    }
    this.setRuta(this.indexRuta);
  }
  rest() {
    this.indexRuta--;
    if (this.rutas && this.indexRuta < 0) {
      this.indexRuta = this.rutas.length - 1;
    }
    this.setRuta(this.indexRuta);
  }
}
