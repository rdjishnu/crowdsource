import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../core/constants.dart';
import '../core/routes.dart';
import '../providers/issue_provider.dart';
import '../widgets/issue_card.dart';
import '../widgets/loading_skeleton.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<IssueProvider>().fetchIssues();
    });
  }

  @override
  Widget build(BuildContext context) {
    final issueProvider = context.watch<IssueProvider>();
    final stats = issueProvider.stats;

    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(
                color: AppColors.primary,
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Icon(Icons.shield_outlined, color: Colors.white, size: 20),
            ),
            const SizedBox(width: 10),
            const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('NexusGov AI', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                Text('Govt of Jharkhand', style: TextStyle(fontSize: 11, color: AppColors.accentCyan)),
              ],
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.map_outlined),
            onPressed: () => Navigator.pushNamed(context, AppRoutes.map),
          ),
          IconButton(
            icon: const Icon(Icons.person_outline),
            onPressed: () => Navigator.pushNamed(context, AppRoutes.profile),
          ),
          IconButton(
            icon: const Icon(Icons.settings_outlined),
            onPressed: () => Navigator.pushNamed(context, AppRoutes.settings),
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () => issueProvider.fetchIssues(),
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Hero Banner
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(20),
                  gradient: const LinearGradient(
                    colors: [AppColors.primary, Color(0xFF8B5CF6)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: AppColors.primary.withOpacity(0.3),
                      blurRadius: 16,
                      offset: const Offset(0, 6),
                    )
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'Report Civic Issues Instantly',
                          style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
                        ),
                        Icon(Icons.camera_alt_outlined, color: Colors.white, size: 28),
                      ],
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'Potholes, Garbage, Streetlights, Water Leaks & Sewage issues directly sent to municipal authorities.',
                      style: TextStyle(color: Colors.white70, fontSize: 13),
                    ),
                    const SizedBox(height: 16),
                    ElevatedButton.icon(
                      onPressed: () => Navigator.pushNamed(context, AppRoutes.reportIssue),
                      icon: const Icon(Icons.add_a_photo, size: 18, color: AppColors.primary),
                      label: const Text('Report New Complaint', style: TextStyle(color: AppColors.primary, fontWeight: FontWeight.bold)),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.white,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 24),

              // Statistics Row
              Row(
                children: [
                  _buildStatTile('Total Reports', '${stats?['total'] ?? issueProvider.issues.length}', AppColors.primary),
                  const SizedBox(width: 12),
                  _buildStatTile('Reported', '${stats?['reported'] ?? 1}', AppColors.accentAmber),
                  const SizedBox(width: 12),
                  _buildStatTile('Resolved', '${stats?['resolved'] ?? 1}', AppColors.accentEmerald),
                ],
              ),

              const SizedBox(height: 28),

              // Recent Issues Header
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Recent Civic Complaints',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  TextButton(
                    onPressed: () => Navigator.pushNamed(context, AppRoutes.complaintHistory),
                    child: const Text('View All'),
                  ),
                ],
              ),

              const SizedBox(height: 12),

              // Issues List
              if (issueProvider.isLoading)
                const LoadingSkeleton()
              else if (issueProvider.issues.isEmpty)
                Center(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(vertical: 40),
                    child: Column(
                      children: [
                        const Icon(Icons.assignment_turned_in_outlined, size: 48, color: Colors.grey),
                        const SizedBox(height: 12),
                        const Text('No issues reported yet', style: TextStyle(color: Colors.grey)),
                        ElevatedButton(
                          onPressed: () => Navigator.pushNamed(context, AppRoutes.reportIssue),
                          child: const Text('Be First to Report'),
                        )
                      ],
                    ),
                  ),
                )
              else
                ListView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: issueProvider.issues.take(5).length,
                  itemBuilder: (context, index) {
                    final issue = issueProvider.issues[index];
                    return IssueCard(
                      issue: issue,
                      onTap: () => Navigator.pushNamed(
                        context,
                        AppRoutes.issueDetail,
                        arguments: issue,
                      ),
                    );
                  },
                ),
            ],
          ),
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => Navigator.pushNamed(context, AppRoutes.reportIssue),
        icon: const Icon(Icons.camera_alt),
        label: const Text('Report Issue'),
        backgroundColor: AppColors.primary,
        elevation: 6,
      ),
    );
  }

  Widget _buildStatTile(String label, String value, Color color) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: color.withOpacity(0.1),
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: color.withOpacity(0.3)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(label, style: TextStyle(fontSize: 11, color: Colors.grey.shade400, fontWeight: FontWeight.bold)),
            const SizedBox(height: 4),
            Text(value, style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: color)),
          ],
        ),
      ),
    );
  }
}
