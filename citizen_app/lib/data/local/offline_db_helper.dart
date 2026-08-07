// File: citizen_app/lib/data/local/offline_db_helper.dart
import 'dart:async';
import 'package:path/path.dart';
import 'package:sqflite/sqflite.dart';
import 'package:flutter/foundation.dart' show debugPrint;

class OfflineDbHelper {
  static Database? _database;

  static Future<Database> get database async {
    if (_database != null) return _database!;
    _database = await _initDatabase();
    return _database!;
  }

  // 7 Preloaded Realistic Civic Issues with AI Multi-Criteria Severity Scores & Real Reverse Geocoded Addresses
  static final List<Map<String, dynamic>> preloadedCivicIssues = [
    {
      'id': 101,
      'category': 'Pothole Repair',
      'description': 'Severe asphalt erosion crater causing traffic slowdown near Main Road Gate 1',
      'latitude': 23.3441,
      'longitude': 85.3096,
      'address': 'Main Road, Ward 4, Ranchi, Jharkhand',
      'status': 'Reported',
      'photoPath': '',
      'severityScore': 78,
      'createdAt': '2026-08-07T10:15:00.000',
    },
    {
      'id': 102,
      'category': 'Water & Sewage',
      'description': 'Underground water pipeline leak overflowing onto pedestrian sidewalk',
      'latitude': 23.3500,
      'longitude': 85.3150,
      'address': 'Albert Ekka Chowk, Ward 2, Ranchi, Jharkhand',
      'status': 'In Progress',
      'photoPath': '',
      'severityScore': 88,
      'createdAt': '2026-08-07T09:30:00.000',
    },
    {
      'id': 103,
      'category': 'Electrical & Lighting',
      'description': 'Broken street light pole with hanging exposed wiring near market complex',
      'latitude': 23.3620,
      'longitude': 85.3280,
      'address': 'Kanke Road, Ward 1, Ranchi, Jharkhand',
      'status': 'Reported',
      'photoPath': '',
      'severityScore': 68,
      'createdAt': '2026-08-07T08:45:00.000',
    },
    {
      'id': 104,
      'category': 'Garbage & Sanitation',
      'description': 'Uncollected solid municipal waste dump overflowing beside residential park',
      'latitude': 23.3410,
      'longitude': 85.3020,
      'address': 'Dorananda Colony, Ward 3, Ranchi, Jharkhand',
      'status': 'Resolved',
      'photoPath': '',
      'severityScore': 54,
      'createdAt': '2026-08-06T16:20:00.000',
    },
    {
      'id': 105,
      'category': 'Public Safety',
      'description': 'Damaged storm drain concrete slab cover creating open pit hazard',
      'latitude': 23.3550,
      'longitude': 85.3210,
      'address': 'Ratu Road Circle, Ward 2, Ranchi, Jharkhand',
      'status': 'In Progress',
      'photoPath': '',
      'severityScore': 82,
      'createdAt': '2026-08-06T14:10:00.000',
    },
    {
      'id': 106,
      'category': 'Roads & Infrastructure',
      'description': 'Fallen tree branch obstructing single-lane municipal bypass road',
      'latitude': 23.3380,
      'longitude': 85.2950,
      'address': 'Hinoo Main Crossing, Ward 4, Ranchi, Jharkhand',
      'status': 'Reported',
      'photoPath': '',
      'severityScore': 74,
      'createdAt': '2026-08-06T11:05:00.000',
    },
    {
      'id': 107,
      'category': 'Water & Sewage',
      'description': 'Sanitary sewer blockage producing foul odor near community school',
      'latitude': 23.3690,
      'longitude': 85.3340,
      'address': 'Bariatu Housing Board, Ward 1, Ranchi, Jharkhand',
      'status': 'Reported',
      'photoPath': '',
      'severityScore': 85,
      'createdAt': '2026-08-05T18:00:00.000',
    },
  ];

  static Future<Database> _initDatabase() async {
    final dbPath = await getDatabasesPath();
    final path = join(dbPath, 'nexusgov_offline.db');

    return await openDatabase(
      path,
      version: 1,
      onCreate: (db, version) async {
        await db.execute('''
          CREATE TABLE cached_issues (
            id INTEGER PRIMARY KEY,
            category TEXT,
            description TEXT,
            latitude REAL,
            longitude REAL,
            address TEXT,
            status TEXT,
            photoPath TEXT,
            severityScore INTEGER,
            createdAt TEXT
          )
        ''');

        await db.execute('''
          CREATE TABLE pending_uploads (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            category TEXT,
            description TEXT,
            latitude REAL,
            longitude REAL,
            address TEXT,
            severityScore INTEGER,
            localImagePath TEXT,
            createdAt TEXT
          )
        ''');

        // Seed initial 7 preloaded issues
        for (var issue in preloadedCivicIssues) {
          await db.insert('cached_issues', issue);
        }
      },
    );
  }

  // Method 1: Cache list of issues fetched from server
  static Future<void> cacheIssuesList(List<dynamic> issues) async {
    try {
      final db = await database;
      final pendingOfflineItems = await db.query('cached_issues', where: 'status LIKE ?', whereArgs: ['%Offline%']);

      if (issues.isNotEmpty) {
        await db.delete('cached_issues');
        for (var issue in issues) {
          await db.insert(
            'cached_issues',
            {
              'id': issue['id'] is int ? issue['id'] : int.tryParse(issue['id'].toString()) ?? 0,
              'category': issue['category'] ?? 'Pothole Repair',
              'description': issue['description'] ?? '',
              'latitude': (issue['latitude'] as num?)?.toDouble() ?? 0.0,
              'longitude': (issue['longitude'] as num?)?.toDouble() ?? 0.0,
              'address': issue['address'] ?? '',
              'status': issue['status'] ?? 'Reported',
              'photoPath': issue['photoPath'] ?? '',
              'severityScore': (issue['severityScore'] as num?)?.toInt() ?? 50,
              'createdAt': issue['createdAt'] ?? DateTime.now().toIso8601String(),
            },
            conflictAlgorithm: ConflictAlgorithm.replace,
          );
        }
      }

      for (var item in pendingOfflineItems) {
        await db.insert('cached_issues', item, conflictAlgorithm: ConflictAlgorithm.replace);
      }
      debugPrint('✓ OfflineDbHelper: Cached ${issues.length} server issues.');
    } catch (e) {
      debugPrint('⚠️ OfflineDbHelper cacheIssuesList error: $e');
    }
  }

  // Method 2: Get cached issues (Auto-seeds 7 preloaded issues if table is empty)
  static Future<List<Map<String, dynamic>>> getCachedIssues() async {
    try {
      final db = await database;
      final list = await db.query('cached_issues', orderBy: 'id DESC');
      if (list.isEmpty) {
        // Seed 7 preloaded issues
        for (var issue in preloadedCivicIssues) {
          await db.insert('cached_issues', issue, conflictAlgorithm: ConflictAlgorithm.replace);
        }
        return await db.query('cached_issues', orderBy: 'id DESC');
      }
      return list;
    } catch (e) {
      debugPrint('⚠️ OfflineDbHelper getCachedIssues error: $e');
      return preloadedCivicIssues;
    }
  }

  // Method 3: Queue issue for upload when offline AND insert into local cached_issues
  static Future<int> queueIssueForUpload(Map<String, dynamic> issueData) async {
    try {
      final db = await database;
      final id = await db.insert('pending_uploads', {
        'category': issueData['category'],
        'description': issueData['description'],
        'latitude': issueData['latitude'],
        'longitude': issueData['longitude'],
        'address': issueData['address'],
        'severityScore': issueData['severityScore'],
        'localImagePath': issueData['localImagePath'],
        'createdAt': issueData['createdAt'] ?? DateTime.now().toIso8601String(),
      });

      final cachedId = (DateTime.now().millisecondsSinceEpoch % 900000) + 100000;
      await db.insert(
        'cached_issues',
        {
          'id': cachedId,
          'category': issueData['category'],
          'description': issueData['description'],
          'latitude': issueData['latitude'],
          'longitude': issueData['longitude'],
          'address': issueData['address'],
          'status': 'Queued (Offline)',
          'photoPath': issueData['localImagePath'],
          'severityScore': issueData['severityScore'],
          'createdAt': issueData['createdAt'] ?? DateTime.now().toIso8601String(),
        },
        conflictAlgorithm: ConflictAlgorithm.replace,
      );

      debugPrint('✓ OfflineDbHelper: Queued issue #$id for background sync & added to local feed.');
      return id;
    } catch (e) {
      debugPrint('⚠️ OfflineDbHelper queueIssueForUpload error: $e');
      return -1;
    }
  }

  // Method 4: Get all pending uploads for background sync
  static Future<List<Map<String, dynamic>>> getPendingUploads() async {
    try {
      final db = await database;
      return await db.query('pending_uploads', orderBy: 'id ASC');
    } catch (e) {
      debugPrint('⚠️ OfflineDbHelper getPendingUploads error: $e');
      return [];
    }
  }

  // Method 5: Remove pending upload after successful server sync
  static Future<int> removePendingUpload(int id) async {
    try {
      final db = await database;
      final count = await db.delete('pending_uploads', where: 'id = ?', whereArgs: [id]);
      debugPrint('✓ OfflineDbHelper: Removed pending upload #$id after successful sync.');
      return count;
    } catch (e) {
      debugPrint('⚠️ OfflineDbHelper removePendingUpload error: $e');
      return 0;
    }
  }

  // Method 6: Get total count of pending uploads
  static Future<int> getPendingQueueCount() async {
    try {
      final db = await database;
      final result = await db.rawQuery('SELECT COUNT(*) as count FROM pending_uploads');
      return Sqflite.firstIntValue(result) ?? 0;
    } catch (e) {
      return 0;
    }
  }
}
