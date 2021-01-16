import { Ruta } from './ruta';

export interface Driver {
  $key?: string; // Angular necesita este campo.
  id?: number | string;
  dni: string;
  name: string;
  surname: string;
  email: string;
  telefono: string;
  licencia: string;
  last_login: Date;
  location?: any;
  verified?: boolean;
  ruta?: Ruta;
}
