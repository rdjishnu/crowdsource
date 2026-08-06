import 'dart:io';
import 'package:flutter/material.dart';
import '../models/issue.dart';
import '../services/api_service.dart';

class IssueProvider with ChangeNotifier {
  final ApiService _apiService = ApiService();

  List<Issue> _issues = [];
  Map<String, dynamic>? _stats;
  bool _isLoading = false;
  bool _isSubmitting = false;
  double _uploadProgress = 0.0;
  String? _errorMessage;

  List<Issue> get issues => _issues;
  Map<String, dynamic>? get stats => _stats;
  bool get isLoading => _isLoading;
  bool get isSubmitting => _isSubmitting;
  double get uploadProgress => _uploadProgress;
  String? get errorMessage => _errorMessage;

  Future<void> fetchIssues({String? status, String? category, String? search}) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      _issues = await _apiService.getIssues(status: status, category: category, search: search);
      await fetchStats();
    } catch (e) {
      _errorMessage = e.toString();
      // Populate demo fallback if server is starting up
      _populateFallbackData();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> fetchStats() async {
    try {
      _stats = await _apiService.getStats();
    } catch (_) {}
  }

  Future<Issue?> submitIssue({
    required String category,
    required String description,
    required double latitude,
    required double longitude,
    required File photoFile,
  }) async {
    _isSubmitting = true;
    _uploadProgress = 0.1;
    _errorMessage = null;
    notifyListeners();

    try {
      _uploadProgress = 0.5;
      notifyListeners();

      final newIssue = await _apiService.reportIssue(
        category: category,
        description: description,
        latitude: latitude,
        longitude: longitude,
        photoFile: photoFile,
      );

      _uploadProgress = 1.0;
      _issues.insert(0, newIssue);
      await fetchStats();
      return newIssue;
    } catch (e) {
      _errorMessage = e.toString();
      return null;
    } finally {
      _isSubmitting = false;
      notifyListeners();
    }
  }

  void updateBaseUrl(String newUrl) {
    _apiService.baseUrl = newUrl;
    fetchIssues();
  }

  void _populateFallbackData() {
    if (_issues.isEmpty) {
      _issues = [
        Issue(
          id: 101,
          category: 'Pothole',
          description: 'Severe deep pothole on Main Road near Overbridge, Ranchi.',
          photoPath: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600',
          latitude: 23.3441,
          longitude: 85.3096,
          status: 'Reported',
          createdAt: DateTime.now().subtract(const Duration(hours: 3)),
        ),
        Issue(
          id: 102,
          category: 'Garbage',
          description: 'Uncollected solid waste accumulation near Market Complex.',
          photoPath: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600',
          latitude: 23.3500,
          longitude: 85.3200,
          status: 'In Progress',
          createdAt: DateTime.now().subtract(const Duration(days: 1)),
        ),
        Issue(
          id: 103,
          category: 'Streetlight',
          description: 'Streetlight pole non-functional causing low visibility at night.',
          photoPath: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=600',
          latitude: 23.3600,
          longitude: 85.3300,
          status: 'Resolved',
          createdAt: DateTime.now().subtract(const Duration(days: 2)),
        ),
      ];
    }
  }
}
