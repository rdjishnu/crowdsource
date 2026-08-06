import 'package:flutter/material.dart';

class AppConstants {
  static const String appName = 'NexusGov AI';
  static const String tagline = 'Govt of Jharkhand Civic Issue Resolution';
  
  // Default API Base URL (Changeable in settings for device/emulator testing)
  static const String defaultBaseUrl = 'http://localhost:8080';
  static const String apiPrefix = '/api/v1/issues';

  // Issue Categories exactly as required
  static const List<String> categories = [
    'Pothole',
    'Garbage',
    'Streetlight',
    'Water Leak',
    'Sewage',
  ];

  // Status values strictly as required
  static const String statusReported = 'Reported';
  static const String statusInProgress = 'In Progress';
  static const String statusResolved = 'Resolved';
  static const String statusRejected = 'Rejected';

  static const List<String> statuses = [
    statusReported,
    statusInProgress,
    statusResolved,
    statusRejected,
  ];

  // Default Map Coordinates (Ranchi, Jharkhand)
  static const double defaultLat = 23.3441;
  static const double defaultLng = 85.3096;
}

class AppColors {
  static const Color primary = Color(0xFF4F46E5); // Indigo
  static const Color primaryDark = Color(0xFF3730A3);
  static const Color accentCyan = Color(0xFF06B6D4);
  static const Color accentEmerald = Color(0xFF10B981);
  static const Color accentAmber = Color(0xFFF59E0B);
  static const Color accentRose = Color(0xFFEF4444);

  static const Color bgDark = Color(0xFF0B0F19);
  static const Color cardDark = Color(0xFF131A2A);
  static const Color borderDark = Color(0xFF1E293B);

  static const Color bgLight = Color(0xFFF8FAFC);
  static const Color cardLight = Color(0xFFFFFFFF);
  static const Color borderLight = Color(0xFFE2E8F0);
}
