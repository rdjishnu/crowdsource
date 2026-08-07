// File: lib/presentation/widgets/resolution_eta_card.dart
import 'package:flutter/material.dart';

class ResolutionEtaCard extends StatelessWidget {
  final int estimatedDays;
  final String status;

  const ResolutionEtaCard({
    super.key,
    this.estimatedDays = 3,
    this.status = 'Reported',
  });

  @override
  Widget build(BuildContext context) {
    if (status == 'Resolved') {
      return Container(
        margin: const EdgeInsets.symmetric(vertical: 8),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: const Color(0x1F10B981),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: const Color(0x7F10B981)),
        ),
        child: const Row(
          children: [
            Icon(Icons.check_circle, color: Color(0xFF10B981), size: 24),
            SizedBox(width: 12),
            Expanded(
              child: Text(
                'Issue successfully resolved by Jharkhand Municipality Taskforce!',
                style: TextStyle(color: Color(0xFF10B981), fontWeight: FontWeight.bold, fontSize: 13),
              ),
            ),
          ],
        ),
      );
    }

    return Container(
      margin: const EdgeInsets.symmetric(vertical: 8),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0x1F3B82F6),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0x4D3B82F6)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.timer_outlined, color: Color(0xFF1E3A8A), size: 20),
              const SizedBox(width: 8),
              Text(
                'Estimated Resolution: $estimatedDays Days',
                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Color(0xFF1E3A8A)),
              ),
            ],
          ),
          const SizedBox(height: 6),
          Text(
            'Based on the mathematical severity score and category, municipality officers expect to complete repairs within $estimatedDays business days. Thank you for making Jharkhand better!',
            style: const TextStyle(fontSize: 12, color: Color(0xFF475569), height: 1.4),
          ),
        ],
      ),
    );
  }
}
