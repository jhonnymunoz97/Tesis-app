import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { MyDTOptions } from 'src/app/helpers/MyDtOptions';
import { Assign, Horario } from 'src/app/models/assign';
import { Driver } from 'src/app/models/driver';
import { Ruta } from 'src/app/models/ruta';
import { Vehicles } from 'src/app/models/vehicles';
import { AssignsService } from 'src/app/services/asignacion.service';
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

  vehicles: Vehicles

  rutas: Ruta[] = [];
  selectedAssign: Assign = new Assign();
  selectedRuta: Ruta = null;
  dtOptions: DataTables.Settings = {};
  horario: Horario = new Horario();
  // We use this trigger because fetching the list of persons can be quite long,
  // thus we ensure the data is fetched before rendering
  dtTrigger: Subject<any> = new Subject<any>();
  isEdit: boolean = false;
  isAdd: boolean = false;
  constructor(
    private httpClient: HttpClient,
    private rutasService: RutasService
  ) {}

  ngOnInit(): void {
    this.dtOptions = MyDTOptions;
    this.getDrivers();
    this.getVehicles();
    this.getRutas();
    this.getAssigns();
  }

  newAssign() {
    this.getVehicles();
    this.isAdd = true;
    this.isEdit = false;
    this.selectedAssign = new Assign();
  }

  getAssigns() {
    this.httpClient
      .get<Assign[]>(environment.apiUrl + '/assigns')
      .subscribe((data) => {
        this.assigns = (data as any).data;
        console.log(this.assigns);
        // Calling the DT trigger to manually render the table
        this.dtTrigger.next();
      });
  }

  getDrivers() {
    this.httpClient
      .get<Driver[]>(environment.apiUrl + '/users')
      .subscribe((data) => {
        //this.drivers = (data as any).data;
        /* this.drivers = this.drivers.map((driver) => {
          if (!driver.profilePhoto) {
            driver.profilePhoto = 'https://i.pravatar.cc/1000';
          }
          return driver;
        }); */
        this.drivers = ((data as any).data as Driver[]).filter(driver =>{
          if (!driver.profilePhoto) {
            driver.profilePhoto = 'https://i.pravatar.cc/1000';
          }
          if (driver.role == 'Conductor') return true
        })
        console.log(this.drivers)

      });
  }

  getVehicles() {
    this.httpClient
      .get<Vehicles[]>(environment.apiUrl + '/vehicles')
      .subscribe((data) => {
        this.vehicles  = <Vehicles>(data as any).data;
      });
      console.log(this.vehicles)
  }



  /* selectDriver(driver) {
    this.selectedAssign.driver_id =
      this.drivers[driver.target.value as number].id;
    this.selectedAssign.driver = this.drivers[driver.target.value as number];
  } */

  selectRuta(ruta) {
    this.horario.road = this.selectedRuta =
      this.rutas[ruta.target.value as number];
  }
  showRuta(ruta: Ruta) {
    this.horario.road = this.selectedRuta = ruta;
  }
  getRutas() {
    this.rutasService.getRutas().subscribe((rutas: Ruta[]) => {
      this.rutas = rutas;
    });
  }
  saveAssign() {
    if (
      this.selectedAssign.horarios.length == 0 ||
      !this.selectedAssign.driver_id ||
      !this.selectedAssign.vehicle_id ||
      !this.selectedAssign.start_date ||
      !this.selectedAssign.end_date
    ) {
      Swal.fire({
        icon: 'warning',
        text: 'Todos los campos son obligatorios',
        timer: 1000,
        showConfirmButton: false,
      });
    } else {
      this.isEdit = false;
      this.isAdd = false;
      if (this.selectedAssign.id) {
        this.httpClient
          .put<Assign>(
            environment.apiUrl + '/assigns' + '/' + this.selectedAssign.id,
            this.selectedAssign
          )
          .subscribe((data) => {
            Swal.fire(
              'Cambios Guardados!',
              'La operación fue exitosa!',
              'success'
            ).then(() => {
              window.location.reload();
            });
          });
      } else {
        this.httpClient
          .post<Driver>(environment.apiUrl + '/assigns', this.selectedAssign)
          .subscribe((data) => {
            Swal.fire(
              'Cambios Guardados!',
              'La operación fue exitosa!',
              'success'
            ).then(() => {
              window.location.reload();
            });
          });
      }
    }
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

  selectAssign(i) {
    this.isEdit = true;
    this.isAdd = false;
    this.selectedAssign = this.assigns[i];
    this.selectedAssign.driver_id = this.assigns[i].driver_id;
  }
}
