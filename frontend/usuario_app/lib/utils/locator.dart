import 'package:usuario_app/View_Model/choose_route_view_model.dart';
import 'package:usuario_app/View_Model/home_view_model.dart';
import 'package:usuario_app/View_Model/sign_in_view_model.dart';
import 'package:get_it/get_it.dart';

GetIt locator = GetIt.instance;

void setLocator() {
  locator.registerLazySingleton(() => SignInViewModel());
  locator.registerLazySingleton(() => HomeViewModel());
  locator.registerLazySingleton(() => ChooseRouteViewModel());
}
