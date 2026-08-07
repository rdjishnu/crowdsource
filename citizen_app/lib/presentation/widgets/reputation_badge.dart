// File: lib/presentation/widgets/reputation_badge.dart
import 'package:flutter/material.dart';

class ReputationBadge extends StatelessWidget {
  final int trustScore;

  const ReputationBadge({super.key, this.trustScore = 100});

  @override
  Widget build(BuildContext context) {
    String badgeTitle = 'Standard Reporter';
    IconData badgeIcon = Icons.verified_user;
    Color badgeColor = const Color(0xFF3B82F6);
    Color bgColor = const Color(0x1F3B82F6);

    if (trustScore >= 150) {
      badgeTitle = 'Verified Reporter ⭐';
      badgeIcon = Icons.stars;
      badgeColor = const Color(0xFF10B981);
      bgColor = const Color(0x1F10B981);
    } else if (trustScore < 50) {
      badgeTitle = 'Warning / Needs Verification ⚠️';
      badgeIcon = Icons.warning_amber_rounded;
      badgeColor = const Color(0xFFEF4444);
      bgColor = const Color(0x1FEF4444);
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: badgeColor.withAlpha(76)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(badgeIcon, color: badgeColor, size: 18),
          const SizedBox(width: 8),
          Text(
            '$badgeTitle ($trustScore Pts)',
            style: TextStyle(
              color: badgeColor,
              fontWeight: FontWeight.bold,
              fontSize: 13,
            ),
          ),
        ],
      ),
    );
  }
}
