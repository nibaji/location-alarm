import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:location_alarm_flutter/utils/utils.dart';

import 'package:location_alarm_flutter/pages/home_page.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatefulWidget {
  const MyApp({super.key});

  @override
  State<MyApp> createState() => _MyApp();
}

class _MyApp extends State<MyApp> {
  Brightness _appTheme = Brightness.light;
  bool _isDarkTheme = false;

  void _setTheme({Brightness theme = Brightness.light}) {
    setState(() {
      _appTheme = theme;
      _isDarkTheme = _appTheme == Brightness.dark;
    });
    saveAsyncData(
      "isDarkTheme",
      jsonEncode(_isDarkTheme),
    );
  }

  @override
  void initState() {
    getAsyncData("isDarkTheme").then((value) {
      setState(() {
        _isDarkTheme = jsonDecode(value);
      });
    }).catchError((error) {
      debugPrint(error.toString());
    });
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Geo Alarm',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
            seedColor: const Color.fromRGBO(130, 219, 126, 1),
            brightness: _appTheme),
        useMaterial3: true,
      ),
      home: HomePage(
        title: 'Geo Alarm',
        setTheme: _setTheme,
        isDarkTheme: _isDarkTheme,
      ),
    );
  }
}
