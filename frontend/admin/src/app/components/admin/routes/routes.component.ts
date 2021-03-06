import { Component, OnInit } from '@angular/core';
import { repeat } from 'rxjs/operators';
import { Location, Ruta } from 'src/app/models/ruta';
import { DriverService } from 'src/app/services/driver.service';
import { RutasService } from 'src/app/services/rutas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-routes',
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.scss'],
})
export class RoutesComponent implements OnInit {
  isEditing = false;
  isNew = false;
  editada: Ruta = {
    destination: null,
    name: null,
    origin: null,
    waypoints: null,
  };
  rutas: Ruta[] = [];
  selectedRuta: Ruta = null;
  selectedRutaView: Ruta = null;
  lat = -1.0168547484192896;
  lng = -80.45206653126932;
  zoom = 14;

  renderOptions = {
    draggable: true,
  };
  newWP;

  constructor(private rutasService: RutasService) {
    this.rutas.push();
  }

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
    this.isNew = false;
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
  editRuta(ruta: Ruta) {
    this.showRuta(ruta);
    this.isEditing = true;
  }
  saveRuta() {
    if (this.isNew) {
      delete this.editada.$key;
      this.rutasService.addRuta(this.editada);
    } else {
      this.rutasService.editRuta(this.editada);
    }
  }
  public async change(event) {
    if (event.request.origin) {
      if (
        typeof event.request.origin.lat == 'function' &&
        typeof event.request.origin.lng == 'function'
      ) {
        this.editada.origin = {
          lat: event.request.origin.lat(),
          lng: event.request.origin.lng(),
        };
      }
    }

    if (event.request.destination) {
      if (
        typeof event.request.destination.lat == 'function' &&
        typeof event.request.destination.lng == 'function'
      ) {
        this.editada.destination = {
          lat: event.request.destination.lat(),
          lng: event.request.destination.lng(),
        };
      }
    }

    if (event.request.destination) {
      if (event.request.destination.location) {
        this.editada.destination = {
          lat: event.request.destination.location.lat(),
          lng: event.request.destination.location.lng(),
        };
      }
    }
    if (event.request.waypoints) {
      const oldWP = this.selectedRutaView.waypoints;
      if (event.request.waypoints) {
        let newWP: Location[] = event.request.waypoints.map((wp) => {
          if (wp.location) {
            if (typeof wp.location.lat == 'function') {
              const nuevaLocation: {
                location: { lat: number; lng: number };
              } = {
                location: {
                  lat: wp.location.lat(),
                  lng: wp.location.lng(),
                },
              };
              delete wp.location;
              wp.location = nuevaLocation;
            }
          }
          return wp;
        });
        if (JSON.stringify(oldWP) != JSON.stringify(newWP)) {
          this.editada.waypoints = newWP;
        }
      }
    }
  }
  nuevaRuta() {
    this.showRuta({
      destination: { lat: -1.0587918154251523, lng: -80.46483502069046 },
      origin: { lat: -1.0446517157613564, lng: -80.47741767150812 },
      name: 'Ruta ',
    });
    this.isNew = true;
  }

  deleteRuta(ruta: Ruta) {
    Swal.fire({
      title: 'Est?? Seguro?',
      text: 'Esta acci??n no puede revertirse!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'S??, borrar!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.rutasService.deleteRuta(ruta.$key);
      }
    });
  }
}
