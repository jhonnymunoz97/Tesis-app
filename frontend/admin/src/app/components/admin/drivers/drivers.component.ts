import { Driver } from './../../../models/driver';
import { environment } from './../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { MyDTOptions } from 'src/app/helpers/MyDtOptions';

@Component({
  selector: 'app-drivers',
  templateUrl: './drivers.component.html',
  styleUrls: ['./drivers.component.scss'],
})
export class DriversComponent implements OnInit, OnDestroy {
  dtOptions: DataTables.Settings = {};
  drivers: Driver[] = [];
  // We use this trigger because fetching the list of persons can be quite long,
  // thus we ensure the data is fetched before rendering
  dtTrigger: Subject<any> = new Subject<any>();
  constructor(private httpClient: HttpClient) {}

  ngOnInit(): void {
    this.dtOptions = MyDTOptions
    this.getDrivers();
  }

  getDrivers() {
    this.httpClient
      .get<Driver[]>(environment.apiUrl + '/drivers')
      .subscribe((data) => {
        this.drivers = (data as any).data;
        // Calling the DT trigger to manually render the table
        this.dtTrigger.next();
      });
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
}
