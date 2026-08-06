class Issue {
  final int? id;
  final String category;
  final String description;
  final String photoPath;
  final double latitude;
  final double longitude;
  final String status;
  final DateTime createdAt;

  Issue({
    this.id,
    required this.category,
    required this.description,
    required this.photoPath,
    required this.latitude,
    required this.longitude,
    required this.status,
    required this.createdAt,
  });

  factory Issue.fromJson(Map<String, dynamic> json) {
    return Issue(
      id: json['id'] != null ? (json['id'] as num).toInt() : null,
      category: json['category'] ?? 'Pothole',
      description: json['description'] ?? '',
      photoPath: json['photoPath'] ?? '',
      latitude: json['latitude'] != null ? (json['latitude'] as num).toDouble() : 0.0,
      longitude: json['longitude'] != null ? (json['longitude'] as num).toDouble() : 0.0,
      status: json['status'] ?? 'Reported',
      createdAt: json['createdAt'] != null
          ? DateTime.tryParse(json['createdAt'].toString()) ?? DateTime.now()
          : DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      if (id != null) 'id': id,
      'category': category,
      'description': description,
      'photoPath': photoPath,
      'latitude': latitude,
      'longitude': longitude,
      'status': status,
      'createdAt': createdAt.toIso8601String(),
    };
  }

  String getFullPhotoUrl(String baseUrl) {
    if (photoPath.isEmpty) return 'https://via.placeholder.com/400x300';
    if (photoPath.startsWith('http')) return photoPath;
    return '$baseUrl$photoPath';
  }
}
