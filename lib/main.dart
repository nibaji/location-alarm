import 'package:flutter/material.dart';
import 'package:flutter_background_service/flutter_background_service.dart';
import 'package:google_mobile_ads/google_mobile_ads.dart';
import 'package:awesome_notifications/awesome_notifications.dart';

import 'package:location_alarm_flutter/pages/home_page.dart';

import 'package:location_alarm_flutter/utils/utils.dart';
import 'package:vibration/vibration.dart';

final backgroundService = FlutterBackgroundService();

@pragma('vm:entry-point')
onStart(ServiceInstance service) async {
  dynamic locationSub = onChangeLocationSubscription;
  if (startService) {
    await AwesomeNotifications().createNotification(
      content: NotificationContent(
        id: 1,
        channelKey: 'geoAlarm_Notification_channel',
        title:
            '${Emojis.time_alarm_clock} Geo Alarm is running in the Background',
        body: "You'll be alerted on reaching the destination}!",
        fullScreenIntent: true,
      ),
    );
    if (locationSub != null) {
      locationSub();
    }
  } else {
    Vibration.cancel();
    await alarmplayer.StopAlarm();
    await locationSub?.cancel();
    await service.stopSelf();
  }
}

initializeBackgroundService() async {
  await backgroundService.configure(
    androidConfiguration: AndroidConfiguration(
      // this will be executed when app is in foreground or background in separated isolate
      onStart: onStart,
      // auto start service
      autoStart: true,
      isForegroundMode: true,

      notificationChannelId:
          "geoAlarm_Notification_channel", // this must match with notification channel you created above.
      initialNotificationTitle: 'AWESOME SERVICE',
      initialNotificationContent: 'Initializing',
      foregroundServiceNotificationId: 1,
    ),
    iosConfiguration: IosConfiguration(
      autoStart: true,
      onForeground: onStart,
    ),
  );
  backgroundService.startService();
}

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  MobileAds.instance.initialize();

  AwesomeNotifications().initialize(
    // set the icon to null if you want to use the default app icon
    'resource://drawable/ic_stat_notifications',
    [
      NotificationChannel(
        channelGroupKey: 'geoAlarm_channel_group',
        channelKey: 'geoAlarm_Notification_channel',
        channelName: 'Basic notifications',
        channelDescription: 'Notifications',
        importance: NotificationImportance.Low,
      )
    ],
    debug: true,
  );

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
    saveAsyncData("isDarkTheme", _isDarkTheme, isTheme: true);
  }

  void setInitialTheme() async {
    try {
      _isDarkTheme = await getAsyncData("isDarkTheme", isTheme: true);
    } catch (error) {
      debugPrint(error.toString());
      _setTheme(theme: Brightness.light);
    } finally {
      _setTheme(theme: _isDarkTheme ? Brightness.dark : Brightness.light);
    }
  }

  @override
  void initState() {
    setInitialTheme();
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
