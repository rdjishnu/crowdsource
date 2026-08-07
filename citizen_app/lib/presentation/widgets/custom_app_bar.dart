// File: lib/presentation/widgets/custom_app_bar.dart
import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

class CustomAppBar extends StatelessWidget implements PreferredSizeWidget {
  final String userName;
  final VoidCallback? onNotificationTap;

  const CustomAppBar({
    super.key,
    this.userName = 'Citizen',
    this.onNotificationTap,
  });

  @override
  Size get preferredSize => const Size.fromHeight(70.0);

  @override
  Widget build(BuildContext context) {
    return AppBar(
      backgroundColor: AppTheme.primaryNavy,
      elevation: 0,
      automaticallyImplyLeading: false,
      toolbarHeight: 70,
      title: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: const BoxDecoration(
              color: Color(0x26FFFFFF),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.account_balance, color: Colors.white, size: 24),
          ),
          const SizedBox(width: 12),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Row(
                children: [
                  const Text(
                    'NexusGov',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                      letterSpacing: 0.5,
                    ),
                  ),
                  const SizedBox(width: 8),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                    decoration: BoxDecoration(
                      color: AppTheme.secondaryEmerald,
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: const Text(
                      'CIVIC',
                      style: TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                  ),
                ],
              ),
              Text(
                'Welcome back, $userName',
                style: const TextStyle(
                  fontSize: 12,
                  color: Color(0xCCFFFFFF),
                ),
              ),
            ],
          ),
        ],
      ),
      actions: [
        IconButton(
          icon: Stack(
            children: [
              const Icon(Icons.notifications_outlined, color: Colors.white, size: 26),
              Positioned(
                right: 0,
                top: 0,
                child: Container(
                  padding: const EdgeInsets.all(3),
                  decoration: const BoxDecoration(
                    color: AppTheme.secondaryEmerald,
                    shape: BoxShape.circle,
                  ),
                  child: const Text(
                    '2',
                    style: TextStyle(
                      fontSize: 9,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                ),
              ),
            ],
          ),
          onPressed: onNotificationTap ?? () {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('Notifications: 2 new civic updates')),
            );
          },
        ),
        const SizedBox(width: 8),
      ],
    );
  }
}
