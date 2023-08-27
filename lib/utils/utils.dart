import 'dart:math' as math;

import 'package:shared_preferences/shared_preferences.dart';
import 'package:location/location.dart';

import 'package:location_alarm_flutter/model/alarms_model.dart';

Future<void> saveAsyncData(String key, String value) async {
  SharedPreferences preferences = await SharedPreferences.getInstance();
  await preferences.setString(key, value);
}

Future<String> getAsyncData(String key) async {
  SharedPreferences preferences = await SharedPreferences.getInstance();
  String? requiredString = preferences.getString(key);
  return requiredString ?? "null";
}

// https://stackoverflow.com/a/27943
bool isLocationReached(
  LocationData currentLocation,
  LocationModel targetLocation,
  num radius,
) {
  const earthRadius = 6371000; // Radius of the Earth in meters
  num degToRad(num degrees) {
    return degrees * (math.pi / 180);
  }

  num targetLatitude = targetLocation.latitude;
  num targetLongitude = targetLocation.longitude;
  num currentLatitude = currentLocation.latitude?.toDouble() ?? 0;
  num currentLongitude = currentLocation.longitude?.toDouble() ?? 0;

  num latitudeDifference = degToRad(targetLatitude - currentLatitude);
  num longitudeDifference = degToRad(targetLongitude - currentLongitude);
  num squareHalfLatitudeDifference =
      math.sin(latitudeDifference / 2) * math.sin(latitudeDifference / 2);
  num squareHalfLongitudeDifference =
      math.sin(longitudeDifference / 2) * math.sin(longitudeDifference / 2);
  num haversineTerm = squareHalfLatitudeDifference +
      math.cos(degToRad(currentLatitude)) *
          math.cos(degToRad(targetLatitude)) *
          squareHalfLongitudeDifference;
  num angularDistance =
      2 * math.atan2(math.sqrt(haversineTerm), math.sqrt(1 - haversineTerm));
  num distance = earthRadius * angularDistance; // Distance in meters

  return distance - radius <= 0 ? true : false;
}
