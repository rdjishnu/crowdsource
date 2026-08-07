// File: lib/presentation/navigation/main_navigation_shell.dart
import 'package:flutter/material.dart';
import '../../services/auth_service.dart';
import '../../services/issue_service.dart';
import '../theme/app_theme.dart';
import '../widgets/custom_app_bar.dart';
import '../screens/report/report_screen.dart';
import '../screens/profile/citizen_profile_screen.dart';

class MainNavigationShell extends StatefulWidget {
  const MainNavigationShell({super.key});

  @override
  State<MainNavigationShell> createState() => _MainNavigationShellState();
}

class _MainNavigationShellState extends State<MainNavigationShell> {
  int _currentIndex = 0;
  final AuthService _authService = AuthService();
  final IssueService _issueService = IssueService();

  List<dynamic> _myIssues = [];
  bool _isLoadingIssues = false;

  @override
  void initState() {
    super.initState();
    _loadIssues();
  }

  Future<void> _loadIssues() async {
    setState(() => _isLoadingIssues = true);
    final data = await _issueService.fetchIssues();
    if (mounted) {
      setState(() {
        _myIssues = data;
        _isLoadingIssues = false;
      });
    }
  }

  // Tab 1: Home / Civic Feed
  Widget _buildHomeTab() {
    final pendingCount = _myIssues.where((i) => i['status'] != 'Resolved').length;
    final resolvedCount = _myIssues.where((i) => i['status'] == 'Resolved').length;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(20.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Hero Banner
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF1E3A8A), Color(0xFF3B82F6)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(20),
              boxShadow: const [
                BoxShadow(
                  color: Color(0x4D1E3A8A),
                  blurRadius: 12,
                  offset: Offset(0, 6),
                ),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: const Color(0x33FFFFFF),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Text(
                    'JHARKHAND CIVIC PULSE',
                    style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold),
                  ),
                ),
                const SizedBox(height: 12),
                const Text(
                  'Empowering Citizens,\nTransforming Governance',
                  style: TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.bold, height: 1.2),
                ),
                const SizedBox(height: 8),
                const Text(
                  'Direct zero-trust reporting to municipality officers.',
                  style: TextStyle(color: Color(0xD9FFFFFF), fontSize: 13),
                ),
                const SizedBox(height: 16),
                ElevatedButton.icon(
                  onPressed: () => setState(() => _currentIndex = 1),
                  icon: const Icon(Icons.add_location_alt, size: 18),
                  label: const Text('File New Report'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.secondaryEmerald,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),

          // Real Stats Row
          const Text('Civic Overview', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppTheme.textDark)),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: _buildStatCard('Total Reports', '${_myIssues.length}', Icons.assignment, Colors.blue),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildStatCard('Pending', '$pendingCount', Icons.pending_actions, Colors.orange),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildStatCard('Resolved', '$resolvedCount', Icons.check_circle, Colors.green),
              ),
            ],
          ),
          const SizedBox(height: 28),

          // Real Live Reports Highlights
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text('Recent Live Reports', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppTheme.textDark)),
              IconButton(icon: const Icon(Icons.refresh, size: 20), onPressed: _loadIssues),
            ],
          ),
          const SizedBox(height: 12),
          _myIssues.isEmpty
              ? Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: Colors.grey.shade200),
                  ),
                  child: const Center(
                    child: Text('No reports submitted yet. Tap "File New Report" above to submit one!'),
                  ),
                )
              : Column(
                  children: _myIssues.take(5).map((item) {
                    final cat = item['category'] ?? 'Issue';
                    final desc = item['description'] ?? '';
                    final status = item['status'] ?? 'Reported';
                    return Container(
                      margin: const EdgeInsets.only(bottom: 10),
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: Colors.grey.shade200),
                      ),
                      child: Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.all(10),
                            decoration: const BoxDecoration(color: Color(0x141E3A8A), shape: BoxShape.circle),
                            child: const Icon(Icons.report_problem, color: AppTheme.primaryNavy, size: 22),
                          ),
                          const SizedBox(width: 14),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(cat, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: AppTheme.textDark)),
                                const SizedBox(height: 4),
                                Text(desc, style: const TextStyle(fontSize: 12, color: AppTheme.textMuted), maxLines: 1, overflow: TextOverflow.ellipsis),
                              ],
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: status == 'Resolved' ? Colors.green.withAlpha(26) : Colors.orange.withAlpha(26),
                              borderRadius: BorderRadius.circular(10),
                            ),
                            child: Text(
                              status,
                              style: TextStyle(
                                fontSize: 10,
                                fontWeight: FontWeight.bold,
                                color: status == 'Resolved' ? Colors.green : Colors.orange,
                              ),
                            ),
                          ),
                        ],
                      ),
                    );
                  }).toList(),
                ),
        ],
      ),
    );
  }

  Widget _buildStatCard(String label, String count, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.grey.shade200),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: color, size: 22),
          const SizedBox(height: 8),
          Text(count, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppTheme.textDark)),
          Text(label, style: const TextStyle(fontSize: 11, color: AppTheme.textMuted)),
        ],
      ),
    );
  }

  // Tab 3: Real My Complaints History
  Widget _buildComplaintsTab() {
    return RefreshIndicator(
      onRefresh: _loadIssues,
      child: ListView(
        padding: const EdgeInsets.all(20.0),
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text('My Reported Issues', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppTheme.textDark)),
              IconButton(icon: const Icon(Icons.refresh), onPressed: _loadIssues),
            ],
          ),
          const SizedBox(height: 16),
          if (_isLoadingIssues)
            const Center(child: Padding(padding: EdgeInsets.all(32.0), child: CircularProgressIndicator()))
          else if (_myIssues.isEmpty)
            Container(
              padding: const EdgeInsets.all(32),
              alignment: Alignment.center,
              child: const Column(
                children: [
                  Icon(Icons.assignment_outlined, size: 48, color: Colors.grey),
                  SizedBox(height: 12),
                  Text('No reports submitted yet', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                  SizedBox(height: 4),
                  Text('Submitted issues will appear here live with status updates.', style: TextStyle(fontSize: 12, color: Colors.grey)),
                ],
              ),
            )
          else
            ..._myIssues.map((item) {
              final id = item['id'];
              final category = item['category'] ?? 'Civic Issue';
              final desc = item['description'] ?? 'No description';
              final status = item['status'] ?? 'Reported';
              final lat = item['latitude'];
              final lng = item['longitude'];
              final hasPhoto = item['photoPath'] != null;

              Color statusColor = Colors.orange;
              if (status == 'Resolved') statusColor = Colors.green;

              return Card(
                margin: const EdgeInsets.only(bottom: 12),
                child: ListTile(
                  contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                  leading: CircleAvatar(
                    backgroundColor: statusColor.withAlpha(38),
                    child: Icon(hasPhoto ? Icons.photo_camera : Icons.assignment, color: statusColor),
                  ),
                  title: Text('#$id • $category', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                  subtitle: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const SizedBox(height: 4),
                      Text(desc, style: const TextStyle(fontSize: 13, color: AppTheme.textDark)),
                      if (lat != null && lng != null)
                        Text('GPS: Lat ${lat.toStringAsFixed(4)}, Lng ${lng.toStringAsFixed(4)}',
                            style: const TextStyle(fontSize: 11, color: AppTheme.textMuted)),
                    ],
                  ),
                  trailing: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                    decoration: BoxDecoration(color: statusColor.withAlpha(26), borderRadius: BorderRadius.circular(12)),
                    child: Text(status, style: TextStyle(color: statusColor, fontWeight: FontWeight.bold, fontSize: 11)),
                  ),
                ),
              );
            }),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    int userTrustScore = 100;
    if (_myIssues.isNotEmpty && _myIssues.first['citizenTrustScore'] != null) {
      userTrustScore = _myIssues.first['citizenTrustScore'];
    }

    return Scaffold(
      appBar: const CustomAppBar(userName: 'Citizen'),
      body: IndexedStack(
        index: _currentIndex,
        children: [
          _buildHomeTab(),
          ReportScreen(onSuccess: () {
            _loadIssues();
            setState(() => _currentIndex = 2);
          }),
          _buildComplaintsTab(),
          CitizenProfileScreen(
            totalReports: _myIssues.length,
            trustScore: userTrustScore,
            onLogout: () async {
              await _authService.logout();
              if (context.mounted) {
                Navigator.of(context).pushReplacementNamed('/login');
              }
            },
          ),
        ],
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        onDestinationSelected: (index) {
          if (index == 0 || index == 2 || index == 3) {
            _loadIssues();
          }
          setState(() => _currentIndex = index);
        },
        destinations: const [
          NavigationDestination(icon: Icon(Icons.home_outlined), selectedIcon: Icon(Icons.home), label: 'Home'),
          NavigationDestination(icon: Icon(Icons.add_circle_outline), selectedIcon: Icon(Icons.add_circle), label: 'Report Issue'),
          NavigationDestination(icon: Icon(Icons.assignment_outlined), selectedIcon: Icon(Icons.assignment), label: 'My Reports'),
          NavigationDestination(icon: Icon(Icons.person_outline), selectedIcon: Icon(Icons.person), label: 'Profile'),
        ],
      ),
    );
  }
}
