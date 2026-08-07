// File: lib/presentation/navigation/app_routes.dart
import 'package:flutter/material.dart';
import '../../screens/citizen_login_screen.dart';
import '../../screens/citizen_register_screen.dart';
import '../screens/landing_screen.dart';
import 'main_navigation_shell.dart';

class AppRoutes {
  static const String landing = '/';
  static const String login = '/login';
  static const String register = '/register';
  static const String mainShell = '/main';

  static Map<String, WidgetBuilder> get routes {
    return {
      landing: (context) => const LandingScreen(),
      login: (context) => const CitizenLoginScreen(),
      register: (context) => const CitizenRegisterScreen(),
      mainShell: (context) => const MainNavigationShell(),
    };
  }
}
