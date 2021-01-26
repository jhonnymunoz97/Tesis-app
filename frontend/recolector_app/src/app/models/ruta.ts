import { Driver } from "./driver";

export interface Ruta {
  $key?: any;
  origin: Location;
  name: string;
  destination: Location;
  waypoints?: Location[];
  driver?: Driver;
}
export class Location {
  lat: number;
  lng: number;
  location?: any;
}
export class WayPoint {
  location: { location: Location };
}
