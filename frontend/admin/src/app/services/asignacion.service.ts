import { Injectable } from '@angular/core';
import { AngularFireList, AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Assign } from '../models/assign';

@Injectable({
  providedIn: 'root',
})
export class AssignsService {
  // Este contendra una Coleccion de Assignes de la DB.
  private assignsDB: AngularFireList<Assign>;

  constructor(private db: AngularFireDatabase) {
    // ? Accedemos a la base de datos de firebase.
    // ? Vamos a acceder la lista de assigns en la db.
    // ? y se implementa la funcionalidad en el segundo argumento.
    // ? La referencia que es nuestra lista de assigns, se va a ordenar por name.
    this.assignsDB = this.db.list('/assigns');
  }

  // Devuelve un Observable de tipo Assign Array.
  getAssigns(): Observable<Assign[]> {
    // ? this.assignsDB ya tiene la base de datos.
    // ? snapshotChanges obtiene la informacion en este momento.
    // ? Obtiene los datos junto con la Key
    // ? Con Pipe permite hacer modificaciones
    // ? Con Map haremos un cambio, que por cada uno de los assigns retornaremos la informacion,
    // ? y se Agregue una Key.
    // ? El formato de key siempre es $key.
    // ? Payload es por donde esta viajando la data.
    return this.assignsDB.snapshotChanges().pipe(
      // ?A veces hay que importar map manualmente de rsjs/operators
      map((changes) => {
        return changes.map((c) => ({
          $key: c.payload.key,
          ...c.payload.val(),
        }));
      })
    );
  }

  // Metodo para crear un nuevo assignen la DB
  addAssign(assign: Assign) {
    // ?Con esto FireBase se encarga de todo,
    // ?no hay que pensar en endpoints o si esta o no creada la tabla.
    // ?Adicionamos un nuevo record a la tabla.
    return this.assignsDB.push({ ...assign });
  }

  // Borrar un Assign de la DB
  deleteAssign(id: string) {
    // ? Que base de datos afectaremos? Assignes.
    // ? El id del assignque deseamos eliminar.
    this.db.list('/assigns').remove(id);
  }

  // Editar un Assign
  editAssign(newAssignData) {
    // ? Salvamos el Key.
    // ? Eliminamos el registro anterior con el Key.
    // ? Nuevamente asignamos a ese registro la nueva información en la base de datos.
    // ? FireBase no acepta que ya se contenga una Key, por eso se hizo la Key opcional.
    // ? Al borrar o actualizar daria problema sino fuera opcional.
    const $key = newAssignData.$key;
    delete newAssignData.$key;
    this.db
      .list('/assigns')
      .update($key, newAssignData)
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
