// File: citizen_app/lib/services/sync_manager.dart
import 'dart:async';
import 'dart:io';
import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter/foundation.dart' show debugPrint;
import 'package:http/http.dart' as http;
import '../core/constants/api_constants.dart';
import '../data/local/offline_db_helper.dart';
import 'auth_service.dart';

class SyncManager {
  static final SyncManager _instance = SyncManager._internal();
  factory SyncManager() => _instance;
  SyncManager._internal();

  final Connectivity _connectivity = Connectivity();
  final AuthService _authService = AuthService();
  StreamSubscription<List<ConnectivityResult>>? _subscription;
  bool _isFlushing = false;

  /// Initializes background connectivity listener
  void initialize() {
    _subscription?.cancel();
    _subscription = _connectivity.onConnectivityChanged.listen((List<ConnectivityResult> results) {
      final hasConnection = results.any((r) =>
        r == ConnectivityResult.mobile ||
        r == ConnectivityResult.wifi ||
        r == ConnectivityResult.ethernet
      );

      if (hasConnection) {
        flushQueue();
      }
    });
  }

  /// Flushes pending offline uploads to Spring Boot backend
  Future<int> flushQueue() async {
    if (_isFlushing) return 0;
    _isFlushing = true;

    int syncedCount = 0;
    try {
      final pendingUploads = await OfflineDbHelper.getPendingUploads();
      if (pendingUploads.isEmpty) {
        _isFlushing = false;
        return 0;
      }

      final token = await _authService.getToken();

      for (var pending in pendingUploads) {
        final int pendingId = pending['id'];
        final String category = pending['category'] ?? 'Pothole Repair';
        final String description = pending['description'] ?? '';
        final double latitude = (pending['latitude'] as num?)?.toDouble() ?? 0.0;
        final double longitude = (pending['longitude'] as num?)?.toDouble() ?? 0.0;
        final String address = pending['address'] ?? '';
        final int severityScore = (pending['severityScore'] as num?)?.toInt() ?? 50;
        final String localImagePath = pending['localImagePath'] ?? '';

        bool uploadSuccess = false;

        for (String baseUrl in ApiConstants.candidateUrls) {
          final endpoint = '$baseUrl/issues';
          try {
            final request = http.MultipartRequest('POST', Uri.parse(endpoint));
            if (token != null && token.isNotEmpty) {
              request.headers['Authorization'] = 'Bearer $token';
            }

            request.fields['category'] = category;
            request.fields['description'] = description;
            request.fields['latitude'] = latitude.toString();
            request.fields['longitude'] = longitude.toString();
            request.fields['address'] = address;
            request.fields['severityScore'] = severityScore.toString();
            request.fields['isOfflineSynced'] = 'true';

            if (localImagePath.isNotEmpty && File(localImagePath).existsSync()) {
              request.files.add(await http.MultipartFile.fromPath('photo', localImagePath));
            }

            // Fast 1.5s connection timeout per candidate URL
            final streamedResponse = await request.send().timeout(const Duration(milliseconds: 1500));
            final response = await http.Response.fromStream(streamedResponse);

            if (response.statusCode == 200 || response.statusCode == 201) {
              uploadSuccess = true;
              debugPrint('✓ SyncManager: Pending upload #$pendingId successfully synced to $endpoint');
              break;
            }
          } catch (e) {
            // Fast failover to next candidate URL without error spam
            continue;
          }
        }

        if (uploadSuccess) {
          await OfflineDbHelper.removePendingUpload(pendingId);
          syncedCount++;
        } else {
          debugPrint('ℹ️ SyncManager: Server unreachable on current network. Retaining queued items in local SQLite database for auto-sync.');
        }
      }
    } catch (e) {
      debugPrint('ℹ️ SyncManager notice: $e');
    } finally {
      _isFlushing = false;
    }

    return syncedCount;
  }

  void dispose() {
    _subscription?.cancel();
  }
}
