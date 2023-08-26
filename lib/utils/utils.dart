import 'package:shared_preferences/shared_preferences.dart';

Future<void> saveAsyncData(String key, String value) async {
  SharedPreferences preferences = await SharedPreferences.getInstance();
  await preferences.setString(key, value);
}

Future<String> getAsyncData(String key) async {
  SharedPreferences preferences = await SharedPreferences.getInstance();
  String? requiredString = preferences.getString(key);
  return requiredString ?? "null";
}
