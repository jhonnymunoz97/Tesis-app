import 'dart:ffi';

import 'package:firebase_database/firebase_database.dart';

class Ruta {
  // ignore: unused_field
  DatabaseReference _id;
  String name;
  Location origin;
  Location destination;
  List<Waypoint> waypoints;
}

class Location {
  Float lat;
  Float lng;
}

class Waypoint {
  Location location;
  bool stopover;
}
