import { AngularFireDatabase, AngularFireList } from "@angular/fire/database";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { User } from "../models/user";

@Injectable({
  providedIn: "root",
})
export class UserService {
  // Este contendra una Coleccion de Useres de la DB.
  private usersDB: AngularFireList<User>;

  constructor(private db: AngularFireDatabase) {
    // ? Accedemos a la base de datos de firebase.
    // ? Vamos a acceder la lista de users en la db.
    // ? y se implementa la funcionalidad en el segundo argumento.
    // ? La referencia que es nuestra lista de users, se va a ordenar por name.
    this.usersDB = this.db.list("/users");
  }

  // Devuelve un Observable de tipo User Array.
  getUsers(): Observable<User[]> {
    // ? this.usersDB ya tiene la base de datos.
    // ? snapshotChanges obtiene la informacion en este momento.
    // ? Obtiene los datos junto con la Key
    // ? Con Pipe permite hacer modificaciones
    // ? Con Map haremos un cambio, que por cada uno de los users retornaremos la informacion,
    // ? y se Agregue una Key.
    // ? El formato de key siempre es $key.
    // ? Payload es por donde esta viajando la data.
    return this.usersDB.snapshotChanges().pipe(
      // ?A veces hay que importar map manualmente de rsjs/operators
      map((changes) => {
        return changes.map((c) => ({
          $key: c.payload.key,
          ...c.payload.val(),
        }));
      })
    );
  }

  // Metodo para crear un nuevo user en la DB
  addUser(user: any) {
    // ?Con esto FireBase se encarga de todo,
    // ?no hay que pensar en endpoints o si esta o no creada la tabla.
    // ?Adicionamos un nuevo record a la tabla.
    return this.usersDB.push(user);
  }

  // Borrar un User de la DB
  deleteUser(id: string) {
    // ? Que base de datos afectaremos? Useres.
    // ? El id del user que deseamos eliminar.
    this.db.list("/users").remove(id);
  }

  // Editar un User
  editUser(newUserData: User) {
    const key = newUserData.$key;
    delete newUserData.$key;
    // ? Salvamos el Key.
    // ? Eliminamos el registro anterior con el Key.
    // ? Nuevamente asignamos a ese registro la nueva información en la base de datos.
    // ? FireBase no acepta que ya se contenga una Key, por eso se hizo la Key opcional.
    // ? Al borrar o actualizar daria problema sino fuera opcional.
    return this.db.object(`users/${key}`).set(newUserData);
  }
}
