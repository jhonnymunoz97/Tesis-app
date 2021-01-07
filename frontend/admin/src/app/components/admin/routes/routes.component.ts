import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Location, Ruta } from 'src/app/models/ruta';
import { RutasService } from 'src/app/services/rutas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-routes',
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.scss'],
})
export class RoutesComponent implements OnInit {
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
    /* this.rutasService.addRuta({
      destination: { lat: -1.0587918154251523, lng: -80.46483502069046 },
      origin: { lat: -1.0446517157613564, lng: -80.47741767150812 },
      name: 'Ruta 1',
    }); */
    this.getRutas();
  }

  getRutas() {
    this.rutasService.getRutas().subscribe((rutas: Ruta[]) => {
      this.rutas = rutas;
    });
  }

  showRuta(ruta: Ruta) {
    this.selectedRutaView = ruta;
    this.editada.$key = ruta.$key;
    this.editada.name = ruta.name;
    this.editada.origin = ruta.origin;
    this.editada.destination = ruta.destination;
    this.editada.waypoints = ruta.waypoints;
  }
  saveRuta() {
    this.rutasService.editRuta(this.editada);
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
}
