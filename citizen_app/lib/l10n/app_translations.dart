// File: lib/l10n/app_translations.dart
class AppTranslations {
  static String currentLanguage = 'en'; // 'en' or 'hi'

  static const Map<String, Map<String, String>> _localizedValues = {
    'en': {
      'app_title': 'Jharkhand Civic Pulse',
      'home': 'Home',
      'report_issue': 'Report Issue',
      'my_reports': 'My Reports',
      'profile': 'Profile',
      'offline_banner': 'You are offline. Reports will be saved and uploaded automatically when connected.',
      'offline_mode': 'Offline Storage Mode',
      'verified_citizen': 'Verified Citizen',
      'file_new_report': 'File New Report',
      'submit_report': 'SUBMIT REPORT TO GOVERNMENT',
      'category': 'Category',
      'description': 'Description',
      'upvote': "I'M FACING THIS TOO (Upvote)",
    },
    'hi': {
      'app_title': 'झारखंड नागरिक पल्स',
      'home': 'मुख्य पृष्ठ',
      'report_issue': 'शिकायत दर्ज करें',
      'my_reports': 'मेरी शिकायतें',
      'profile': 'प्रोफ़ाइल',
      'offline_banner': 'आप ऑफ़लाइन हैं। नेटवर्क से जुड़ने पर रिपोर्ट स्वतः अपलोड हो जाएगी।',
      'offline_mode': 'ऑफ़लाइन संग्रहण मोड',
      'verified_citizen': 'सत्यापित नागरिक',
      'file_new_report': 'नई शिकायत दर्ज करें',
      'submit_report': 'सरकार को शिकायत भेजें',
      'category': 'श्रेणी',
      'description': 'विवरण',
      'upvote': 'मुझे भी इस समस्या का सामना है (समर्थन करें)',
    },
  };

  static String getText(String key) {
    return _localizedValues[currentLanguage]?[key] ?? _localizedValues['en']?[key] ?? key;
  }
}
