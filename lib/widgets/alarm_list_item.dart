import 'package:alarmplayer/alarmplayer.dart';
import 'package:flutter/material.dart';
import 'package:location_alarm_flutter/consts.dart';

import 'package:location_alarm_flutter/model/alarms_model.dart';
import 'package:location_alarm_flutter/widgets/alarm_list_item_button.dart';
import 'package:location_alarm_flutter/widgets/alarm_list_item_description.dart';

// ignore: must_be_immutable
class AlarmListItem extends StatefulWidget {
  AlarmListItem({
    super.key,
    required this.alarm,
    required this.createEditAlarm,
    required this.deleteAlarm,
    required this.setCurrentAlarm,
    required this.showBottomSheet,
    required this.runService,
  });

  AlarmModel alarm;
  void Function(String id, AlarmModel newAlarmData) createEditAlarm;
  void Function(String id) deleteAlarm;
  void Function(dynamic currentAlarm) setCurrentAlarm;
  void Function() showBottomSheet;
  void Function() runService;

  @override
  State<AlarmListItem> createState() => _AlarmListItemState();
}

class _AlarmListItemState extends State<AlarmListItem> {
  String getTriggerText(num radius) {
    if (radius == 0) {
      return "Triggers on reaching the location";
    }
    if (radius >= 1000) {
      return "Triggers when entering ${radius / 1000}km radius";
    }
    return "Triggers when entering ${radius}m radius";
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.symmetric(
        horizontal: values["xs"]?.toDouble() ?? 0,
      ),
      child: Card(
        child: Padding(
          padding: EdgeInsets.only(
            left: values["xs"]?.toDouble() ?? 4,
            right: values["xs"]?.toDouble() ?? 4,
            bottom: values["xs"]?.toDouble() ?? 4,
          ),
          child: Column(
            children: [
              ListTile(
                title: Text(widget.alarm.title ?? ""),
                titleTextStyle: TextStyle(
                  fontWeight: FontWeight.w600,
                  fontSize: values["sm"]?.toDouble() ?? 20,
                  color: Theme.of(context).colorScheme.secondary,
                ),
              ),
              const Divider(
                thickness: 0.2,
              ),
              ListBody(
                children: [
                  AlarmDescription(
                    title: "Location : ",
                    description:
                        "${widget.alarm.location?.latitude}, ${widget.alarm.location?.longitude}",
                  ),
                  AlarmDescription(
                    title: "",
                    description: getTriggerText(widget.alarm.radius!),
                  ),
                  const Divider(
                    thickness: 0.2,
                  ),
                  ButtonBar(
                    alignment: MainAxisAlignment.spaceBetween,
                    children: [
                      AlarmItemIconButton(
                        color: Theme.of(context).colorScheme.error,
                        label: "Delete",
                        onPressed: () => widget.deleteAlarm(widget.alarm.id!),
                        icon: const Icon(
                          Icons.delete,
                        ),
                      ),
                      AlarmItemIconButton(
                        color: Theme.of(context).colorScheme.primary,
                        label: "Edit",
                        onPressed: () {
                          widget.setCurrentAlarm(widget.alarm);
                          widget.showBottomSheet();
                        },
                        icon: const Icon(
                          Icons.edit,
                        ),
                      ),
                      Switch(
                        value: widget.alarm.active,
                        onChanged: (val) {
                          Alarmplayer alarmPlayer = Alarmplayer();
                          AlarmModel newAlarm = widget.alarm;
                          newAlarm.active = val;
                          widget.createEditAlarm(widget.alarm.id!, newAlarm);
                          widget.runService();
                          if (!val) {
                            alarmPlayer.StopAlarm();
                          }
                        },
                      ),
                    ],
                  ),
                ],
              )
            ],
          ),
        ),
      ),
    );
  }
}
