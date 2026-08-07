// File: lib/presentation/widgets/language_toggle.dart
import 'package:flutter/material.dart';
import '../../l10n/app_translations.dart';

class LanguageToggle extends StatefulWidget {
  final VoidCallback? onLanguageChanged;

  const LanguageToggle({super.key, this.onLanguageChanged});

  @override
  State<LanguageToggle> createState() => _LanguageToggleState();
}

class _LanguageToggleState extends State<LanguageToggle> {
  @override
  Widget build(BuildContext context) {
    bool isHindi = AppTranslations.currentLanguage == 'hi';

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: Colors.white.withAlpha(51),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.white.withAlpha(76)),
      ),
      child: InkWell(
        onTap: () {
          setState(() {
            AppTranslations.currentLanguage = isHindi ? 'en' : 'hi';
          });
          if (widget.onLanguageChanged != null) {
            widget.onLanguageChanged!();
          }
        },
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.language, color: Colors.white, size: 16),
            const SizedBox(width: 6),
            Text(
              isHindi ? 'हिन्दी (HI)' : 'English (EN)',
              style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold),
            ),
          ],
        ),
      ),
    );
  }
}
