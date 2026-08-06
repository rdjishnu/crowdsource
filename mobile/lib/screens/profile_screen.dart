import 'package:flutter/material.dart';
import '../core/constants.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Citizen Profile'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            const CircleAvatar(
              radius: 48,
              backgroundColor: AppColors.primary,
              child: Icon(Icons.person, size: 54, color: Colors.white),
            ),
            const SizedBox(height: 14),
            const Text('Rajesh Kumar', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
            const SizedBox(height: 4),
            const Text('Verified Citizen • Ranchi District', style: TextStyle(color: AppColors.accentCyan, fontSize: 13)),

            const SizedBox(height: 24),

            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  children: [
                    _buildInfoTile('Aadhaar Linked Status', 'Verified ✔', AppColors.accentEmerald),
                    const Divider(height: 20),
                    _buildInfoTile('Registered Mobile', '+91 98765 43210', Colors.white),
                    const Divider(height: 20),
                    _buildInfoTile('Municipal Corporation', 'Ranchi (RMC)', Colors.white),
                    const Divider(height: 20),
                    _buildInfoTile('Civic Impact Score', '120 Points ⭐', AppColors.accentAmber),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoTile(String label, String value, Color valueColor) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: const TextStyle(color: Colors.grey, fontSize: 13)),
        Text(value, style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: valueColor)),
      ],
    );
  }
}
