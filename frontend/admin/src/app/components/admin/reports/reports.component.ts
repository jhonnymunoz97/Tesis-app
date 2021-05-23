import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { repeat } from 'rxjs/operators';
import { Driver } from 'src/app/models/driver';
import { Ruta } from 'src/app/models/ruta';
import { RutasService } from 'src/app/services/rutas.service';
import { environment } from 'src/environments/environment';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { MyDTOptions } from 'src/app/helpers/MyDtOptions';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  users: User[] = []
  vehicles: Driver[] = []
  rutas: Ruta[] = [];
  
  role: string = ''
  user_selected = false


  
  option:any = {
    users: false,
    vehicles: false,
    routes: false,
    points: false
  }

  lat = -1.0168547484192896;
  lng = -80.45206653126932;
  zoom = 14;
  selectedRutaView: Ruta = null;

  dtOptionsV: DataTables.Settings = {};
  dtOptionsR: DataTables.Settings = {};
  dtOptionsU: DataTables.Settings = {};


  dtTriggerV: Subject<any>
  dtTriggerR: Subject<any> 
  dtTriggerU: Subject<any> 
  constructor(private httpClient: HttpClient, private rutasService: RutasService) {
    
  }

 /*  downloadPDF(object:string) {
    // Extraemos el
    const DATA = document.getElementById(object);
    const doc = new jsPDF('p', 'pt', 'a4');
    const options = {
      background: 'white',
      scale: 3
    };
    html2canvas(DATA, options).then((canvas) => {

      const img = canvas.toDataURL('image/PNG');

      // Add image Canvas to PDF
      const bufferX = 15;
      const bufferY = 15;
      const imgProps = (doc as any).getImageProperties(img);
      const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');
      return doc;
    }).then((docResult) => {
      docResult.save(`${new Date().toISOString()}_report.pdf`);
    });
  } */
  
  ngOnInit(): void {
    this.getRutas()
    this.getVehicles()    
    this.dtOptionsV = MyDTOptions;
    this.dtOptionsR = MyDTOptions;
    this.dtOptionsU = MyDTOptions;
  }

  activeLink(option:string){
    if(option=='users'){
      this.option.users = true
      //this.getUser()
      //this.dtTriggerU =  new Subject<any>();
      
    }
    else this.option.users = false
    if(option=='points') this.option.points = true
    else this.option.points = false
    if(option=='vehicles') {
      this.option.vehicles = true
      this.user_selected = false
      this.getVehicles()
    }
    else this.option.vehicles = false
    if(option=='routes'){
      this.option.routes = true
      this.user_selected = false
      this.rutas = []
      this.getRutas()
    }
    else this.option.routes = false
  }

  getUser() {
    let t = new Subject<any>(); 
    this.httpClient
      .get<User[]>(environment.apiUrl + '/users')
      .subscribe((data) => {
        if(this.role!='Todos')
          this.users = ((data as any).data as User[]).filter(dat=>{
            if(dat.role == this.role) return true
          })
        else this.users = ((data as any).data as User[])
        t.next()
      });
     this.dtTriggerU = t
  }

  getVehicles() {
    this.dtTriggerV = new Subject<any>();
    this.httpClient
      .get<Driver[]>(environment.apiUrl + '/vehicles')
      .subscribe((data) => {
        this.vehicles = data
        this.dtTriggerV.next();
      });
  }

  getRutas() {
    this.dtTriggerR = new Subject<any>();
    this.rutasService.getRutas().subscribe((rutas: Ruta[]) => {
      this.rutas = rutas;
      this.dtTriggerR.next();
    });
  }

  /* generarPDF(){
    if(this.option.drivers) this.downloadPDF('reportDrivers')
    if(this.option.vehicles) this.downloadPDF('reportVehicles')
    if(this.option.routes) this.downloadPDF('reportRoutes')
  } */

  VerifyUser(){
   this.getUser()
   this.user_selected = true
  }

}
