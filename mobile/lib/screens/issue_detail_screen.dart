import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../models/issue.dart';
import '../core/constants.dart';
import '../utils/formatters.dart';
import '../widgets/status_badge.dart';

class IssueDetailScreen extends StatelessWidget {
  final Issue? issue;

  const IssueDetailScreen({super.key, required this.issue});

  void _openGoogleMaps(double lat, double lng) async {
    final uri = Uri.parse('https://www.google.com/maps/search/?api=1&query=$lat,$lng');
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (issue == null) {
      return Scaffold(
        appBar: AppBar(title: const Text('Issue Details')),
        body: const Center(child: Text('No issue details provided.')),
      );
    }

    final photoUrl = issue!.getFullPhotoUrl(AppConstants.defaultBaseUrl);

    return Scaffold(
      appBar: AppBar(
        title: Text('Ticket #${issue!.id ?? 'NEW'}'),
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Evidence Photo Full Header
            GestureDetector(
              onTap: () {
                showDialog(
                  context: context,
                  builder: (_) => Dialog(
                    backgroundColor: Colors.black,
                    child: Image.network(photoUrl, fit: BoxFit.contain),
                  ),
                );
              },
              child: Stack(
                children: [
                  Image.network(
                    photoUrl,
                    width: double.infinity,
                    height: 260,
                    fit: BoxFit.cover,
                    errorBuilder: (_, __, ___) => Container(
                      height: 260,
                      color: Colors.grey.shade900,
                      child: const Center(child: Icon(Icons.broken_image, size: 50, color: Colors.grey)),
                    ),
                  ),
                  Positioned(
                    bottom: 12,
                    right: 12,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: Colors.black54,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: const Row(
                        children: [
                          Icon(Icons.zoom_in, color: Colors.white, size: 16),
                          SizedBox(width: 4),
                          Text('Tap to Enlarge', style: TextStyle(color: Colors.white, fontSize: 11)),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),

            Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          color: AppColors.primary.withOpacity(0.15),
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: AppColors.primary.withOpacity(0.4)),
                        ),
                        child: Text(
                          issue!.category,
                          style: const TextStyle(
                            color: AppColors.primary,
                            fontWeight: FontWeight.bold,
                            fontSize: 14,
                          ),
                        ),
                      ),
                      StatusBadge(status: issue!.status),
                    ],
                  ),

                  const SizedBox(height: 16),

                  const Text(
                    'Description',
                    style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Colors.grey),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    issue!.description,
                    style: const TextStyle(fontSize: 16, height: 1.4),
                  ),

                  const SizedBox(height: 20),

                  // GPS Location Tile with Map Launch
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.04),
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(color: AppColors.borderDark),
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.location_on, color: AppColors.accentCyan, size: 28),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text('Location Coordinates', style: TextStyle(fontSize: 12, color: Colors.grey)),
                              Text(
                                AppFormatters.formatCoordinates(issue!.latitude, issue!.longitude),
                                style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
                              ),
                            ],
                          ),
                        ),
                        ElevatedButton.icon(
                          onPressed: () => _openGoogleMaps(issue!.latitude, issue!.longitude),
                          icon: const Icon(Icons.navigation_outlined, size: 16, color: Colors.white),
                          label: const Text('Navigate', style: TextStyle(color: Colors.white, fontSize: 12)),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppColors.accentCyan,
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 24),

                  // Status Progress Timeline
                  const Text(
                    'Resolution Workflow Timeline',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 16),

                  _buildTimelineItem('Complaint Reported by Citizen', AppFormatters.formatDate(issue!.createdAt), true, true),
                  _buildTimelineItem(
                    'Assigned to Municipal Nodal Officer',
                    issue!.status != 'Reported' ? 'Assigned' : 'Pending',
                    issue!.status != 'Reported',
                    true,
                  ),
                  _buildTimelineItem(
                    'Work In Progress / Field Repair',
                    issue!.status == 'In Progress' || issue!.status == 'Resolved' ? 'In Progress' : 'Awaiting',
                    issue!.status == 'In Progress' || issue!.status == 'Resolved',
                    true,
                  ),
                  _buildTimelineItem(
                    'Issue Resolved & Case Closed',
                    issue!.status == 'Resolved' ? 'Resolved' : 'Pending',
                    issue!.status == 'Resolved',
                    false,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTimelineItem(String title, String time, bool isDone, bool showLine) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Column(
          children: [
            CircleAvatar(
              radius: 12,
              backgroundColor: isDone ? AppColors.accentEmerald : Colors.grey.shade800,
              child: Icon(
                isDone ? Icons.check : Icons.circle,
                size: 14,
                color: isDone ? Colors.white : Colors.grey.shade600,
              ),
            ),
            if (showLine)
              Container(
                width: 2,
                height: 36,
                color: isDone ? AppColors.accentEmerald : Colors.grey.shade800,
              ),
          ],
        ),
        const SizedBox(width: 14),
        Expanded(
          child: Padding(
            padding: const EdgeInsets.only(top: 2),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: TextStyle(
                    fontWeight: isDone ? FontWeight.bold : FontWeight.normal,
                    color: isDone ? Colors.white : Colors.grey,
                  ),
                ),
                Text(time, style: const TextStyle(fontSize: 11, color: Colors.grey)),
              ],
            ),
          ),
        ),
      ],
    );
  }
}
