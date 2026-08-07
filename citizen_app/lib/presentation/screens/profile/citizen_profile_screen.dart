// File: lib/presentation/screens/profile/citizen_profile_screen.dart
import 'package:flutter/material.dart';
import '../../../services/auth_service.dart';
import '../../theme/app_theme.dart';
import '../../widgets/reputation_badge.dart';

class CitizenProfileScreen extends StatelessWidget {
  final int totalReports;
  final int trustScore;
  final VoidCallback? onLogout;

  const CitizenProfileScreen({
    super.key,
    this.totalReports = 0,
    this.trustScore = 100,
    this.onLogout,
  });

  @override
  Widget build(BuildContext context) {
    final AuthService authService = AuthService();

    return SingleChildScrollView(
      padding: const EdgeInsets.all(20.0),
      child: Column(
        children: [
          const SizedBox(height: 12),
          const CircleAvatar(
            radius: 44,
            backgroundColor: AppTheme.primaryNavy,
            child: Icon(Icons.person, size: 48, color: Colors.white),
          ),
          const SizedBox(height: 12),
          const Text('Verified Citizen', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
          const Text('NexusGov AI-Ready Reputation Node', style: TextStyle(fontSize: 13, color: AppTheme.textMuted)),
          const SizedBox(height: 16),

          // Reputation Badge Widget
          ReputationBadge(trustScore: trustScore),
          const SizedBox(height: 24),

          // Trust Score Meter Card
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: Colors.grey.shade200),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('Civic Reputation Index', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                    Icon(Icons.shield, color: AppTheme.secondaryEmerald, size: 20),
                  ],
                ),
                const SizedBox(height: 12),
                ClipRRect(
                  borderRadius: BorderRadius.circular(8),
                  child: LinearProgressIndicator(
                    value: (trustScore / 200.0).clamp(0.0, 1.0),
                    minHeight: 10,
                    backgroundColor: Colors.grey.shade200,
                    color: trustScore >= 150
                        ? AppTheme.secondaryEmerald
                        : (trustScore < 50 ? Colors.red : AppTheme.primaryNavy),
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  '$trustScore / 200 Points (Score increases +10 for resolved issues)',
                  style: const TextStyle(fontSize: 12, color: AppTheme.textMuted),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),

          Card(
            child: Column(
              children: [
                ListTile(
                  leading: const Icon(Icons.assignment, color: AppTheme.primaryNavy),
                  title: const Text('My Submitted Reports'),
                  trailing: Text('$totalReports items', style: const TextStyle(color: Colors.grey, fontSize: 12)),
                ),
                const Divider(height: 1),
                const ListTile(
                  leading: Icon(Icons.verified_user_outlined, color: AppTheme.secondaryEmerald),
                  title: Text('SHA-256 Authenticity Engine'),
                  subtitle: Text('Duplicate image & spoof detection active', style: TextStyle(fontSize: 11)),
                ),
                const Divider(height: 1),
                const ListTile(
                  leading: Icon(Icons.security, color: Colors.blue),
                  title: Text('Zero-Trust Security Audit'),
                  trailing: Icon(Icons.chevron_right),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          ElevatedButton.icon(
            onPressed: () async {
              await authService.logout();
              if (onLogout != null) {
                onLogout!();
              } else if (context.mounted) {
                Navigator.of(context).pushReplacementNamed('/login');
              }
            },
            icon: const Icon(Icons.logout),
            label: const Text('LOG OUT'),
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.red.shade600,
              foregroundColor: Colors.white,
              minimumSize: const Size.fromHeight(50),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
          ),
        ],
      ),
    );
  }
}
