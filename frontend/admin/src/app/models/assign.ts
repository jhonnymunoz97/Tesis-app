import { Driver } from './driver';
import { Ruta } from './ruta';

export class Horario {
  road: Ruta;
  day: string;
  start_hour: string;
  end_hour: string;
}

export class Assign {
  driver_id: number;
  driver?: Driver;
  horarios: Horario[] = [];
  start_date: Date;
  end_date?: Date;
}
