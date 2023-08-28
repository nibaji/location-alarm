import 'dart:math' as math;

import 'package:shared_preferences/shared_preferences.dart';
import 'package:location/location.dart';

import 'package:location_alarm_flutter/model/alarms_model.dart';

Future<void> saveAsyncData(String key, dynamic value, {bool? isTheme}) async {
  SharedPreferences preferences = await SharedPreferences.getInstance();
  if (isTheme != null && isTheme) {
    await preferences.setBool(key, value);
    return;
  } else {
    await preferences.setString(key, value);
    return;
  }
}

Future<dynamic> getAsyncData(String key, {bool? isTheme}) async {
  SharedPreferences preferences = await SharedPreferences.getInstance();
  if (isTheme != null && isTheme) {
    bool? requiredBool = preferences.getBool(key);
    return requiredBool ?? false;
  }
  String? requiredString = preferences.getString(key);
  return requiredString ?? "{}";
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

  num targetLatitude = targetLocation.latitude!;
  num targetLongitude = targetLocation.longitude!;
  num currentLatitude = currentLocation.latitude!.toDouble();
  num currentLongitude = currentLocation.longitude!.toDouble();

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
