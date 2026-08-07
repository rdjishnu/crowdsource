// File: citizen_app/lib/core/constants/api_constants.dart
import 'dart:io' show Platform;
import 'package:flutter/foundation.dart' show kIsWeb;

class ApiConstants {
  // Centralized API Base URL for Global Tunneling & Local Dev
  // Change this to your Ngrok URL when testing on Mobile Data (e.g., 'https://1234-abcd.ngrok-free.app/api')
  static String baseUrl = 'http://localhost:8080/api';

  // Dynamic fallback candidate URLs ensuring fail-proof connectivity across USB, Emulators, Physical Devices & Web
  static List<String> get candidateUrls {
    if (baseUrl.contains('ngrok') || baseUrl.contains('https://')) {
      return [baseUrl];
    }

    if (kIsWeb) {
      return [
        'http://localhost:8080/api',
        'http://127.0.0.1:8080/api',
        'http://10.10.64.29:8080/api',
      ];
    } else if (!kIsWeb && Platform.isAndroid) {
      return [
        'http://10.0.2.2:8080/api',    // Android Emulator (Primary bridge to host)
        'http://127.0.0.1:8080/api',
        'http://localhost:8080/api',
        'http://10.10.64.29:8080/api',
      ];
    } else {
      return [
        'http://localhost:8080/api',
        'http://127.0.0.1:8080/api',
        'http://10.10.64.29:8080/api',
      ];
    }
  }
}
