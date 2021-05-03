import { AgmGeocoder } from '@agm/core';
import { Injectable } from '@angular/core';
import { AngularFireList, AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Marker } from '../models/marker';
import { Ruta } from '../models/ruta';

@Injectable({
  providedIn: 'root',
})
export class RutasService {
  // Este contendra una Coleccion de Rutaes de la DB.
  private rutasDB: AngularFireList<Ruta>;

  constructor(private db: AngularFireDatabase) {
    // ? Accedemos a la base de datos de firebase.
    // ? Vamos a acceder la lista de rutas en la db.
    // ? y se implementa la funcionalidad en el segundo argumento.
    // ? La referencia que es nuestra lista de rutas, se va a ordenar por name.
    this.rutasDB = this.db.list('/rutas', (ref) =>
      ref.orderByChild('last_login')
    );
  }

  // Devuelve un Observable de tipo Ruta Array.
  getRutas(): Observable<Ruta[]> {
    // ? this.rutasDB ya tiene la base de datos.
    // ? snapshotChanges obtiene la informacion en este momento.
    // ? Obtiene los datos junto con la Key
    // ? Con Pipe permite hacer modificaciones
    // ? Con Map haremos un cambio, que por cada uno de los rutas retornaremos la informacion,
    // ? y se Agregue una Key.
    // ? El formato de key siempre es $key.
    // ? Payload es por donde esta viajando la data.
    return this.rutasDB.snapshotChanges().pipe(
      // ?A veces hay que importar map manualmente de rsjs/operators
      map((changes) => {
        return changes.map((c) => ({
          $key: c.payload.key,
          ...c.payload.val(),
        }));
      })
    );
  }

  // Metodo para crear un nuevo ruta en la DB
  addRuta(ruta: Ruta) {
    // ?Con esto FireBase se encarga de todo,
    // ?no hay que pensar en endpoints o si esta o no creada la tabla.
    // ?Adicionamos un nuevo record a la tabla.
    return this.rutasDB.push(ruta).then(() => {
      Swal.fire(
        'Cambios Guardados!',
        'La operación fue exitosa!',
        'success'
      ).then(() => {
        window.location.reload();
      });
    });
  }

  // Borrar un Ruta de la DB
  deleteRuta(id: string) {
    // ? Que base de datos afectaremos? Rutaes.
    // ? El id del ruta que deseamos eliminar.
    this.db
      .list('/rutas')
      .remove(id)
      .then(() => {
        Swal.fire(
          'Cambios Guardados!',
          'La operación fue exitosa!',
          'success'
        ).then(() => {
          window.location.reload();
        });
      });
  }

  // Editar un Ruta
  editRuta(newRutaData) {
    // ? Salvamos el Key.
    // ? Eliminamos el registro anterior con el Key.
    // ? Nuevamente asignamos a ese registro la nueva información en la base de datos.
    // ? FireBase no acepta que ya se contenga una Key, por eso se hizo la Key opcional.
    // ? Al borrar o actualizar daria problema sino fuera opcional.
    const $key = newRutaData.$key;
    delete newRutaData.$key;
    this.db
      .list('/rutas')
      .update($key, newRutaData)
      .then(() => {
        Swal.fire(
          'Cambios Guardados!',
          'La operación fue exitosa!',
          'success'
        ).then(() => {
          window.location.reload();
        });
      });
  }

}
