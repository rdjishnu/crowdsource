import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';
import '../core/constants.dart';
import '../core/routes.dart';
import '../providers/issue_provider.dart';
import '../models/issue.dart';
import '../widgets/status_badge.dart';

class MapScreen extends StatefulWidget {
  const MapScreen({super.key});

  @override
  State<MapScreen> createState() => _MapScreenState();
}

class _MapScreenState extends State<MapScreen> {
  Issue? _selectedIssue;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<IssueProvider>().fetchIssues();
    });
  }

  void _openGoogleMaps(double lat, double lng) async {
    final uri = Uri.parse('https://www.google.com/maps/search/?api=1&query=$lat,$lng');
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    }
  }

  @override
  Widget build(BuildContext context) {
    final issueProvider = context.watch<IssueProvider>();
    final issues = issueProvider.issues;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Jharkhand Geo Issue Map'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () => issueProvider.fetchIssues(),
          ),
        ],
      ),
      body: Stack(
        children: [
          // Visual Map Grid Simulation
          Container(
            color: const Color(0xFF090D16),
            width: double.infinity,
            height: double.infinity,
            child: Stack(
              children: [
                Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.explore_outlined, size: 80, color: AppColors.primary.withOpacity(0.4)),
                      const SizedBox(height: 12),
                      const Text(
                        'Interactive Map Grid (Ranchi & Jharkhand Region)',
                        style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Showing ${issues.length} active civic report pins',
                        style: const TextStyle(color: Colors.grey, fontSize: 12),
                      ),
                    ],
                  ),
                ),

                // Render Map Markers dynamically across screen grid
                ...issues.asMap().entries.map((entry) {
                  final idx = entry.key;
                  final issue = entry.value;

                  // Distribute markers in simulated geo coordinates view
                  final double topPos = 120 + ((idx * 85) % 420);
                  final double leftPos = 40 + ((idx * 110) % 280);

                  final bool isSelected = _selectedIssue?.id == issue.id;

                  return Positioned(
                    top: topPos,
                    left: leftPos,
                    child: GestureDetector(
                      onTap: () {
                        setState(() => _selectedIssue = issue);
                      },
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          AnimatedContainer(
                            duration: const Duration(milliseconds: 200),
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                            decoration: BoxDecoration(
                              color: isSelected ? AppColors.primary : AppColors.cardDark,
                              borderRadius: BorderRadius.circular(20),
                              border: Border.all(
                                color: issue.status == 'Resolved' ? AppColors.accentEmerald : AppColors.accentAmber,
                                width: 2,
                              ),
                              boxShadow: const [
                                BoxShadow(color: Colors.black54, blurRadius: 8, offset: Offset(0, 4))
                              ],
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Icon(
                                  Icons.location_on,
                                  size: 14,
                                  color: issue.status == 'Resolved' ? AppColors.accentEmerald : AppColors.accentAmber,
                                ),
                                const SizedBox(width: 4),
                                Text(
                                  '#${issue.id ?? idx + 1} ${issue.category}',
                                  style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold),
                                ),
                              ],
                            ),
                          ),
                          Container(
                            width: 2,
                            height: 12,
                            color: isSelected ? AppColors.primary : Colors.grey,
                          ),
                        ],
                      ),
                    ),
                  );
                }),
              ],
            ),
          ),

          // Selected Issue Details Bottom Sheet / Card Overlay
          if (_selectedIssue != null)
            Positioned(
              bottom: 20,
              left: 16,
              right: 16,
              child: Card(
                elevation: 12,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            'Ticket #${_selectedIssue!.id} • ${_selectedIssue!.category}',
                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: AppColors.primary),
                          ),
                          IconButton(
                            icon: const Icon(Icons.close, size: 18),
                            onPressed: () => setState(() => _selectedIssue = null),
                          ),
                        ],
                      ),
                      Text(
                        _selectedIssue!.description,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(fontSize: 13),
                      ),
                      const SizedBox(height: 12),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          StatusBadge(status: _selectedIssue!.status),
                          Row(
                            children: [
                              OutlinedButton(
                                onPressed: () => Navigator.pushNamed(context, AppRoutes.issueDetail, arguments: _selectedIssue),
                                child: const Text('View Details'),
                              ),
                              const SizedBox(width: 8),
                              ElevatedButton.icon(
                                onPressed: () => _openGoogleMaps(_selectedIssue!.latitude, _selectedIssue!.longitude),
                                icon: const Icon(Icons.navigation, size: 14, color: Colors.white),
                                label: const Text('Navigate', style: TextStyle(color: Colors.white)),
                                style: ElevatedButton.styleFrom(backgroundColor: AppColors.accentCyan),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }
}
