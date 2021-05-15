import { AgmGeocoder } from '@agm/core';
import { Component, OnInit } from '@angular/core';
import getRandomColor from 'src/app/helpers/randomNumber';
import { Marker } from 'src/app/models/marker';
import { Ruta } from 'src/app/models/ruta';
import { MarkerService } from 'src/app/services/marker.service';
import { RutasService } from 'src/app/services/rutas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-markers',
  templateUrl: './markers.component.html',
  styleUrls: ['./markers.component.scss'],
})
export class MarkersComponent implements OnInit {
  indexMarker: number = null;
  allowEdit = false;
  selectedRutaView: Ruta = null;
  lat = -1.0536352662907524;
  zoom = 14;
  lng = -80.45873811700869;
  rutas: Ruta[] = [];
  selectedMarker: Marker;
  markers: Marker[] = [];
  center: { lat: any; lng: any };
  colors: string[];
  color: string;
  constructor(
    private rutasService: RutasService,
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
    this.getAllMarkers();
  }

  getAllMarkers() {
    this.colors = [];
    this.rutasService.getRutas().subscribe((rutas: Ruta[]) => {
      this.rutas = rutas;
      this.markers = [];
      rutas.forEach(async (ruta: Ruta) => {
        this.colors.push(await getRandomColor());
      });
    });
  }

  onCenterChange(evt) {
    const { lat, lng } = evt;
    this.center = { lat, lng };
  }

  createMarker() {
    this.zoom = 19;
    this.selectedMarker = {
      lat: this.center.lat,
      lng: this.center.lng,
    };
    this.isNew = true;
    this.isEditing = false;
    this.isShow = false;
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
        this.lng = marker.lng;
        this.lng = marker.lng;
      });
  }

  showMarker(i: number) {
    this.indexMarker = i;
    this.zoom = 13;
    this.selectedMarker = this.markers[i];
    this.lat = this.markers[i].lat;
    this.lng = this.markers[i].lng;
    this.isShow = true;
    this.zoom = 19;
  }
  editMarker(i: number) {
    this.indexMarker = i;
    this.zoom = 13;
    this.selectedMarker = this.markers[i];
    this.lat = this.markers[i].lat;
    this.lng = this.markers[i].lng;
    this.isShow = false;
    this.isNew = false;
    this.isEditing = true;
    this.zoom = 18;
  }

  saveMarker() {
    if (!this.markers) {
      this.markers = [];
    }
    if (this.isNew) {
      this.markers.push(this.selectedMarker);
      this.selectedRutaView.markers = this.markers;
      this.rutasService.editRuta(this.selectedRutaView);
      // this.markerService.addMarker(this.selectedMarker).then(() => {});
    } else if (this.isEditing) {
      this.rutasService.editRuta(this.selectedRutaView);
    }
  }

  showMarkersOfRuta(i: number) {
    this.color = this.colors[i];
    this.allowEdit = true;
    this.selectedRutaView = this.rutas[i];
    this.markers = [];
    this.markers = this.rutas[i].markers;
  }

  removeMarker(index) {
    Swal.fire({
      title: 'Estás seguro?',
      text: 'Esta acción no puede deshacerse!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, borrar!',
      cancelButtonText: 'Cancelar!',
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.selectedRutaView.markers.length == 1) {
          this.selectedRutaView.markers = [];
        } else {
          this.selectedRutaView.markers = this.selectedRutaView.markers.splice(
            index,
            1
          );
        }
        this.rutasService.editRuta(this.selectedRutaView);
      }
    });
  }
}
