// File: lib/utils/location_helper.dart
import 'package:geocoding/geocoding.dart';
import 'package:geolocator/geolocator.dart';

class LocationHelper {
  /// Queries the physical device hardware GPS sensor strictly using LocationAccuracy.best with a 15s timeout
  static Future<Position> getCurrentLocation() async {
    bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      await Geolocator.openLocationSettings();
      serviceEnabled = await Geolocator.isLocationServiceEnabled();
      if (!serviceEnabled) {
        throw Exception('Location Services (GPS) are disabled on your device. Please enable High Accuracy Location.');
      }
    }

    LocationPermission permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        throw Exception('Location permission was denied. Access is required for live GPS telemetry.');
      }
    }

    if (permission == LocationPermission.deniedForever) {
      throw Exception('Location permission is permanently denied in device settings.');
    }

    try {
      // Query physical hardware GPS sensor directly with LocationAccuracy.best and 15s timeout
      return await Geolocator.getCurrentPosition(
        locationSettings: const LocationSettings(
          accuracy: LocationAccuracy.best,
          timeLimit: Duration(seconds: 15),
        ),
      );
    } catch (e) {
      throw Exception('Failed to get live hardware GPS. Please step outside or enable High Accuracy Location on your phone.');
    }
  }

  /// Translates Lat/Long coordinates to a human-readable street address using native OS geocoder.
  /// Returns "Lat: $lat, Long: $long" if geocoding fails. NEVER returns hardcoded dummy locations.
  static Future<String> getAddressFromCoordinates(double lat, double long) async {
    try {
      final geocoding = Geocoding();
      final List<Placemark> placemarks = await geocoding.placemarkFromCoordinates(lat, long);
      if (placemarks.isNotEmpty) {
        final place = placemarks.first;
        final parts = <String>[];

        if (place.street != null && place.street!.isNotEmpty && !place.street!.contains('+')) {
          parts.add(place.street!);
        }
        if (place.subLocality != null && place.subLocality!.isNotEmpty) {
          parts.add(place.subLocality!);
        }
        if (place.locality != null && place.locality!.isNotEmpty) {
          parts.add(place.locality!);
        }
        if (place.administrativeArea != null && place.administrativeArea!.isNotEmpty) {
          parts.add(place.administrativeArea!);
        }

        if (parts.isNotEmpty) {
          return parts.join(', ');
        }
      }
    } catch (e) {
      // Native geocoding unavailable or offline
    }

    return 'Lat: ${lat.toStringAsFixed(4)}, Long: ${long.toStringAsFixed(4)}';
  }
}
