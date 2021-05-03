import { AgmGeocoder } from '@agm/core';
import { Component, OnInit } from '@angular/core';
import { Marker } from 'src/app/models/marker';
import { Ruta } from 'src/app/models/ruta';
import { MarkerService } from 'src/app/services/marker.service';
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
    private markerService: MarkerService,
    private geocoder: AgmGeocoder
  ) {}
  isEditing = false;
  isNew = false;
  isShow = false;
  editada: Ruta = {
    destination: null,
    name: null,
    origin: null,
    waypoints: null,
  };
  ngOnInit(): void {
    this.getMarkers();
  }
  getMarkers() {
    this.markerService.getMarkers().subscribe((markers: Marker[]) => {
      this.markers = markers;
      console.log(this.markers);
    });
  }

  onCenterChange(evt) {
    const { lat, lng } = evt;
    this.selectedMarker = { lat, lng };
  }

  createMarker() {
    this.zoom = 18;
    this.selectedMarker = new Marker();
    this.isNew = true;
    this.isEditing = false;
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
        this.selectedMarker.title = data[0].formatted_address;
        this.selectedMarker.lat = marker.lat;
        this.selectedMarker.lng = marker.lng;
      });
  }

  showMarker(marker: Marker) {
    this.zoom = 13;
    this.selectedMarker = marker;
    this.lat = marker.lat;
    this.lng = marker.lng;
    this.isShow = true;
    this.zoom = 18;
  }
  editMarker(marker: Marker) {
    this.zoom = 13;
    this.selectedMarker = marker;
    this.lat = marker.lat;
    this.lng = marker.lng;
    this.isShow = false;
    this.isNew = false;
    this.isEditing = true;
    this.zoom = 18;
  }

  saveMarker() {
    if (this.isNew) {
      delete this.selectedMarker.$key;
      console.log(this.selectedMarker);
      this.markerService.addMarker(this.selectedMarker).then(() => {});
    } else if (this.isEditing) {
      this.markerService.editMarker(this.selectedMarker);
    }
  }
}
