import 'dart:async';
import 'dart:convert';

import 'package:awesome_notifications/awesome_notifications.dart';
import 'package:flutter/material.dart';
import 'package:location/location.dart';
import 'package:alarmplayer/alarmplayer.dart';
import 'package:optimize_battery/optimize_battery.dart';
import 'package:permission_handler/permission_handler.dart' as Permissions;
import 'package:vibration/vibration.dart';

import 'package:location_alarm_flutter/widgets/alarm_form.dart';
import 'package:location_alarm_flutter/widgets/alarm_list_item.dart';

import 'package:location_alarm_flutter/utils/utils.dart';
import 'package:location_alarm_flutter/model/alarms_model.dart';
import 'package:location_alarm_flutter/consts.dart';
import 'package:location_alarm_flutter/widgets/banner_ad_widget.dart';
import 'package:location_alarm_flutter/widgets/warning_widget.dart';

bool startService = false;
Alarmplayer alarmplayer = Alarmplayer();
StreamSubscription<LocationData>? onChangeLocationSubscription;
List<AlarmModel> activeAlarms = [];
AlarmModel? alarmToBeTriggered;

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
  Location location = Location();

  bool _showBottomSheet = false;

  final Map<String, AlarmModel> _alarmsMap = {};

  dynamic _currentAlarm;
  dynamic _formDraft;

  late bool _serviceEnabled;
  late PermissionStatus _permissionGranted;
  LocationData? _locationData;

  // state manipulation fns
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
    _currentAlarm = alarm;
  }

  void _setFormDraft(dynamic draft) {
    _formDraft = draft;
  }

  // Permissions
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

    _locationData = await location.getLocation();

    await enableBgLocationMode();
    return;
  }

  Future<void> enableBgLocationMode() async {
    bool isDenied = await location.isBackgroundModeEnabled();
    if (isDenied) {
      location.enableBackgroundMode(enable: true);
    }
    return;
  }

  Future<void> getNotificationPermission() async {
    bool isDenied = await Permissions.Permission.notification.isDenied;
    bool isPermanentlyDenied =
        await Permissions.Permission.notification.isPermanentlyDenied;
    if (isDenied || isPermanentlyDenied) {
      await Permissions.Permission.notification.request();
    }
    return;
  }

  Future<void> disableBatteryOptimization() async {
    bool ignoring = await OptimizeBattery.isIgnoringBatteryOptimizations();
    if (!ignoring) {
      await OptimizeBattery.stopOptimizingBatteryUsage();
    }
    return;
  }

  // App Logics
  Future<void> triggerAlarm(Function callbackFunction, AlarmModel alarm) async {
    Vibration.vibrate(
      repeat: 8,
      pattern: [
        0,
        500,
        250,
        500,
        250,
        1000,
        250,
        1500,
        250,
        2000,
      ],
    );
    await AwesomeNotifications().createNotification(
      content: NotificationContent(
        id: 1,
        channelKey: 'geoAlarm_Notification_channel',
        title: '${Emojis.time_alarm_clock} You have arrived!',
        body: "You have reached ${alarm.title}!",
        fullScreenIntent: true,
        locked: true,
        wakeUpScreen: true,
      ),
    );
    alarmplayer.Alarm(
      url: "assets/sounds/clock-alarm-8761.mp3",
    );

    await Future.delayed(const Duration(seconds: 60));

    await alarmplayer.StopAlarm();
    Vibration.cancel();
    await callbackFunction();
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

  StreamSubscription<LocationData> locationSubscription() {
    return location.onLocationChanged.listen(
      (LocationData currentLocation) async {
        debugPrint("heree ${alarmToBeTriggered?.id}");
        if (alarmToBeTriggered == null) {
          Future.forEach(
            activeAlarms,
            (element) async {
              if (element.location != null && element.radius != null) {
                bool reached = isLocationReached(
                  currentLocation,
                  element.location!,
                  element.radius!,
                );
                if (reached) {
                  alarmToBeTriggered = element;
                  return;
                }
              }
            },
          );
          if (alarmToBeTriggered != null) {
            void alarmTriggerDoneCallback() async {
              AlarmModel newAlarmData = AlarmModel(
                title: alarmToBeTriggered!.title,
                location: alarmToBeTriggered!.location,
                radius: alarmToBeTriggered!.radius,
                active: false,
                id: alarmToBeTriggered!.id,
              );
              activeAlarms = [
                ...activeAlarms.where((e) => e.id != alarmToBeTriggered!.id),
              ];
              _createEditAlarm(alarmToBeTriggered!.id!, newAlarmData);
              locationSubscription().cancel();
              alarmToBeTriggered = null;
              runService();
            }

            await triggerAlarm(alarmTriggerDoneCallback, alarmToBeTriggered!);
          }
        }
      },
    );
  }

  void runService() async {
    location.enableBackgroundMode(
      enable: true,
    );
    Vibration.cancel();
    startService = shouldStartService();
    onChangeLocationSubscription = locationSubscription();
  }

  @override
  void initState() {
    getAsyncData("alarms").then((value) {
      setState(() {
        Map<String, dynamic> jsonData = jsonDecode(value);
        for (var element in jsonData.values) {
          AlarmModel alarm;
          alarm = AlarmModel.fromJson(element);
          if (alarm.id != null) {
            _alarmsMap[alarm.id!] = alarm;
          }
        }
      });
    }).catchError((error) {
      debugPrint(error.toString());
    });

    // get permissions and start the service
    getLocation().then(
      (value) {
        getNotificationPermission().then(
          (value) {
            disableBatteryOptimization().then(
              (value) {
                runService();
              },
            );
          },
        );
      },
    );
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    List<AlarmModel> alarmsList = [..._alarmsMap.values.map((e) => e)];

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
      body: Center(
        child: alarmsList.isNotEmpty
            ? Column(
                children: [
                  const WarningBanner(),
                  Expanded(
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
                  ),
                ],
              )
            : TextButton(
                onPressed: _changeBottomSheetVisibility,
                style: ButtonStyle(
                  overlayColor: MaterialStateProperty.all(
                    Theme.of(context).colorScheme.errorContainer,
                  ),
                ),
                child: Text(
                  "Alarm List is Empty. Add one?",
                  style: TextStyle(
                    color: Theme.of(context).colorScheme.error,
                  ),
                ),
              ),
      ),
      bottomNavigationBar: const BannerAdWidget(),
      bottomSheet: _showBottomSheet
          ? AlarmForm(
              createEditAlarm: _createEditAlarm,
              currentAlarm: _currentAlarm,
              formDraft: _formDraft,
              setCurrentAlarm: _setCurrentAlarm,
              setFormDraft: _setFormDraft,
              closeBottomSheet: _changeBottomSheetVisibility,
              userLocation: _locationData,
            )
          : null,
      floatingActionButtonLocation: FloatingActionButtonLocation.centerFloat,
      floatingActionButton: FloatingActionButton(
        onPressed: _changeBottomSheetVisibility,
        tooltip: _showBottomSheet ? 'Add new Alarm' : 'Close',
        mini: _showBottomSheet,
        shape:
            ShapeBorder.lerp(const StadiumBorder(), const StadiumBorder(), 0),
        backgroundColor: _showBottomSheet
            ? Theme.of(context).colorScheme.error
            : Theme.of(context).colorScheme.primaryContainer,
        child: _showBottomSheet
            ? Icon(
                Icons.close,
                color: Theme.of(context).colorScheme.errorContainer,
              )
            : const Icon(Icons.add),
      ), // This trailing comma makes auto-formatting nicer for build methods.
    );
  }
}
