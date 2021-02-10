import { Injectable } from "@angular/core";
import { AngularFireList, AngularFireDatabase } from "@angular/fire/database";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Ruta } from "../models/ruta";
import { User } from "../models/user";

@Injectable({
  providedIn: "root",
})
export class NotiService {
  // Este contendra una Coleccion de Rutaes de la DB.
  private notificationsDB: AngularFireList<Ruta>;

  constructor(private db: AngularFireDatabase) {
    // ? Accedemos a la base de datos de firebase.
    // ? Vamos a acceder la lista de notifications en la db.
    // ? y se implementa la funcionalidad en el segundo argumento.
    this.notificationsDB = this.db.list("/notifications");
  }

  // Devuelve un Observable de tipo Ruta Array.
  getRutas(): Observable<Ruta[]> {
    // ? this.notificationsDB ya tiene la base de datos.
    // ? snapshotChanges obtiene la informacion en este momento.
    // ? Obtiene los datos junto con la Key
    // ? Con Pipe permite hacer modificaciones
    // ? Con Map haremos un cambio, que por cada uno de los notifications retornaremos la informacion,
    // ? y se Agregue una Key.
    // ? El formato de key siempre es $key.
    // ? Payload es por donde esta viajando la data.
    return this.notificationsDB.snapshotChanges().pipe(
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
  addRuta(ruta: any) {
    // ?Con esto FireBase se encarga de todo,
    // ?no hay que pensar en endpoints o si esta o no creada la tabla.
    // ?Adicionamos un nuevo record a la tabla.
    return this.notificationsDB.push(ruta);
  }

  // Borrar un Ruta de la DB
  deleteRuta(id: string) {
    // ? Que base de datos afectaremos? Rutaes.
    // ? El id del ruta que deseamos eliminar.
    this.db.list("/notifications").remove(id);
  }

  asign(ruta: Ruta, user: User) {
    // @ts-ignore
    return this.notificationsDB.push({ user: user.id, ruta: ruta });
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
    this.db.list("/notifications").update($key, newRutaData);
  }
}
