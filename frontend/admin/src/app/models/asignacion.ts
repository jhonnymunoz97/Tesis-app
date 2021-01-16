import { Driver } from './driver';
import { Ruta } from './ruta';

export class Asignacion {
  driverID: string;
  rutaID: string;
  drivers?: Driver[];
  ruta?: Ruta;
}
