import { Driver } from './driver';
import { Ruta } from './ruta';

export class Horario {
  road: Ruta = null;
  day: string = null;
  start_hour: string;
  end_hour: string;
}

export class Assign {
  id?: number;
  driver_id: number = null;
  vehicle_id: number = null;
  driver?: Driver;
  horarios: Horario[] = [];
  start_date: Date;
  end_date?: Date;
}
