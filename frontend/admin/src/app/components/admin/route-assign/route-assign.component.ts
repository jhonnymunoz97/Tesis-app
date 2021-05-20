import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { type } from 'jquery';
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
  
  control: boolean = false

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
    this.control = false
  }

  getAssigns() {
    this.httpClient
      .get<Assign[]>(environment.apiUrl + '/assigns')
      .subscribe((data) => {
        this.assigns = (data as any).data;
        this.dtTrigger.next();
      });
  }

  getDrivers() {
    this.httpClient
      .get<Driver[]>(environment.apiUrl + '/users')
      .subscribe((data) => {
        this.drivers = ((data as any).data as Driver[]).filter(driver =>{
          if (!driver.profilePhoto) {
            driver.profilePhoto = 'https://i.pravatar.cc/1000';
          }
          if (driver.role == 'Conductor') return true
        })
      });
  }

  getVehicles() {
    this.httpClient
      .get<Vehicles[]>(environment.apiUrl + '/vehicles')
      .subscribe((data) => {
        this.vehicles  = <Vehicles>(data as any).data;
      });
  }

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

 find():number{
    let index: number = 0
    let flag: boolean = false
    let find = this.assigns.filter(assign =>{
      if(assign.driver_id == this.selectedAssign.driver_id && assign.vehicle_id == this.selectedAssign.vehicle_id) {
        flag = true
        return true 
      }
      if(!flag) index = index + 1 
    })
    if(find.length>0) return index
    else return -1
 }

  saveAssign() {
    if (
      this.selectedAssign.horarios.length == 0 ||
      !this.selectedAssign.driver_id ||
      !this.selectedAssign.vehicle_id 
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

      if(this.find()>=0){
        this.editAssign()
      }else{
        this.addAssign()
      }
    }
  }

  addAssign(){
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

  editAssign(){
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
  
  removeHorario(index) {
    this.selectedAssign.horarios.splice(index,1)
  }

  selectAssign(i) {
    this.isEdit = true;
    this.isAdd = false;
    this.selectedAssign = this.assigns[i];
    
    this.selectedAssign.driver_id = this.assigns[i].driver_id;
  }

  disabled(){
    if(this.selectedAssign.driver_id && this.selectedAssign.vehicle_id){
      this.control = true
      if(this.find()>=0) this.selectAssign(this.find())
    }  
  }
}
