import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_database/firebase_database.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'dart:async';
import 'package:floating_action_row/floating_action_row.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:usuario_app/login_screen.dart';

// Import the firebase_core plugin
final databaseReference = FirebaseDatabase.instance.reference();

class ChooseRoute extends StatefulWidget {
  ChooseRoute({Key key}) : super(key: key);
  @override
  _ChooseRouteState createState() => _ChooseRouteState();
}

class _ChooseRouteState extends State<ChooseRoute> {
  var rutas = [];
  GoogleSignInAccount _currentUser;
  final GoogleSignIn _googleSignIn = GoogleSignIn();
  final FirebaseAuth auth = FirebaseAuth.instance;
  @override
  void initState() {
    super.initState();
    _googleSignIn.onCurrentUserChanged.listen((GoogleSignInAccount account) {
      setState(() {
        _currentUser = account;
      });
      if (_currentUser != null) {
        getAllRutas();
        build(context);
      }
    });
    _googleSignIn.signInSilently();
  }

  Completer<GoogleMapController> _controller = Completer();
  int index = 0;

  static CameraPosition _kGooglePlex = CameraPosition(
    target: LatLng(-1.05458, -80.45445),
    zoom: 14.4746,
  );
  final GlobalKey<ScaffoldState> scaffoldKey = GlobalKey<ScaffoldState>();
  final SnackBar snackBar =
      const SnackBar(content: Text('Ruta cambiada con éxito'));
  @override
  Widget build(BuildContext context) {
    return new Scaffold(
        key: scaffoldKey,
        appBar: AppBar(
          title: Text(_currentUser.displayName),
          actions: <Widget>[
            IconButton(
              icon: const Icon(Icons.save),
              tooltip: 'Guardar tu ruta',
              onPressed: () {
                setState(() {
                  databaseReference.child('notifications').set({
                    _currentUser.id: {
                      'user': _currentUser.email,
                      'ruta': rutas[index],
                    }
                  });
                });
              },
            ),
            IconButton(
              icon: const Icon(Icons.person),
              tooltip: 'Cuenta',
              onPressed: () {
                openPage(context);
              },
            ),
          ],
        ),
        body: Stack(
          children: <Widget>[
            Container(
              width: MediaQuery.of(context).size.width,
              height: MediaQuery.of(context).size.height,
              child: GoogleMap(
                mapType: MapType.hybrid,
                initialCameraPosition: _kGooglePlex,
                zoomControlsEnabled: true,
                compassEnabled: true,
                rotateGesturesEnabled: true,
                scrollGesturesEnabled: true,
                tiltGesturesEnabled: true,
                zoomGesturesEnabled: true,
                myLocationEnabled: true,
                mapToolbarEnabled: true,
                onMapCreated: (GoogleMapController controller) {
                  _controller.complete(controller);
                },
              ),
            ),
            Positioned.fill(
              bottom: 10,
              child: Align(
                alignment: Alignment.bottomCenter,
                child: FloatingActionRow(
                  color: Colors.blueAccent,
                  children: <Widget>[
                    FloatingActionRowButton(
                        icon: Icon(Icons.arrow_back),
                        onTap: () {
                          setState(() {
                            index--;
                            if (index < 0) {
                              index = rutas.length - 1;
                            }
                          });
                        }),
                    FloatingActionRowDivider(),
                    Padding(
                      padding: EdgeInsets.all(10),
                      child: Text(
                        (index + 1).toString(),
                        style: TextStyle(fontSize: 25, color: Colors.white),
                      ),
                    ),
                    FloatingActionRowDivider(),
                    FloatingActionRowButton(
                        icon: Icon(Icons.arrow_forward),
                        onTap: () {
                          if (index <= (rutas.length - 1)) {
                            setState(() {
                              index++;
                              if ((index + 1) > rutas.length) {
                                index = 0;
                              }
                            });
                          }
                        }),
                  ],
                ),
              ),
            ),
            Positioned.fill(
                top: 30,
                child: Align(
                    alignment: Alignment.topCenter,
                    child: Text(
                      (rutas.length > 0 && rutas[index] != null)
                          ? rutas[index]['name']
                          : 'Seleccione una ruta y Guárdela',
                      style: TextStyle(
                          color: Colors.white,
                          fontSize: 20,
                          backgroundColor: Colors.black45,
                          height: 1),
                    )))
          ],
        ));
  }

  void openPage(BuildContext context) {
    Navigator.push(context, MaterialPageRoute(
      builder: (BuildContext context) {
        return Scaffold(
          appBar: AppBar(
            title: const Text('Cuenta'),
          ),
          body: Column(
            mainAxisSize: MainAxisSize.min,
            children: <Widget>[
              Center(
                child: Text(
                  _currentUser.displayName,
                  style: TextStyle(
                      fontSize: 25,
                      fontWeight: FontWeight.bold,
                      color: Colors.black54),
                ),
              ),
              SizedBox(height: 40),
              Image.asset(
                _currentUser.photoUrl,
                scale: 5,
              ),
              SizedBox(height: 40),
              RaisedButton(
                onPressed: () {
                  signOutGoogle();
                  Navigator.of(context).pushAndRemoveUntil(
                      MaterialPageRoute(builder: (context) {
                    return LoginScreen();
                  }), ModalRoute.withName('/'));
                },
                color: Colors.black,
                child: Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: Text(
                    'Salir',
                    style: TextStyle(fontSize: 25, color: Colors.white),
                  ),
                ),
                elevation: 5,
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(40)),
              )
            ],
          ),
        );
      },
    ));
  }

  void signOutGoogle() async {
    await _googleSignIn.signOut();
  }

  void getAllRutas() {
    databaseReference.once().then((DataSnapshot snapshot) {
      var rt = [];
      Map<dynamic, dynamic> values = snapshot.value;
      values.forEach((key, value) {
        if (key == "rutas") {
          value.forEach((key, val) {
            rt.add(val);
          });
        }
      });
      setState(() {
        rutas = rt;
      });
    });
  }
}
