import 'package:flutter/material.dart';
import '../screens/home_screen.dart';
import '../screens/report_issue_screen.dart';
import '../screens/complaint_history_screen.dart';
import '../screens/issue_detail_screen.dart';
import '../screens/map_screen.dart';
import '../screens/settings_screen.dart';
import '../screens/profile_screen.dart';
import '../models/issue.dart';

class AppRoutes {
  static const String home = '/';
  static const String reportIssue = '/report-issue';
  static const String complaintHistory = '/complaint-history';
  static const String issueDetail = '/issue-detail';
  static const String map = '/map';
  static const String settings = '/settings';
  static const String profile = '/profile';

  static Route<dynamic> generateRoute(RouteSettings settings) {
    switch (settings.name) {
      case '/':
        return MaterialPageRoute(builder: (_) => const HomeScreen());
      case '/report-issue':
        return MaterialPageRoute(builder: (_) => const ReportIssueScreen());
      case '/complaint-history':
        return MaterialPageRoute(builder: (_) => const ComplaintHistoryScreen());
      case '/map':
        return MaterialPageRoute(builder: (_) => const MapScreen());
      case '/settings':
        return MaterialPageRoute(builder: (_) => const SettingsScreen());
      case '/profile':
        return MaterialPageRoute(builder: (_) => const ProfileScreen());
      case '/issue-detail':
        final issue = settings.arguments as Issue?;
        return MaterialPageRoute(
          builder: (_) => IssueDetailScreen(issue: issue),
        );
      default:
        return MaterialPageRoute(
          builder: (_) => Scaffold(
            body: Center(
              child: Text('No route defined for ${settings.name}'),
            ),
          ),
        );
    }
  }
}
