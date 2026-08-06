import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';
import '../services/location_service.dart';
import '../core/constants.dart';

class LocationProvider with ChangeNotifier {
  final LocationService _locationService = LocationService();

  double _latitude = AppConstants.defaultLat;
  double _longitude = AppConstants.defaultLng;
  bool _isFetching = false;

  double get latitude => _latitude;
  double get longitude => _longitude;
  bool get isFetching => _isFetching;

  Future<void> fetchLocation() async {
    _isFetching = true;
    notifyListeners();

    try {
      Position position = await _locationService.getCurrentLocation();
      _latitude = position.latitude;
      _longitude = position.longitude;
    } catch (_) {
      _latitude = AppConstants.defaultLat;
      _longitude = AppConstants.defaultLng;
    } finally {
      _isFetching = false;
      notifyListeners();
    }
  }

  void setCoordinates(double lat, double lng) {
    _latitude = lat;
    _longitude = lng;
    notifyListeners();
  }
}
