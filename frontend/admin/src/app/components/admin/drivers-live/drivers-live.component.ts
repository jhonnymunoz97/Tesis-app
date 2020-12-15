import { Driver } from './../../../models/driver';
import { DriverService } from './../../../services/driver.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-drivers-live',
  templateUrl: './drivers-live.component.html',
  styleUrls: ['./drivers-live.component.scss'],
})
export class DriversLiveComponent implements OnInit {
  drivers: Driver[];
  constructor(private driverService: DriverService) {}

  ngOnInit(): void {
    this.getDrivers();
  }

  getDrivers() {
    this.driverService.getDrivers().subscribe((drivers: Driver[]) => {
      this.drivers = drivers;
      console.log(this.drivers);
    });
  }
}
