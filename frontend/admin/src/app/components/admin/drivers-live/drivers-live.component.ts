import { Driver } from './../../../models/driver';
import { DriverService } from './../../../services/driver.service';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment'; // add this 1 of 4

@Component({
  selector: 'app-drivers-live',
  templateUrl: './drivers-live.component.html',
  styleUrls: ['./drivers-live.component.scss'],
})
export class DriversLiveComponent implements OnInit {
  lat = -1.05458;
  lng = -80.45445;
  zoom = 14;
  drivers: Driver[];
  constructor(private driverService: DriverService) {
    moment.locale('es-MX');
  }

  ngOnInit(): void {
    this.getDrivers();
  }

  getDrivers() {
    this.driverService.getDrivers().subscribe((drivers: Driver[]) => {
      this.drivers = drivers;
    });
  }
  viewDriver(driver: Driver) {
    this.lat = driver.location.latLng.lat;
    this.lng = driver.location.latLng.lng;
    this.zoom = 19;
  }
  getRelativeTime(timestamp) {
    return moment(timestamp).startOf('minutes').fromNow();
  }
}
