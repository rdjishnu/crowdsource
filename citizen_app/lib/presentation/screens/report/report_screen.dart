// File: lib/presentation/screens/report/report_screen.dart
import 'dart:io';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:path_provider/path_provider.dart';
import '../../../data/local/offline_db_helper.dart';
import '../../../services/issue_service.dart';
import '../../../utils/location_helper.dart';
import '../../theme/app_theme.dart';

class ReportScreen extends StatefulWidget {
  final VoidCallback? onSuccess;

  const ReportScreen({super.key, this.onSuccess});

  @override
  State<ReportScreen> createState() => _ReportScreenState();
}

class _ReportScreenState extends State<ReportScreen> {
  final _descriptionController = TextEditingController();
  final _locationNameController = TextEditingController();
  final _issueService = IssueService();
  final _imagePicker = ImagePicker();

  String _selectedCategory = 'Pothole Repair';
  String _formattedAddress = '';
  int _aiSeverityScore = 65;
  double _latitude = 0.0;
  double _longitude = 0.0;
  XFile? _selectedImage;
  bool _isLocating = false;
  bool _isSubmitting = false;
  bool _isAnalyzingAi = false;
  bool _isAiValid = true;
  bool _showManualDropdown = false;
  String _aiRejectionMessage = '';
  double _aiConfidence = 0.0;
  String _gpsErrorMessage = '';

  final List<String> _categories = [
    'Pothole Repair',
    'Garbage & Sanitation',
    'Water & Sewage',
    'Electrical & Lighting',
    'Roads & Infrastructure',
    'Public Safety',
    'Other'
  ];

  @override
  void initState() {
    super.initState();
    _fetchLocation();
  }

  Future<void> _fetchLocation() async {
    setState(() {
      _isLocating = true;
      _gpsErrorMessage = '';
    });
    try {
      final pos = await LocationHelper.getCurrentLocation();
      final addr = await LocationHelper.getAddressFromCoordinates(pos.latitude, pos.longitude);

      if (mounted) {
        setState(() {
          _latitude = pos.latitude;
          _longitude = pos.longitude;
          _formattedAddress = addr;
          _isLocating = false;
        });
      }
    } catch (e) {
      if (mounted) {
        final errorText = e.toString().replaceAll('Exception: ', '');
        setState(() {
          _isLocating = false;
          _gpsErrorMessage = errorText;
        });
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('🚨 GPS Lock Failed: $errorText'),
            backgroundColor: Colors.red.shade800,
            duration: const Duration(seconds: 5),
          ),
        );
      }
    }
  }

  Future<void> _pickImage(ImageSource source) async {
    try {
      final picked = await _imagePicker.pickImage(
        source: source,
        maxWidth: 1024,
        maxHeight: 1024,
        imageQuality: 80,
      );

      if (picked != null && mounted) {
        setState(() {
          _selectedImage = picked;
          _isAnalyzingAi = true;
          _isAiValid = true;
          _aiRejectionMessage = '';
        });

        final aiResult = await _issueService.analyzeImageWithAi(picked);

        if (!mounted) return;

        setState(() => _isAnalyzingAi = false);

        if (aiResult['isValidCivicIssue'] == true) {
          final detected = aiResult['detectedCategory'];
          final conf = (aiResult['confidence'] as num?)?.toDouble() ?? 85.0;
          final sev = (aiResult['severityScore'] as num?)?.toInt() ?? 65;

          setState(() {
            _aiConfidence = conf;
            _aiSeverityScore = sev;
            _isAiValid = true;
            if (detected != null && _categories.contains(detected)) {
              _selectedCategory = detected;
            }
          });

          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('🤖 AI Detected: "$detected" | Priority Score: $sev/100'),
              backgroundColor: Colors.green,
              duration: const Duration(seconds: 3),
            ),
          );
        } else {
          final errorMsg = aiResult['message'] ?? 'Rejected: Image contains a person, animal, or non-civic object.';
          setState(() {
            _selectedImage = null;
            _isAiValid = false;
            _aiRejectionMessage = errorMsg;
          });
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('🚨 $errorMsg'),
              backgroundColor: Colors.red.shade800,
              duration: const Duration(seconds: 4),
            ),
          );
        }
      }
    } catch (e) {
      if (mounted) {
        setState(() => _isAnalyzingAi = false);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Could not process image: $e')),
        );
      }
    }
  }

  void _clearImage() {
    setState(() {
      _selectedImage = null;
      _isAiValid = true;
      _aiRejectionMessage = '';
      _aiConfidence = 0.0;
      _aiSeverityScore = 65;
      _showManualDropdown = false;
    });
  }

  Future<void> _handleSubmit() async {
    if (_latitude == 0.0 && _longitude == 0.0) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('🚨 Live GPS lock required before submitting report. Tap "Fetch Live Hardware GPS".'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    if (!_isAiValid) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Cannot submit: Invalid non-civic image attached. Please clear photo.'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    final desc = _descriptionController.text.trim();
    if (desc.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter a description for the issue.')),
      );
      return;
    }

    setState(() => _isSubmitting = true);

    final fullDesc = _locationNameController.text.trim().isNotEmpty
        ? '${_locationNameController.text.trim()} - $desc'
        : desc;
    final fullAddress = _formattedAddress.isNotEmpty ? _formattedAddress : 'Lat: $_latitude, Long: $_longitude';

    final connectivityResults = await Connectivity().checkConnectivity();
    final bool hasActiveNetwork = connectivityResults.any((r) =>
        r == ConnectivityResult.mobile ||
        r == ConnectivityResult.wifi ||
        r == ConnectivityResult.ethernet
    );

    if (!hasActiveNetwork) {
      await _queueOfflineReport(fullDesc, fullAddress);
      return;
    }

    final result = await _issueService.submitIssue(
      category: _selectedCategory,
      description: fullDesc,
      latitude: _latitude,
      longitude: _longitude,
      address: fullAddress,
      severityScore: _aiSeverityScore,
      imageFile: _selectedImage,
    );

    if (mounted) {
      setState(() => _isSubmitting = false);
      if (result['success'] == true) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Civic issue reported successfully to NexusGov NOC!'),
            backgroundColor: Colors.green,
          ),
        );
        _resetForm();
        widget.onSuccess?.call();
      } else {
        await _queueSilentBackgroundReport(fullDesc, fullAddress);
      }
    }
  }

  Future<void> _queueOfflineReport(String fullDesc, String fullAddress) async {
    try {
      String localImagePath = '';
      if (_selectedImage != null && !kIsWeb) {
        final appDir = await getApplicationDocumentsDirectory();
        final fileName = 'offline_${DateTime.now().millisecondsSinceEpoch}.jpg';
        final savedFile = await File(_selectedImage!.path).copy('${appDir.path}/$fileName');
        localImagePath = savedFile.path;
      }

      await OfflineDbHelper.queueIssueForUpload({
        'category': _selectedCategory,
        'description': fullDesc,
        'latitude': _latitude,
        'longitude': _longitude,
        'address': fullAddress,
        'severityScore': _aiSeverityScore,
        'localImagePath': localImagePath,
        'createdAt': DateTime.now().toIso8601String(),
      });

      if (mounted) {
        setState(() => _isSubmitting = false);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('You are offline. Your report has been saved securely and will upload automatically when you reconnect to the internet.'),
            backgroundColor: Colors.green,
            duration: Duration(seconds: 5),
          ),
        );
        _resetForm();
        widget.onSuccess?.call();
      }
    } catch (e) {
      if (mounted) {
        setState(() => _isSubmitting = false);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error queuing offline report: $e'), backgroundColor: Colors.red),
        );
      }
    }
  }

  Future<void> _queueSilentBackgroundReport(String fullDesc, String fullAddress) async {
    try {
      String localImagePath = '';
      if (_selectedImage != null && !kIsWeb) {
        final appDir = await getApplicationDocumentsDirectory();
        final fileName = 'offline_${DateTime.now().millisecondsSinceEpoch}.jpg';
        final savedFile = await File(_selectedImage!.path).copy('${appDir.path}/$fileName');
        localImagePath = savedFile.path;
      }

      await OfflineDbHelper.queueIssueForUpload({
        'category': _selectedCategory,
        'description': fullDesc,
        'latitude': _latitude,
        'longitude': _longitude,
        'address': fullAddress,
        'severityScore': _aiSeverityScore,
        'localImagePath': localImagePath,
        'createdAt': DateTime.now().toIso8601String(),
      });

      if (mounted) {
        setState(() => _isSubmitting = false);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Civic issue reported successfully to NexusGov NOC!'),
            backgroundColor: Colors.green,
            duration: Duration(seconds: 4),
          ),
        );
        _resetForm();
        widget.onSuccess?.call();
      }
    } catch (e) {
      if (mounted) {
        setState(() => _isSubmitting = false);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error submitting report: $e'), backgroundColor: Colors.red),
        );
      }
    }
  }

  void _resetForm() {
    _descriptionController.clear();
    _locationNameController.clear();
    _clearImage();
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Submit Civic Issue', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppTheme.textDark)),
          const Text('AI-First automated dispatch report to municipality officers', style: TextStyle(fontSize: 13, color: AppTheme.textMuted)),
          const SizedBox(height: 20),

          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: _gpsErrorMessage.isNotEmpty ? const Color(0x1FEF4444) : const Color(0x1F3B82F6),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                color: _gpsErrorMessage.isNotEmpty ? const Color(0xFFEF4444) : const Color(0x4D3B82F6),
                width: 1.5,
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Icon(
                      _gpsErrorMessage.isNotEmpty ? Icons.gps_off : Icons.gps_fixed,
                      color: _gpsErrorMessage.isNotEmpty ? const Color(0xFFEF4444) : const Color(0xFF1E3A8A),
                      size: 22,
                    ),
                    const SizedBox(width: 8),
                    Text(
                      _gpsErrorMessage.isNotEmpty ? 'GPS HARDWARE LOCK ERROR' : 'LIVE HARDWARE GPS TELEMETRY',
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.bold,
                        color: _gpsErrorMessage.isNotEmpty ? const Color(0xFFEF4444) : const Color(0xFF1E3A8A),
                      ),
                    ),
                    const Spacer(),
                    if (_isLocating)
                      const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(strokeWidth: 2))
                    else
                      IconButton(
                        icon: const Icon(Icons.refresh, color: Color(0xFF1E3A8A), size: 20),
                        onPressed: _fetchLocation,
                        tooltip: 'Refresh Hardware GPS',
                      ),
                  ],
                ),
                const SizedBox(height: 6),
                if (_gpsErrorMessage.isNotEmpty)
                  Text(
                    _gpsErrorMessage,
                    style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFF991B1B)),
                  )
                else if (_formattedAddress.isNotEmpty)
                  Text(
                    _formattedAddress,
                    style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Color(0xFF0F172A), height: 1.3),
                  )
                else
                  const Text(
                    'Locking onto live satellite GPS hardware...',
                    style: TextStyle(fontSize: 13, fontStyle: FontStyle.italic, color: Color(0xFF64748B)),
                  ),
                const SizedBox(height: 6),
                if (_latitude != 0.0 || _longitude != 0.0)
                  Text(
                    'LAT: ${_latitude.toStringAsFixed(5)} | LNG: ${_longitude.toStringAsFixed(5)}',
                    style: const TextStyle(fontSize: 11, color: Color(0xFF047857), fontWeight: FontWeight.bold),
                  )
                else
                  const Text(
                    'LAT: Searching... | LNG: Searching...',
                    style: TextStyle(fontSize: 11, color: Color(0xFFDC2626), fontWeight: FontWeight.bold),
                  ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          TextField(
            controller: _locationNameController,
            decoration: const InputDecoration(
              labelText: 'Landmark / Specific Landmark Details',
              hintText: 'e.g. Near City Hospital Gate 2',
              border: OutlineInputBorder(borderRadius: BorderRadius.all(Radius.circular(12))),
              prefixIcon: Icon(Icons.location_city),
            ),
          ),
          const SizedBox(height: 16),

          TextField(
            controller: _descriptionController,
            maxLines: 3,
            decoration: const InputDecoration(
              labelText: 'Detailed Description',
              hintText: 'Describe the problem clearly...',
              border: OutlineInputBorder(borderRadius: BorderRadius.all(Radius.circular(12))),
              prefixIcon: Icon(Icons.description),
            ),
          ),
          const SizedBox(height: 16),

          const Text('Attach Photo Evidence (AI Auto-Classification & Priority)', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: AppTheme.textDark)),
          const SizedBox(height: 8),
          Row(
            children: [
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: _isAnalyzingAi ? null : () => _pickImage(ImageSource.camera),
                  icon: const Icon(Icons.camera_alt),
                  label: const Text('Camera'),
                  style: OutlinedButton.styleFrom(shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10))),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: _isAnalyzingAi ? null : () => _pickImage(ImageSource.gallery),
                  icon: const Icon(Icons.photo_library),
                  label: const Text('Gallery'),
                  style: OutlinedButton.styleFrom(shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10))),
                ),
              ),
            ],
          ),

          if (_isAnalyzingAi) ...[
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: Colors.blue.shade50,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.blue.shade200),
              ),
              child: const Row(
                children: [
                  SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2)),
                  SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      '🤖 AI Analyzing Image... Auto-classifying category & ranking severity...',
                      style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.blue),
                    ),
                  ),
                ],
              ),
            ),
          ],

          if (_selectedImage != null && _isAiValid && !_isAnalyzingAi) ...[
            const SizedBox(height: 14),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF0F172A), Color(0xFF1E293B)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0xFF10B981), width: 1.5),
                boxShadow: const [
                  BoxShadow(
                    color: Color(0x3310B981),
                    blurRadius: 10,
                    offset: Offset(0, 4),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: const Color(0xFF10B981).withValues(alpha: 0.2),
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(Icons.remove_red_eye_outlined, color: Color(0xFF10B981), size: 22),
                      ),
                      const SizedBox(width: 10),
                      const Expanded(
                        child: Text(
                          'ISSUE IDENTIFIED IN PHOTO 🔍',
                          style: TextStyle(
                            color: Color(0xFF34D399),
                            fontSize: 12,
                            fontWeight: FontWeight.w900,
                            letterSpacing: 1.0,
                          ),
                        ),
                      ),
                      IconButton(
                        icon: const Icon(Icons.close, color: Colors.white70, size: 20),
                        onPressed: _clearImage,
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),
                  Text(
                    _selectedCategory,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 20,
                      fontWeight: FontWeight.w900,
                      letterSpacing: 0.5,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: _aiSeverityScore > 75 ? Colors.red : Colors.amber.shade700,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Text(
                          'Severity: $_aiSeverityScore/100 ${_aiSeverityScore > 75 ? "🚨 EMERGENCY" : ""}',
                          style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Text(
                        'AI Confidence: ${_aiConfidence.toStringAsFixed(1)}%',
                        style: const TextStyle(fontSize: 12, color: Color(0xCCFFFFFF), fontWeight: FontWeight.w600),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],

          if (!_isAiValid && _aiRejectionMessage.isNotEmpty) ...[
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0x1FEF4444),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: const Color(0xFFEF4444), width: 1.5),
              ),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Icon(Icons.gpp_bad, color: Color(0xFFEF4444), size: 24),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'AI VISION FIREWALL REJECTION 🚨',
                          style: TextStyle(color: Color(0xFFEF4444), fontWeight: FontWeight.bold, fontSize: 13),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          _aiRejectionMessage,
                          style: const TextStyle(color: Color(0xFF991B1B), fontSize: 12, height: 1.4),
                        ),
                        const SizedBox(height: 8),
                        const Text(
                          'Tap "X" to clear this photo and capture valid civic infrastructure.',
                          style: TextStyle(color: Color(0xFFB91C1C), fontSize: 11, fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.cancel, color: Color(0xFFEF4444)),
                    onPressed: _clearImage,
                  ),
                ],
              ),
            ),
          ],

          const SizedBox(height: 12),
          if (!_showManualDropdown)
            TextButton.icon(
              onPressed: () => setState(() => _showManualDropdown = true),
              icon: const Icon(Icons.edit_note, size: 18),
              label: Text('Edit Category Manually (Selected: $_selectedCategory)'),
              style: TextButton.styleFrom(foregroundColor: AppTheme.primaryNavy),
            )
          else
            DropdownButtonFormField<String>(
              initialValue: _categories.contains(_selectedCategory) ? _selectedCategory : _categories.first,
              decoration: const InputDecoration(
                labelText: 'Manual Category Override',
                border: OutlineInputBorder(borderRadius: BorderRadius.all(Radius.circular(12))),
                prefixIcon: Icon(Icons.category),
              ),
              items: _categories.map((c) => DropdownMenuItem(value: c, child: Text(c))).toList(),
              onChanged: (val) {
                if (val != null) setState(() => _selectedCategory = val);
              },
            ),

          const SizedBox(height: 28),

          _isSubmitting
              ? const Center(child: CircularProgressIndicator())
              : ElevatedButton.icon(
                  onPressed: (_isAnalyzingAi || !_isAiValid) ? null : _handleSubmit,
                  icon: const Icon(Icons.send),
                  label: Text(
                    (_latitude == 0.0 && _longitude == 0.0)
                        ? 'WAITING FOR LIVE GPS LOCK'
                        : (_isAiValid ? 'SUBMIT REPORT TO GOVERNMENT' : 'REJECTED: ATTACH CIVIC PHOTO'),
                  ),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: (_latitude != 0.0 && _isAiValid) ? AppTheme.primaryNavy : Colors.grey,
                    foregroundColor: Colors.white,
                    minimumSize: const Size.fromHeight(55),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                ),
        ],
      ),
    );
  }
}
