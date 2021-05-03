import { Component, OnInit } from '@angular/core';
import { Marker } from 'src/app/models/marker';
import { Ruta } from 'src/app/models/ruta';
import { RutasService } from 'src/app/services/rutas.service';

@Component({
  selector: 'app-markers',
  templateUrl: './markers.component.html',
  styleUrls: ['./markers.component.scss'],
})
export class MarkersComponent implements OnInit {
  selectedRutaView: Ruta = null;
  lat = -1.0168547484192896;
  zoom = 14;
  lng = -80.45206653126932;
  rutas: Ruta[] = [];
  marker: Marker = new Marker();
  constructor(private rutasService: RutasService) {}
  isEditing = false;
  isNew = false;
  editada: Ruta = {
    destination: null,
    name: null,
    origin: null,
    waypoints: null,
  };
  ngOnInit(): void {
    this.getRutas();
  }
  getRutas() {
    this.rutasService.getRutas().subscribe((rutas: Ruta[]) => {
      this.rutas = rutas;
    });
  }
  showRuta(ruta: Ruta) {
    this.isEditing = false;

    this.selectedRutaView = ruta;
    this.editada.$key = ruta.$key;
    this.editada.name = ruta.name;
    this.editada.origin = ruta.origin;
    this.editada.destination = ruta.destination;
    if (ruta.waypoints) {
      this.editada.waypoints = ruta.waypoints;
      this.editada.waypoints = [];
    }
  }
  onCenterChange(evt) {
    const { lat, lng } = evt;
    this.marker = { lat, lng };
  }
}
