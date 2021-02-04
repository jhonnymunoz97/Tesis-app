import 'dart:ui';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:usuario_app/View_Model/sign_in_view_model.dart';
import 'package:usuario_app/base/base_view.dart';
import 'package:usuario_app/splash.dart';
import 'package:usuario_app/utils/routeNames.dart';
import 'package:usuario_app/utils/util.dart';
import 'package:usuario_app/utils/view_state.dart';
import 'package:google_sign_in/google_sign_in.dart';

class LoginScreen extends StatefulWidget {
  @override
  _LoginScreenState createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  GlobalKey<FormState> _userLoginFormKey = GlobalKey();
  FirebaseUser _user;
  final FirebaseAuth _auth = FirebaseAuth.instance;
  final GoogleSignIn _googleSignIn = GoogleSignIn();

  bool isSignIn = false;
  bool google = false;

  @override
  Widget build(BuildContext context) {
    return BaseView<SignInViewModel>(
        onModelReady: (model) {},
        builder: (context, model, build) {
          return WillPopScope(
            child: SafeArea(
              child: Scaffold(
                backgroundColor: Color(0xFFE6E6E6),
                body: Stack(
                  children: <Widget>[
                    Container(
                      height: 410,
                      width: 430,
                      decoration: BoxDecoration(
                        image: DecorationImage(
                          image: AssetImage('assets/background.png'),
                          fit: BoxFit.contain,
                        ),
                      ),
                    ),
                    Container(
                      height: MediaQuery.of(context).size.height,
                      child: SingleChildScrollView(
                        child: Column(
                          children: <Widget>[
                            Container(
                              alignment: Alignment.center,
                              child: Form(
                                key: _userLoginFormKey,
                                child: Padding(
                                  padding: const EdgeInsets.only(
                                      top: 5.0,
                                      bottom: 15,
                                      left: 10,
                                      right: 10),
                                  child: Card(
                                    shape: RoundedRectangleBorder(
                                        borderRadius:
                                            BorderRadius.circular(20.0)),
                                    child: Container(
                                      alignment: Alignment.center,
                                      width: MediaQuery.of(context).size.width,
                                      child: Column(
                                        children: <Widget>[
                                          Padding(
                                            padding: const EdgeInsets.all(15.0),
                                            child: Text(
                                              "Ingresar",
                                              style: TextStyle(
                                                  fontWeight: FontWeight.w800,
                                                  fontSize: 25),
                                            ),
                                          ),
                                          InkWell(
                                            child: Container(
                                                width: deviceSize.width / 2,
                                                height: deviceSize.height / 18,
                                                margin:
                                                    EdgeInsets.only(top: 20),
                                                decoration: BoxDecoration(
                                                    borderRadius:
                                                        BorderRadius.circular(
                                                            20),
                                                    color: Colors.black),
                                                child: Center(
                                                    child: Row(
                                                  mainAxisAlignment:
                                                      MainAxisAlignment
                                                          .spaceEvenly,
                                                  children: <Widget>[
                                                    Container(
                                                      height: 30.0,
                                                      width: 30.0,
                                                      decoration: BoxDecoration(
                                                        image: DecorationImage(
                                                            image: AssetImage(
                                                                'assets/google.jpg'),
                                                            fit: BoxFit.cover),
                                                        shape: BoxShape.circle,
                                                      ),
                                                    ),
                                                    Text(
                                                      'Ingresa con Google',
                                                      style: TextStyle(
                                                          fontSize: 16.0,
                                                          fontWeight:
                                                              FontWeight.bold,
                                                          color: Colors.white),
                                                    ),
                                                  ],
                                                ))),
                                            onTap: () async {
                                              signInWithGoogle(model)
                                                  .then((FirebaseUser user) {
                                                model.clearAllModels();
                                                Navigator.of(context)
                                                    .pushNamedAndRemoveUntil(
                                                        RouteName.Map,
                                                        (Route<dynamic>
                                                                route) =>
                                                            false);
                                              }).catchError((e) => print(e));
                                            },
                                          ),
                                          SizedBox(
                                            height: 16,
                                          ),
                                        ],
                                      ),
                                    ),
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    model.state == ViewState.Busy
                        ? Utils.progressBar()
                        : Container(),
                  ],
                ),
              ),
            ),
            onWillPop: () async {
              model.clearAllModels();
              return false;
            },
          );
        });
  }

  // ignore: missing_return
  Future<FirebaseUser> signInWithGoogle(SignInViewModel model) async {
    model.state = ViewState.Busy;

    GoogleSignInAccount googleSignInAccount = await _googleSignIn.signIn();

    GoogleSignInAuthentication googleSignInAuthentication =
        await googleSignInAccount.authentication;

    AuthCredential credential = GoogleAuthProvider.getCredential(
      accessToken: googleSignInAuthentication.accessToken,
      idToken: googleSignInAuthentication.idToken,
    );

    AuthResult authResult = await _auth.signInWithCredential(credential);

    _user = authResult.user;

    assert(!_user.isAnonymous);

    assert(await _user.getIdToken() != null);

    FirebaseUser currentUser = await _auth.currentUser();

    assert(_user.uid == currentUser.uid);

    model.state = ViewState.Idle;

    print("User Name: ${_user.displayName}");
    print("User Email ${_user.email}");
  }
}
