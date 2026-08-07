// File: lib/presentation/screens/map/issue_bottom_sheet.dart
import 'package:flutter/material.dart';
import '../../../services/issue_service.dart';
import '../../theme/app_theme.dart';
import '../../widgets/severity_indicator.dart';

class IssueBottomSheet extends StatefulWidget {
  final Map<String, dynamic> issue;
  final VoidCallback? onSupported;

  const IssueBottomSheet({
    super.key,
    required this.issue,
    this.onSupported,
  });

  @override
  State<IssueBottomSheet> createState() => _IssueBottomSheetState();
}

class _IssueBottomSheetState extends State<IssueBottomSheet> {
  final IssueService _issueService = IssueService();
  late int _supportCount;
  late int _severityScore;
  late bool _isEmergency;
  bool _isSupporting = false;
  bool _hasSupported = false;

  @override
  void initState() {
    super.initState();
    final dispatchData = widget.issue['dispatchData'] ?? {};
    _supportCount = dispatchData['supportCount'] ?? 1;
    _severityScore = dispatchData['severityScore'] ?? 50;
    _isEmergency = dispatchData['isEmergency'] ?? false;
  }

  Future<void> _handleSupport() async {
    if (_hasSupported || _isSupporting) return;

    setState(() => _isSupporting = true);
    final issueId = widget.issue['id'];
    if (issueId == null) return;

    final result = await _issueService.supportIssue(issueId);

    if (mounted) {
      setState(() => _isSupporting = false);

      if (result['success'] == true) {
        final updatedData = result['data']['dispatchData'] ?? {};
        setState(() {
          _hasSupported = true;
          _supportCount = updatedData['supportCount'] ?? (_supportCount + 1);
          _severityScore = updatedData['severityScore'] ?? (_severityScore + 5);
          _isEmergency = updatedData['isEmergency'] ?? (_severityScore > 85);
        });

        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('👍 Thank you! Upvoted issue #${widget.issue['id']}. Duplicate report merged.'),
            backgroundColor: AppTheme.secondaryEmerald,
          ),
        );

        if (widget.onSupported != null) {
          widget.onSupported!();
        }
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Failed to upvote issue. Check network connection.'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final id = widget.issue['id'];
    final category = widget.issue['category'] ?? 'Civic Issue';
    final desc = widget.issue['description'] ?? 'No description provided';
    final dispatchData = widget.issue['dispatchData'] ?? {};
    final dept = dispatchData['assignedDepartment'] ?? 'Municipal General';
    final photoPath = widget.issue['photoPath'];

    return Container(
      padding: const EdgeInsets.all(24.0),
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Drag handle
          Center(
            child: Container(
              width: 40,
              height: 4,
              margin: const EdgeInsets.only(bottom: 16),
              decoration: BoxDecoration(
                color: Colors.grey.shade300,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          ),

          // Header Badges
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: const Color(0x1F1E3A8A),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  dept,
                  style: const TextStyle(color: AppTheme.primaryNavy, fontWeight: FontWeight.bold, fontSize: 11),
                ),
              ),
              SeverityIndicator(severityScore: _severityScore, isEmergency: _isEmergency),
            ],
          ),
          const SizedBox(height: 12),

          Text('#$id • $category', style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppTheme.textDark)),
          const SizedBox(height: 8),

          Text(desc, style: const TextStyle(fontSize: 14, color: AppTheme.textMuted, height: 1.4)),
          const SizedBox(height: 16),

          if (photoPath != null)
            ClipRRect(
              borderRadius: BorderRadius.circular(12),
              child: Image.network(
                'http://localhost:8080/api/images/$photoPath',
                height: 160,
                width: double.infinity,
                fit: BoxFit.cover,
                errorBuilder: (_, __, ___) => const SizedBox.shrink(),
              ),
            ),
          const SizedBox(height: 20),

          // Upvote / Support Counter Row
          Row(
            children: [
              const Icon(Icons.people_outline, color: AppTheme.primaryNavy, size: 20),
              const SizedBox(width: 6),
              Text(
                '$_supportCount citizens facing this issue',
                style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: AppTheme.primaryNavy),
              ),
            ],
          ),
          const SizedBox(height: 16),

          // Prominent "I'm facing this too" Upvote Button
          ElevatedButton.icon(
            onPressed: _hasSupported ? null : _handleSupport,
            icon: _isSupporting
                ? const SizedBox(width: 18, height: 18, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                : Icon(_hasSupported ? Icons.check_circle : Icons.thumb_up_alt),
            label: Text(
              _hasSupported ? 'UPVOTED (Report Merged)' : "I'M FACING THIS TOO (Upvote)",
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
            ),
            style: ElevatedButton.styleFrom(
              backgroundColor: _hasSupported ? Colors.grey : AppTheme.secondaryEmerald,
              foregroundColor: Colors.white,
              minimumSize: const Size.fromHeight(50),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
            ),
          ),
        ],
      ),
    );
  }
}
