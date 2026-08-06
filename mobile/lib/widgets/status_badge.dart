import 'package:flutter/material.dart';
import '../core/constants.dart';

class StatusBadge extends StatelessWidget {
  final String status;

  const StatusBadge({super.key, required this.status});

  @override
  Widget build(BuildContext context) {
    Color bg;
    Color border;
    Color text;

    switch (status) {
      case AppConstants.statusReported:
        bg = const Color(0x26F59E0B);
        border = const Color(0x66F59E0B);
        text = const Color(0xFFFBBF24);
        break;
      case AppConstants.statusInProgress:
        bg = const Color(0x2606B6D4);
        border = const Color(0x6606B6D4);
        text = const Color(0xFF38BDF8);
        break;
      case AppConstants.statusResolved:
        bg = const Color(0x2610B981);
        border = const Color(0x6610B981);
        text = const Color(0xFF34D399);
        break;
      case AppConstants.statusRejected:
        bg = const Color(0x26EF4444);
        border = const Color(0x66EF4444);
        text = const Color(0xFFF87171);
        break;
      default:
        bg = Colors.grey.withOpacity(0.2);
        border = Colors.grey;
        text = Colors.white;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(999),
        border: Border.all(color: border, width: 1),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 6,
            height: 6,
            decoration: BoxDecoration(color: text, shape: BoxShape.circle),
          ),
          const SizedBox(width: 6),
          Text(
            status,
            style: TextStyle(
              color: text,
              fontSize: 11,
              fontWeight: FontWeight.bold,
              letterSpacing: 0.3,
            ),
          ),
        ],
      ),
    );
  }
}
