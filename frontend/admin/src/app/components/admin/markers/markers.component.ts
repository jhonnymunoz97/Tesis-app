import { AgmGeocoder } from '@agm/core';
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
  lat = -1.0536352662907524;
  zoom = 14;
  lng = -80.45873811700869;
  rutas: Ruta[] = [];
  selectedMarker: Marker;
  markers: Marker[] = [];
  constructor(
    private rutasService: RutasService,
    private geocoder: AgmGeocoder
  ) {}
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
    this.selectedMarker = { lat, lng };
  }

  createMarker() {
    this.zoom = 18;
    this.selectedMarker = new Marker();
    this.isNew = true;
  }

  showEvent(evt) {
    this.getAddress({
      lat: evt.latLng.lat(),
      lng: evt.latLng.lng(),
    });
  }

  getAddress(marker: Marker) {
    this.selectedMarker.title = 'Cargando...';
    this.geocoder
      .geocode({
        location: {
          lat: marker.lat,
          lng: marker.lng,
        },
      })
      .subscribe((data) => {
        this.selectedMarker = {
          title: data[0].formatted_address,
          lat: data[0].geometry.location.lat(),
          lng: data[0].geometry.location.lng(),
        };
      });
  }
  onMouseOver(infoWindow, gm) {
    if (gm.lastOpen != null) {
      gm.lastOpen.close();
    }
    gm.lastOpen = infoWindow;
    infoWindow.open();
  }

  saveMarker() {
    console.log(this.selectedMarker);
  }
}
