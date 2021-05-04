import { Ruta } from './ruta';
import { User } from './user';

export class Driver extends User {
  dni: string;
  name: string;
  surname: string;
  email: string;
  telefono: string;
  licencia: string;
  last_login: Date;
  location?: any;

  id: number;

  verified: boolean;
  role: string;
  profilePhoto: string = 'https://i.pravatar.cc/1000';
  // tslint:disable-next-line: variable-name
  access_token?: any;
}
