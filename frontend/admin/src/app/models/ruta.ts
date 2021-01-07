export interface Ruta {
  $key?: any;
  origin: Location;
  name: string;
  destination: Location;
  waypoints?: Location[];
}
export class Location {
  lat: number;
  lng: number;
  location?: any;
}
export class WayPoint {
  location: { location: Location };
}
