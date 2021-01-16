import { Injectable } from '@angular/core';
import { AngularFireList, AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Asignacion } from '../models/asignacion';

@Injectable({
  providedIn: 'root',
})
export class AsignacionsService {
  // Este contendra una Coleccion de Asignaciones de la DB.
  private asignacionesDB: AngularFireList<Asignacion>;

  constructor(private db: AngularFireDatabase) {
    // ? Accedemos a la base de datos de firebase.
    // ? Vamos a acceder la lista de asignaciones en la db.
    // ? y se implementa la funcionalidad en el segundo argumento.
    // ? La referencia que es nuestra lista de asignaciones, se va a ordenar por name.
    this.asignacionesDB = this.db.list('/asignaciones', (ref) =>
      ref.orderByChild('last_login')
    );
  }

  // Devuelve un Observable de tipo Asignacion Array.
  getAsignacions(): Observable<Asignacion[]> {
    // ? this.asignacionesDB ya tiene la base de datos.
    // ? snapshotChanges obtiene la informacion en este momento.
    // ? Obtiene los datos junto con la Key
    // ? Con Pipe permite hacer modificaciones
    // ? Con Map haremos un cambio, que por cada uno de los asignaciones retornaremos la informacion,
    // ? y se Agregue una Key.
    // ? El formato de key siempre es $key.
    // ? Payload es por donde esta viajando la data.
    return this.asignacionesDB.snapshotChanges().pipe(
      // ?A veces hay que importar map manualmente de rsjs/operators
      map((changes) => {
        return changes.map((c) => ({
          $key: c.payload.key,
          ...c.payload.val(),
        }));
      })
    );
  }

  // Metodo para crear un nuevo asignacion en la DB
  addAsignacion(asignacion: Asignacion) {
    // ?Con esto FireBase se encarga de todo,
    // ?no hay que pensar en endpoints o si esta o no creada la tabla.
    // ?Adicionamos un nuevo record a la tabla.
    return this.asignacionesDB.push(asignacion);
  }

  // Borrar un Asignacion de la DB
  deleteAsignacion(id: string) {
    // ? Que base de datos afectaremos? Asignaciones.
    // ? El id del asignacion que deseamos eliminar.
    this.db.list('/asignaciones').remove(id);
  }

  // Editar un Asignacion
  editAsignacion(newAsignacionData) {
    // ? Salvamos el Key.
    // ? Eliminamos el registro anterior con el Key.
    // ? Nuevamente asignamos a ese registro la nueva información en la base de datos.
    // ? FireBase no acepta que ya se contenga una Key, por eso se hizo la Key opcional.
    // ? Al borrar o actualizar daria problema sino fuera opcional.
    const $key = newAsignacionData.$key;
    delete newAsignacionData.$key;
    this.db
      .list('/asignaciones')
      .update($key, newAsignacionData)
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
