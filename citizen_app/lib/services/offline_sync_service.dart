// File: lib/services/offline_sync_service.dart
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'issue_service.dart';

class OfflineSyncService {
  static const String _queueKey = 'nexusgov_offline_issue_queue';
  final IssueService _issueService = IssueService();

  /// Saves issue payload locally when device is offline.
  Future<void> saveOfflineIssue({
    required String category,
    required String description,
    required double latitude,
    required double longitude,
  }) async {
    final prefs = await SharedPreferences.getInstance();
    final List<String> currentQueue = prefs.getStringList(_queueKey) ?? [];

    final offlineData = {
      'category': category,
      'description': description,
      'latitude': latitude,
      'longitude': longitude,
      'originalCaptureTime': DateTime.now().toIso8601String(),
      'isOfflineSynced': true,
    };

    currentQueue.add(jsonEncode(offlineData));
    await prefs.setStringList(_queueKey, currentQueue);
  }

  /// Fetches total number of pending offline reports in queue.
  Future<int> getPendingQueueCount() async {
    final prefs = await SharedPreferences.getInstance();
    final List<String> currentQueue = prefs.getStringList(_queueKey) ?? [];
    return currentQueue.length;
  }

  /// Automatically syncs all queued offline issues when internet is restored.
  Future<int> syncPendingIssues() async {
    final prefs = await SharedPreferences.getInstance();
    final List<String> currentQueue = prefs.getStringList(_queueKey) ?? [];
    if (currentQueue.isEmpty) return 0;

    int syncedCount = 0;
    List<String> remainingQueue = [];

    for (String itemStr in currentQueue) {
      try {
        final item = jsonDecode(itemStr);
        final result = await _issueService.submitIssue(
          category: item['category'],
          description: item['description'],
          latitude: item['latitude'],
          longitude: item['longitude'],
        );

        if (result['success'] == true) {
          syncedCount++;
        } else {
          remainingQueue.add(itemStr);
        }
      } catch (e) {
        remainingQueue.add(itemStr);
      }
    }

    await prefs.setStringList(_queueKey, remainingQueue);
    return syncedCount;
  }
}
