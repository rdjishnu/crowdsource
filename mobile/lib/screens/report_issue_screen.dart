import 'dart:io';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../core/constants.dart';
import '../core/routes.dart';
import '../providers/issue_provider.dart';
import '../providers/location_provider.dart';
import '../widgets/image_picker_widget.dart';
import '../widgets/custom_button.dart';
import '../services/notification_service.dart';
import '../utils/formatters.dart';

class ReportIssueScreen extends StatefulWidget {
  const ReportIssueScreen({super.key});

  @override
  State<ReportIssueScreen> createState() => _ReportIssueScreenState();
}

class _ReportIssueScreenState extends State<ReportIssueScreen> {
  final _formKey = GlobalKey<FormState>();
  String _selectedCategory = AppConstants.categories.first;
  final TextEditingController _descriptionController = TextEditingController();
  File? _selectedImage;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<LocationProvider>().fetchLocation();
    });
  }

  @override
  void dispose() {
    _descriptionController.dispose();
    super.dispose();
  }

  void _submitReport() async {
    if (_selectedImage == null) {
      NotificationService.showErrorBanner(context, 'Please attach photo evidence of the civic issue.');
      return;
    }

    if (!_formKey.currentState!.validate()) return;

    final locationProvider = context.read<LocationProvider>();
    final issueProvider = context.read<IssueProvider>();

    final createdIssue = await issueProvider.submitIssue(
      category: _selectedCategory,
      description: _descriptionController.text.trim(),
      latitude: locationProvider.latitude,
      longitude: locationProvider.longitude,
      photoFile: _selectedImage!,
    );

    if (!mounted) return;

    if (createdIssue != null) {
      _showSuccessDialog(createdIssue.id);
    } else {
      NotificationService.showErrorBanner(
        context,
        issueProvider.errorMessage ?? 'Submission failed. Check backend connection.',
      );
    }
  }

  void _showSuccessDialog(int? ticketId) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: const Column(
          children: [
            Icon(Icons.check_circle_outline, color: AppColors.accentEmerald, size: 64),
            SizedBox(height: 12),
            Text('Complaint Registered!', style: TextStyle(fontWeight: FontWeight.bold)),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              'Your civic complaint #${ticketId ?? 'NEW'} has been logged with Jharkhand Municipal Authorities.',
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 14),
            ),
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: AppColors.primary.withOpacity(0.1),
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Text(
                'Initial Status: Reported\nYou can track resolution progress in Complaint History.',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 12, color: AppColors.primary, fontWeight: FontWeight.w600),
              ),
            ),
          ],
        ),
        actions: [
          ElevatedButton(
            onPressed: () {
              Navigator.pop(ctx); // close dialog
              Navigator.pushReplacementNamed(context, AppRoutes.home);
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primary,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            ),
            child: const Text('Return to Home', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final locationProvider = context.watch<LocationProvider>();
    final issueProvider = context.watch<IssueProvider>();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Report Civic Issue'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Photo Picker Box
              ImagePickerWidget(
                imageFile: _selectedImage,
                onImageSelected: (file) => setState(() => _selectedImage = file),
                onClearImage: () => setState(() => _selectedImage = null),
              ),

              const SizedBox(height: 24),

              // Category Selector
              const Text(
                'Select Issue Category',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
              ),
              const SizedBox(height: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 14),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.04),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppColors.borderDark),
                ),
                child: DropdownButtonHideUnderline(
                  child: DropdownButton<String>(
                    value: _selectedCategory,
                    isExpanded: true,
                    dropdownColor: AppColors.cardDark,
                    items: AppConstants.categories.map((cat) {
                      return DropdownMenuItem<String>(
                        value: cat,
                        child: Row(
                          children: [
                            const Icon(Icons.label_outline, size: 18, color: AppColors.primary),
                            const SizedBox(width: 10),
                            Text(cat, style: const TextStyle(fontWeight: FontWeight.w600)),
                          ],
                        ),
                      );
                    }).toList(),
                    onChanged: (val) {
                      if (val != null) setState(() => _selectedCategory = val);
                    },
                  ),
                ),
              ),

              const SizedBox(height: 20),

              // Description Input
              const Text(
                'Description & Landmarks',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
              ),
              const SizedBox(height: 8),
              TextFormField(
                controller: _descriptionController,
                maxLines: 4,
                decoration: InputDecoration(
                  hintText: 'Describe the civic problem location, severity, nearby street landmarks...',
                  filled: true,
                  fillColor: Colors.white.withOpacity(0.04),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: AppColors.borderDark),
                  ),
                ),
                validator: (val) {
                  if (val == null || val.trim().isEmpty) {
                    return 'Please enter a description of the issue.';
                  }
                  return null;
                },
              ),

              const SizedBox(height: 20),

              // GPS Location Auto Detect Card
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: AppColors.accentCyan.withOpacity(0.08),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppColors.accentCyan.withOpacity(0.3)),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.my_location, color: AppColors.accentCyan),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('GPS Coordinates Auto-Captured', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: AppColors.accentCyan)),
                          const SizedBox(height: 2),
                          Text(
                            AppFormatters.formatCoordinates(locationProvider.latitude, locationProvider.longitude),
                            style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600),
                          ),
                        ],
                      ),
                    ),
                    IconButton(
                      icon: locationProvider.isFetching
                          ? const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(strokeWidth: 2))
                          : const Icon(Icons.refresh, color: AppColors.accentCyan),
                      onPressed: () => locationProvider.fetchLocation(),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 28),

              // Upload Progress Bar
              if (issueProvider.isSubmitting) ...[
                LinearProgressIndicator(
                  value: issueProvider.uploadProgress,
                  backgroundColor: Colors.grey.shade800,
                  color: AppColors.primary,
                ),
                const SizedBox(height: 8),
                const Text(
                  'Uploading photo & submitting complaint to server...',
                  style: TextStyle(fontSize: 12, color: Colors.grey),
                ),
                const SizedBox(height: 16),
              ],

              // Submit Button
              CustomButton(
                text: 'Submit Complaint',
                icon: Icons.send,
                isLoading: issueProvider.isSubmitting,
                onPressed: _submitReport,
              ),

              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }
}
