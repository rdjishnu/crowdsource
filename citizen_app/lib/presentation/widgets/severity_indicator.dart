// File: lib/presentation/widgets/severity_indicator.dart
import 'package:flutter/material.dart';

class SeverityIndicator extends StatelessWidget {
  final int severityScore;
  final bool isEmergency;

  const SeverityIndicator({
    super.key,
    this.severityScore = 50,
    this.isEmergency = false,
  });

  @override
  Widget build(BuildContext context) {
    Color color = Colors.green;
    String label = 'Low Priority';

    if (isEmergency || severityScore > 85) {
      color = Colors.red;
      label = 'EMERGENCY 🚨';
    } else if (severityScore > 65) {
      color = Colors.orange;
      label = 'High Priority';
    } else if (severityScore > 40) {
      color = Colors.amber.shade700;
      label = 'Medium Priority';
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: color.withAlpha(26),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withAlpha(76)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 8,
            height: 8,
            decoration: BoxDecoration(color: color, shape: BoxShape.circle),
          ),
          const SizedBox(width: 6),
          Text(
            '$label ($severityScore Score)',
            style: TextStyle(
              color: color,
              fontWeight: FontWeight.bold,
              fontSize: 11,
            ),
          ),
        ],
      ),
    );
  }
}
