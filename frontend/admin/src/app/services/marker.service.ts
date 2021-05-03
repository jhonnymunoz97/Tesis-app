import { Injectable } from '@angular/core';
import { AngularFireList, AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Marker } from '../models/marker';

@Injectable({
  providedIn: 'root',
})
export class MarkerService {
  // Este contendra una Coleccion de Markeres de la DB.
  private markersDB: AngularFireList<Marker>;

  constructor(private db: AngularFireDatabase) {
    // ? Accedemos a la base de datos de firebase.
    // ? Vamos a acceder la lista de markers en la db.
    // ? y se implementa la funcionalidad en el segundo argumento.
    // ? La referencia que es nuestra lista de markers, se va a ordenar por name.
    this.markersDB = this.db.list(
      '/markers'
      /*, (ref) =>
      ref.orderByChild('last_login') */
    );
  }

  // Devuelve un Observable de tipo Marker Array.
  getMarkers(): Observable<Marker[]> {
    // ? this.markersDB ya tiene la base de datos.
    // ? snapshotChanges obtiene la informacion en este momento.
    // ? Obtiene los datos junto con la Key
    // ? Con Pipe permite hacer modificaciones
    // ? Con Map haremos un cambio, que por cada uno de los markers retornaremos la informacion,
    // ? y se Agregue una Key.
    // ? El formato de key siempre es $key.
    // ? Payload es por donde esta viajando la data.
    return this.markersDB.snapshotChanges().pipe(
      // ?A veces hay que importar map manualmente de rsjs/operators
      map((changes) => {
        return changes.map((c) => ({
          $key: c.payload.key,
          ...c.payload.val(),
        }));
      })
    );
  }

  // Metodo para crear un nuevo marker en la DB
  addMarker(marker: any) {
    // ?Con esto FireBase se encarga de todo,
    // ?no hay que pensar en endpoints o si esta o no creada la tabla.
    // ?Adicionamos un nuevo record a la tabla.
    return this.markersDB.push(marker).then(() => {
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Operación exitosa',
        text: 'Marcador agregado con éxito!',
        showConfirmButton: false,
        timer: 2500,
        width: 300,
      });
    });
  }

  // Borrar un Marker de la DB
  deleteMarker(id: string) {
    // ? Que base de datos afectaremos? Markeres.
    // ? El id del marker que deseamos eliminar.
    this.db
      .list('/markers')
      .remove(id)
      .then(() => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Operación exitosa',
          text: 'Marcador borrado con éxito!',
          showConfirmButton: false,
          timer: 2500,
          width: 300,
        });
      });
  }

  // Editar un Marker
  editMarker(newMarkerData) {
    // ? Salvamos el Key.
    // ? Eliminamos el registro anterior con el Key.
    // ? Nuevamente asignamos a ese registro la nueva información en la base de datos.
    // ? FireBase no acepta que ya se contenga una Key, por eso se hizo la Key opcional.
    // ? Al borrar o actualizar daria problema sino fuera opcional.
    const $key = newMarkerData.$key;
    delete newMarkerData.$key;
    this.db
      .list('/markers')
      .update($key, newMarkerData)
      .then(() => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Operación exitosa',
          text: 'Marcador modificado con éxito!',
          showConfirmButton: false,
          timer: 2500,
          width: 300,
        }).then(() => {
          window.location.reload();
        });
      });
  }
}
