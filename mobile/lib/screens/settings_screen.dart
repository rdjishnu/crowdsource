import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../core/constants.dart';
import '../providers/theme_provider.dart';
import '../providers/issue_provider.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  final TextEditingController _urlController = TextEditingController(text: AppConstants.defaultBaseUrl);

  @override
  void dispose() {
    _urlController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final themeProvider = context.watch<ThemeProvider>();
    final issueProvider = context.read<IssueProvider>();

    return Scaffold(
      appBar: AppBar(
        title: const Text('App Settings'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Theme Toggle
          Card(
            child: SwitchListTile(
              secondary: Icon(
                themeProvider.isDarkMode ? Icons.dark_mode : Icons.light_mode,
                color: AppColors.primary,
              ),
              title: const Text('Dark Mode Aesthetics', style: TextStyle(fontWeight: FontWeight.bold)),
              subtitle: const Text('Modern government portal dark theme'),
              value: themeProvider.isDarkMode,
              onChanged: (_) => themeProvider.toggleTheme(),
            ),
          ),

          const SizedBox(height: 16),

          // Backend API Server Configuration
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Row(
                    children: [
                      Icon(Icons.dns_outlined, color: AppColors.accentCyan),
                      SizedBox(width: 10),
                      Text('Backend API Endpoint', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                    ],
                  ),
                  const SizedBox(height: 8),
                  const Text('Set localhost or server URL for API communication', style: TextStyle(fontSize: 12, color: Colors.grey)),
                  const SizedBox(height: 12),
                  TextField(
                    controller: _urlController,
                    decoration: InputDecoration(
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                      filled: true,
                    ),
                  ),
                  const SizedBox(height: 12),
                  ElevatedButton(
                    onPressed: () {
                      issueProvider.updateBaseUrl(_urlController.text.trim());
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Backend API URL updated successfully!')),
                      );
                    },
                    style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary),
                    child: const Text('Save & Reconnect', style: TextStyle(color: Colors.white)),
                  ),
                ],
              ),
            ),
          ),

          const SizedBox(height: 16),

          // Help & Government Info Card
          Card(
            child: ListTile(
              leading: const Icon(Icons.phone_in_talk, color: AppColors.accentEmerald),
              title: const Text('Jharkhand Civic Toll-Free Helpline', style: TextStyle(fontWeight: FontWeight.bold)),
              subtitle: const Text('1800-XXX-XXXX • 24x7 Municipal Support'),
            ),
          ),
        ],
      ),
    );
  }
}
