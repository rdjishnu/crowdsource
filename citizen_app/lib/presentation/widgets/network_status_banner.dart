// File: lib/presentation/widgets/network_status_banner.dart
import 'package:flutter/material.dart';
import '../../l10n/app_translations.dart';

class NetworkStatusBanner extends StatelessWidget {
  final bool isOffline;
  final int pendingCount;
  final VoidCallback? onSyncPressed;

  const NetworkStatusBanner({
    super.key,
    this.isOffline = false,
    this.pendingCount = 0,
    this.onSyncPressed,
  });

  @override
  Widget build(BuildContext context) {
    if (!isOffline && pendingCount == 0) {
      return const SizedBox.shrink();
    }

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
      decoration: BoxDecoration(
        color: isOffline ? const Color(0xFFEF4444) : const Color(0xFFF59E0B),
        boxShadow: const [
          BoxShadow(color: Colors.black26, blurRadius: 4, offset: Offset(0, 2)),
        ],
      ),
      child: SafeArea(
        bottom: false,
        child: Row(
          children: [
            Icon(
              isOffline ? Icons.wifi_off : Icons.cloud_upload,
              color: Colors.white,
              size: 20,
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Text(
                isOffline
                    ? AppTranslations.getText('offline_banner')
                    : 'Network Restored: $pendingCount offline reports ready to sync.',
                style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold),
              ),
            ),
            if (pendingCount > 0 && onSyncPressed != null)
              TextButton(
                onPressed: onSyncPressed,
                style: TextButton.styleFrom(
                  backgroundColor: Colors.white,
                  foregroundColor: Colors.black,
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                ),
                child: const Text('SYNC NOW', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
              ),
          ],
        ),
      ),
    );
  }
}
