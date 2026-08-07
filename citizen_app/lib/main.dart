// File: lib/main.dart
import 'package:flutter/material.dart';
import 'presentation/navigation/app_routes.dart';
import 'presentation/theme/app_theme.dart';
import 'services/sync_manager.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  // Initialize background offline-to-online sync listener
  SyncManager().initialize();
  runApp(const NexusGovCitizenApp());
}

class NexusGovCitizenApp extends StatelessWidget {
  const NexusGovCitizenApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'NexusGov Citizen Portal',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      initialRoute: AppRoutes.landing,
      routes: AppRoutes.routes,
    );
  }
}
