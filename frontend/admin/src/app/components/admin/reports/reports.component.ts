import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { repeat } from 'rxjs/operators';
import { Driver } from 'src/app/models/driver';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  drivers: Driver[] = []
  vehicles: Driver[] = []

  //dtTrigger: Subject<any> = new Subject<any>();
  
  option:any = {
    drivers: false,
    users: false,
    vehicles: false,
    routes: false,
    points: false
  }

  constructor(private httpClient: HttpClient) { }

  
  ngOnInit(): void {
    this.getDrivers()
    this.getVehicles()
  }

  activeLink(option:string){
    if(option=='drivers'){
      this.option.drivers = true
      this.getDrivers()
    }
    else this.option.drivers = false
    if(option=='users') this.option.users = true
    else this.option.users = false
    if(option=='points') this.option.points = true
    else this.option.points = false
    if(option=='vehicles') {
      this.option.vehicles = true
      this.getVehicles()
    }
    else this.option.vehicles = false
    if(option=='routes') this.option.routes = true
    else this.option.routes = false
  }

  getDrivers() {
    this.httpClient
      .get<Driver[]>(environment.apiUrl + '/users')
      .subscribe((data) => {
        this.drivers = ((data as any).data as Driver[]).filter(dat =>{
          if (dat.role == 'Conductor') return true
        })
      });
      console.log(this.drivers)
  }

  getVehicles() {
    this.httpClient
      .get<Driver[]>(environment.apiUrl + '/vehicles')
      .subscribe((data) => {
        this.vehicles = data
      });
      console.log(this.vehicles)
  }



  /* ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
 */
}
