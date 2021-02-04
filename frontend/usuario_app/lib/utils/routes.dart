import 'package:flutter/material.dart';
import 'package:usuario_app/choose-route.dart';
import 'package:usuario_app/home_screen.dart';
import 'package:usuario_app/login_screen.dart';
import 'package:usuario_app/splash.dart';
import 'package:usuario_app/utils/routeNames.dart';

class Routes {
  static Route<dynamic> onGenerateRoute(RouteSettings settings) {
    switch (settings.name) {
      case '/':
        return MaterialPageRoute(builder: (context) => Splash());
      case RouteName.USER_LOGIN:
        return MaterialPageRoute(builder: (_) => LoginScreen());
      case RouteName.Home:
        return MaterialPageRoute(builder: (_) => HomeScreen());
      case RouteName.Map:
        return MaterialPageRoute(builder: (_) => ChooseRoute());
      default:
        return MaterialPageRoute(
          builder: (context) => Scaffold(
            backgroundColor: Colors.white,
            body: Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: <Widget>[
//                  Image.asset('assets/images/error.jpg'),
                  Text(
                    "${settings.name} does not exists!",
                    style: TextStyle(fontSize: 24.0),
                  )
                ],
              ),
            ),
          ),
        );
    }
  }
}
