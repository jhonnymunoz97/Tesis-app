import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Driver } from 'src/app/models/driver';
import { Ruta } from 'src/app/models/ruta';
import { DriverService } from 'src/app/services/driver.service';
import { RutasService } from 'src/app/services/rutas.service';

@Component({
  selector: 'app-monitoreo',
  templateUrl: './monitoreo.component.html',
  styleUrls: ['./monitoreo.component.scss'],
})
export class MonitoreoComponent implements OnInit {
  editada: Ruta = {
    destination: null,
    name: null,
    origin: null,
    waypoints: null,
  };
  rutas: Ruta[] = [];
  drivers: Driver[] = [];
  selectedRuta: Ruta = null;
  selectedRutaView: Ruta = null;
  lat = -1.0168547484192896;
  lng = -80.45206653126932;
  zoom = 14;

  renderOptions = {
    draggable: false,
  };
  constructor(
    private rutasService: RutasService,
    private driverService: DriverService
  ) {
    moment.locale('es-MX');
  }

  ngOnInit(): void {
    this.getRutas();
  }

  getRutas() {
    this.rutasService.getRutas().subscribe((rutas: Ruta[]) => {
      this.rutas = rutas;
      this.getDrivers();
    });
  }
  getDrivers() {
    this.driverService.getDrivers().subscribe((drivers: Driver[]) => {
      this.drivers = drivers;
    });
  }
  public async change(event) {
    if (event.request.origin) {
      if (
        typeof event.request.origin.lat == 'function' &&
        typeof event.request.origin.lng == 'function'
      ) {
        this.editada.origin = {
          lat: event.request.origin.lat(),
          lng: event.request.origin.lng(),
        };
      }
    }

    if (event.request.destination) {
      if (
        typeof event.request.destination.lat == 'function' &&
        typeof event.request.destination.lng == 'function'
      ) {
        this.editada.destination = {
          lat: event.request.destination.lat(),
          lng: event.request.destination.lng(),
        };
      }
    }

    if (event.request.destination) {
      if (event.request.destination.location) {
        this.editada.destination = {
          lat: event.request.destination.location.lat(),
          lng: event.request.destination.location.lng(),
        };
      }
    }
    if (event.request.waypoints) {
      const oldWP = this.selectedRutaView.waypoints;
      if (event.request.waypoints) {
        let newWP: Location[] = event.request.waypoints.map((wp) => {
          if (wp.location) {
            if (typeof wp.location.lat == 'function') {
              const nuevaLocation: {
                location: { lat: number; lng: number };
              } = {
                location: {
                  lat: wp.location.lat(),
                  lng: wp.location.lng(),
                },
              };
              delete wp.location;
              wp.location = nuevaLocation;
            }
          }
          return wp;
        });
      }
    }
  }
  showRuta(ruta: Ruta) {
    this.selectedRutaView = ruta;
    this.editada.$key = ruta.$key;
    this.editada.name = ruta.name;
    this.editada.origin = ruta.origin;
    this.editada.destination = ruta.destination;
    this.editada.waypoints = ruta.waypoints;
  }
  viewDriver(driver: Driver) {
    this.lat = driver.location.latLng.lat;
    this.lng = driver.location.latLng.lng;
    this.zoom = 15;
  }
  getRelativeTime(timestamp) {
    return moment(timestamp).startOf('minutes').fromNow();
  }
}
