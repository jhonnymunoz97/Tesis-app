import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Driver } from 'src/app/models/driver';
import { Vehicles } from 'src/app/models/vehicles';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-vehicle-edit',
  templateUrl: './vehicle-edit.component.html',
  styleUrls: ['./vehicle-edit.component.scss']
})
export class VehicleEditComponent implements OnInit {

  vehicles: Vehicles

  vehicleForm: FormGroup = new FormGroup({
    vehicle_type: new FormControl('',[Validators.required]),
    type: new FormControl('',[Validators.required]),
    fuel: new FormControl('',[Validators.required]),
    vin: new FormControl('',[Validators.required]),
    registration_no: new FormControl('',[Validators.required]),
    brand: new FormControl('',[Validators.required]),
    model: new FormControl('',[Validators.required]),
    year: new FormControl('',[Validators.required]),
  });
  

  idEdit: number

  constructor(private httpClient: HttpClient, private router: ActivatedRoute, private r:Router) { 
    
  }
  ngOnInit(): void {
    this.idEdit = this.router.snapshot.params.id
    this.getVehicle()
  }

  getVehicle() {
    this.httpClient
     .get<Driver[]>(environment.apiUrl + '/vehicles/' + this.idEdit)
     .subscribe((data) => {
      this.vehicles = <Vehicles>(data as any).data;
      this.vehicleForm.setValue(
        {
        vehicle_type: this.vehicles.vehicle_type,
        type: this.vehicles.type,
        fuel: this.vehicles.fuel,
        vin: this.vehicles.vin,
        registration_no: this.vehicles.registration_no,
        brand: this.vehicles.brand,
        model: this.vehicles.model,
        year: this.vehicles.year,
        })
     });
     
 }

  onSubmit(e:Event){
    e.preventDefault()
    if(this.vehicleForm.valid) {
      this.httpClient
          .put<Driver>(environment.apiUrl + '/vehicles/' + this.idEdit,this.vehicleForm.value)
          .subscribe((data) => {
            Swal.fire(
              'Cambios Guardados!',
              'La operación fue exitosa!',
              'success'
            ).then(() => {
              this.r.navigate(['/vehicles']);
            });
          });
    }
    else this.vehicleForm.markAllAsTouched()
  }

}
