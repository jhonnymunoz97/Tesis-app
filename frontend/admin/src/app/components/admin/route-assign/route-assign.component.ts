import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Assign, Horario } from 'src/app/models/assign';
import { Driver } from 'src/app/models/driver';
import { Ruta } from 'src/app/models/ruta';
import { RutasService } from 'src/app/services/rutas.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-route-assign',
  templateUrl: './route-assign.component.html',
  styleUrls: ['./route-assign.component.scss'],
})
export class RouteAssignComponent implements OnInit {
  lat = -1.0168547484192896;
  lng = -80.45206653126932;
  zoom = 14;
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
      .get<Driver[]>(environment.apiUrl + '/users')
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
    this.horario.road = this.selectedRuta;
  }
  getRutas() {
    this.rutasService.getRutas().subscribe((rutas: Ruta[]) => {
      this.rutas = rutas;
    });
  }
  saveAssign() {
    console.log(this.selectedAssign);
  }
  addHorario() {
    if (
      this.horario.road &&
      this.horario.day &&
      this.horario.start_hour &&
      this.horario.end_hour
    ) {
      if (
        !this.selectedAssign.horarios.some(
          (horario) => horario === { ...this.horario }
        )
      ) {
        this.selectedAssign.horarios.push({ ...this.horario });
        this.horario = new Horario();
      } else {
        Swal.fire({
          icon: 'warning',
          text: 'La ruta ya fue agregada',
          timer: 500,
          showConfirmButton: false,
        });
      }
    } else {
      Swal.fire({
        icon: 'warning',
        text: 'Todos los campos son obligatorios',
        timer: 500,
        showConfirmButton: false,
      });
    }
  }
  containsObject(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
      if (list[i] === obj) {
        return true;
      }
    }
    return false;
  }
  removeHorario(index) {
    if (this.selectedAssign.horarios.length == 1) {
      this.selectedAssign.horarios = [];
    } else {
      this.selectedAssign.horarios = this.selectedAssign.horarios.splice(
        index,
        1
      );
    }
  }
}
