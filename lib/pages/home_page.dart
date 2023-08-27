import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:location/location.dart';

import 'package:location_alarm_flutter/widgets/alarm_form.dart';
import 'package:location_alarm_flutter/widgets/alarm_list_item.dart';

import 'package:location_alarm_flutter/utils/utils.dart';
import 'package:location_alarm_flutter/model/alarms_model.dart';
import 'package:location_alarm_flutter/consts.dart';

// ignore: must_be_immutable
class HomePage extends StatefulWidget {
  HomePage({
    super.key,
    required this.title,
    required this.setTheme,
    required this.isDarkTheme,
  });

  final String title;
  void Function({Brightness theme}) setTheme;
  bool isDarkTheme;

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  bool _showBottomSheet = false;

  final Map<String, AlarmModel> _alarmsMap = {};
  List<AlarmModel> activeAlarms = [];

  dynamic _currentAlarm;
  dynamic _formDraft;

  late bool _serviceEnabled;
  late PermissionStatus _permissionGranted;
  late LocationData _locationData;

  void _changeBottomSheetVisibility() {
    setState(() {
      _showBottomSheet = !_showBottomSheet;
    });
  }

  void _createEditAlarm(String id, AlarmModel newAlarmData) {
    setState(() {
      _alarmsMap[id] = newAlarmData;
    });
    saveAsyncData(
      "alarms",
      jsonEncode(_alarmsMap),
    );
  }

  void _deleteAlarm(String id) {
    setState(() {
      _alarmsMap.removeWhere((String key, dynamic value) => key == id);
    });
    saveAsyncData(
      "alarms",
      jsonEncode(_alarmsMap),
    );
  }

  void _setCurrentAlarm(dynamic alarm) {
    setState(() {
      _currentAlarm = alarm;
    });
  }

  void _setFormDraft(dynamic draft) {
    setState(() {
      _formDraft = draft;
    });
  }

  Location location = Location();

  Future<void> getLocation() async {
    _serviceEnabled = await location.serviceEnabled();
    if (!_serviceEnabled) {
      _serviceEnabled = await location.requestService();
      if (!_serviceEnabled) {
        return;
      }
    }

    _permissionGranted = await location.hasPermission();
    if (_permissionGranted == PermissionStatus.denied) {
      _permissionGranted = await location.requestPermission();
      if (_permissionGranted != PermissionStatus.granted) {
        return;
      }
    }

    location.enableBackgroundMode(enable: true);

    _locationData = await location.getLocation();
  }

  bool shouldStartService() {
    activeAlarms = [];
    for (var e in _alarmsMap.values) {
      if (e.active) {
        activeAlarms.add(e);
      }
    }
    if (activeAlarms.isNotEmpty) {
      return true;
    }
    return false;
  }

  void runService() {
    if (shouldStartService()) {
      location.enableBackgroundMode(enable: true);
      location.onLocationChanged.listen(
        (LocationData currentLocation) {
          debugPrint(currentLocation.toString());
          for (var element in activeAlarms) {
            isLocationReached(
              currentLocation,
              element.location,
              element.radius,
            );
          }
        },
      );
    }
  }

  @override
  void initState() {
    getAsyncData("alarms").then((value) {
      setState(() {
        Map<String, dynamic> jsonData = jsonDecode(value);
        for (var element in jsonData.values) {
          AlarmModel alarm;
          alarm = AlarmModel.fromJson(element);
          _alarmsMap[alarm.id] = alarm;
        }
      });
    }).catchError((error) {
      debugPrint(error.toString());
    });
    getLocation().then(
      (value) => runService(),
    );
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.background,
        title: Text(widget.title),
        titleTextStyle: TextStyle(
          color: Theme.of(context).colorScheme.primary,
          fontWeight: FontWeight.bold,
          fontSize: values["m"]?.toDouble(),
        ),
        actions: [
          InkWell(
            onTap: () => widget.setTheme(
                theme: widget.isDarkTheme ? Brightness.light : Brightness.dark),
            child: Padding(
              padding: EdgeInsets.all(values["s"]?.toDouble() ?? 0.0),
              child: Icon(
                widget.isDarkTheme ? Icons.dark_mode : Icons.light_mode,
                color: Theme.of(context).dividerColor,
                size: values["m"]?.toDouble(),
              ),
            ),
          ),
        ],
      ),
      body: Builder(
        builder: (context) {
          List<AlarmModel> alarmsList = [..._alarmsMap.values.map((e) => e)];
          return Center(
            child: ListView.builder(
              itemCount: alarmsList.length,
              itemBuilder: (BuildContext context, int index) {
                return AlarmListItem(
                  alarm: alarmsList[index],
                  createEditAlarm: _createEditAlarm,
                  deleteAlarm: _deleteAlarm,
                  setCurrentAlarm: _setCurrentAlarm,
                  showBottomSheet: _changeBottomSheetVisibility,
                  runService: runService,
                );
              },
            ),
          );
        },
      ),
      bottomSheet: _showBottomSheet
          ? AlarmForm(
              createEditAlarm: _createEditAlarm,
              currentAlarm: _currentAlarm,
              formDraft: _formDraft,
              setCurrentAlarm: _setCurrentAlarm,
              setFormDraft: _setFormDraft,
              closeBottomSheet: _changeBottomSheetVisibility,
            )
          : null,
      floatingActionButton: FloatingActionButton(
        onPressed: _changeBottomSheetVisibility,
        tooltip: 'Add new Alarm',
        child:
            _showBottomSheet ? const Icon(Icons.close) : const Icon(Icons.add),
      ), // This trailing comma makes auto-formatting nicer for build methods.
    );
  }
}
