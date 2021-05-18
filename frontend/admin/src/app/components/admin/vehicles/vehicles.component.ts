import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Driver } from 'src/app/models/driver';
import { Vehicles } from 'src/app/models/vehicles';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.scss']
})
export class VehiclesComponent implements OnInit {

  
  vehicles: Driver[] = []
  verify: boolean = false

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
  
  p: number = 1;

  constructor(private httpClient: HttpClient, private router: Router) { 
    
  }

  ngOnInit(): void {
    this.getVehicles(false);
  }

  getVehicles(verify:boolean) {
     this.verify = verify 
     this.httpClient
      .get<Driver[]>(environment.apiUrl + '/vehicles')
      .subscribe((data) => {
        this.vehicles = data
      });
      if(verify) return
      else this.getVehicles(true)
  }

  onSubmit(e:Event){
    e.preventDefault()
    if(this.vehicleForm.valid) {
      this.httpClient
          .post<Driver>(environment.apiUrl + '/vehicles', this.vehicleForm.value)
          .subscribe((data) => {
            console.log(data)
            Swal.fire(
              'Cambios Guardados!',
              'La operación fue exitosa!',
              'success'
            ).then(() => {
              window.location.reload();
            });
          });
    }
    else this.vehicleForm.markAllAsTouched()
  }

}
