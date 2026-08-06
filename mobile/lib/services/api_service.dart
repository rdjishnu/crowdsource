import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:http_parser/http_parser.dart';
import '../core/constants.dart';
import '../models/issue.dart';

class ApiService {
  String baseUrl;

  ApiService({this.baseUrl = AppConstants.defaultBaseUrl});

  // Report Issue API via Multipart Form Data
  // Fields required: category, description, latitude, longitude, photo
  Future<Issue> reportIssue({
    required String category,
    required String description,
    required double latitude,
    required double longitude,
    required File photoFile,
    Function(double)? onProgress,
  }) async {
    final uri = Uri.parse('$baseUrl${AppConstants.apiPrefix}');
    final request = http.MultipartRequest('POST', uri);

    request.fields['category'] = category;
    request.fields['description'] = description;
    request.fields['latitude'] = latitude.toString();
    request.fields['longitude'] = longitude.toString();

    // Attach Multipart File
    final fileStream = http.ByteStream(photoFile.openRead());
    final length = await photoFile.length();

    final multipartFile = http.MultipartFile(
      'photo', // Exact field name
      fileStream,
      length,
      filename: photoFile.path.split('/').last,
      contentType: MediaType('image', 'jpeg'),
    );

    request.files.add(multipartFile);

    final streamedResponse = await request.send();
    final response = await http.Response.fromStream(streamedResponse);

    if (response.statusCode == 201 || response.statusCode == 200) {
      final jsonMap = json.decode(response.body);
      return Issue.fromJson(jsonMap);
    } else {
      throw Exception('Failed to report issue: ${response.statusCode} - ${response.body}');
    }
  }

  // Get All Issues with filters
  Future<List<Issue>> getIssues({
    String? status,
    String? category,
    String? search,
    int page = 0,
    int size = 20,
  }) async {
    final queryParams = <String, String>{
      'page': page.toString(),
      'size': size.toString(),
    };
    if (status != null && status != 'All') queryParams['status'] = status;
    if (category != null && category != 'All') queryParams['category'] = category;
    if (search != null && search.isNotEmpty) queryParams['search'] = search;

    final uri = Uri.parse('$baseUrl${AppConstants.apiPrefix}').replace(queryParameters: queryParams);
    final response = await http.get(uri);

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      final List<dynamic> content = data['content'] ?? data;
      return content.map((item) => Issue.fromJson(item)).toList();
    } else {
      throw Exception('Failed to fetch issues: ${response.statusCode}');
    }
  }

  // Fetch Stats
  Future<Map<String, dynamic>> getStats() async {
    final uri = Uri.parse('$baseUrl${AppConstants.apiPrefix}/stats');
    final response = await http.get(uri);

    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to fetch stats: ${response.statusCode}');
    }
  }
}
