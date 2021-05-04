import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Assign, Horario } from 'src/app/models/assign';
import { Driver } from 'src/app/models/driver';
import { Ruta } from 'src/app/models/ruta';
import { RutasService } from 'src/app/services/rutas.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-route-assign',
  templateUrl: './route-assign.component.html',
  styleUrls: ['./route-assign.component.scss'],
})
export class RouteAssignComponent implements OnInit {
  assigns: Assign[] = [];
  drivers: Driver[] = [];
  rutas: Ruta[] = [];
  selectedAssign: Assign = new Assign();
  selectedRuta: Ruta = null;
  dtOptions: DataTables.Settings = {};
  horario: Horario = new Horario();
  // We use this trigger because fetching the list of persons can be quite long,
  // thus we ensure the data is fetched before rendering
  dtTrigger: Subject<any> = new Subject<any>();
  constructor(
    private httpClient: HttpClient,
    private rutasService: RutasService
  ) {}

  ngOnInit(): void {
    this.getDrivers();
    this.getRutas();
  }

  getDrivers() {
    this.httpClient
      .get<Driver[]>(environment.apiUrl + '/drivers')
      .subscribe((data) => {
        this.drivers = (data as any).data;
        this.drivers = this.drivers.map((driver) => {
          if (!driver.profilePhoto) {
            driver.profilePhoto = 'https://i.pravatar.cc/1000';
          }
          return driver;
        });

        // Calling the DT trigger to manually render the table
        this.dtTrigger.next();
      });
  }
  selectDriver(driver) {
    this.selectedAssign.driver_id = this.drivers[
      driver.target.value as number
    ].id;
    this.selectedAssign.driver = this.drivers[driver.target.value as number];
  }

  selectRuta(ruta) {
    this.selectedRuta = this.rutas[ruta.target.value as number];
  }
  getRutas() {
    this.rutasService.getRutas().subscribe((rutas: Ruta[]) => {
      this.rutas = rutas;
      console.log(rutas);
    });
  }
}
