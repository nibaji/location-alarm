import 'package:flutter/material.dart';
import 'package:location/location.dart';

import 'package:location_alarm_flutter/consts.dart';
import 'package:location_alarm_flutter/data/alarm_form_data.dart';
import 'package:location_alarm_flutter/model/alarm_form_model.dart';
import 'package:location_alarm_flutter/model/alarms_model.dart';
import 'package:location_alarm_flutter/widgets/coordinates_picker_widget.dart';

// ignore: must_be_immutable
class AlarmForm extends StatefulWidget {
  AlarmForm({
    super.key,
    required this.createEditAlarm,
    required this.currentAlarm,
    required this.formDraft,
    required this.setFormDraft,
    required this.setCurrentAlarm,
    required this.closeBottomSheet,
    required this.userLocation,
  });

  void Function(String id, AlarmModel newAlarmData) createEditAlarm;
  void Function(dynamic draft) setFormDraft;
  void Function(dynamic currentAlarm) setCurrentAlarm;
  void Function() closeBottomSheet;
  AlarmFormOutModel? formDraft;
  AlarmModel? currentAlarm;
  LocationData? userLocation;

  @override
  State<AlarmForm> createState() => _AlarmFormState();
}

class _AlarmFormState extends State<AlarmForm> {
  final _formKey = GlobalKey<FormState>();

  AlarmFormOutModel? _formDraft;

  final formFields = alarmFormFields
      .map((alarmField) => AlarmFormFieldModel.fromJson(alarmField));
  AlarmFormOutModel _formFieldsOut =
      AlarmFormOutModel(name: "", latitude: 0, longitude: 0, radius: 0);

  void _setFieldsOut() {
    debugPrint("here");
    debugPrint(_formDraft?.latitude.toString());
    _formFieldsOut = AlarmFormOutModel(
      name: _formDraft?.name ?? widget.currentAlarm?.title ?? "",
      latitude:
          _formDraft?.latitude ?? widget.currentAlarm?.location.latitude ?? 0.0,
      longitude: _formDraft?.longitude ??
          widget.currentAlarm?.location.longitude ??
          0.0,
      radius: _formDraft?.radius ?? widget.currentAlarm?.radius ?? 0,
    );
  }

  void _setFormDraft(AlarmFormOutModel newFormDraft) {
    debugPrint("oh Noooooo");
    debugPrint(newFormDraft.latitude.toString());
    setState(() {
      _formDraft = newFormDraft;
      _setFieldsOut();
    });
  }

  @override
  void initState() {
    setState(() {
      _formDraft = widget.formDraft;
      // initialize field values
      _setFieldsOut();
    });
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    dynamic alarmId = widget.currentAlarm?.id;

    bool isEdit = alarmId != null;
    _setFieldsOut();

    String getInitialValue(String fieldName) {
      switch (fieldName) {
        case "title":
          return _formFieldsOut.name;

        case "latitude":
          return _formFieldsOut.latitude.toString();

        case "longitude":
          return _formFieldsOut.longitude.toString();

        case "radius":
          return _formFieldsOut.radius.toString();

        default:
          return "";
      }
    }

    return Padding(
      padding: EdgeInsets.all(values["s"]?.toDouble() ?? 0.0),
      child: Wrap(
        children: [
          ListTile(
            title: Text(
              '${isEdit ? "Edit" : "Create New"} Alarm',
              style: TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: values["m"]?.toDouble() ?? 0.0,
              ),
            ),
          ),
          Form(
            key: _formKey,
            child: Column(
              children: [
                // fields
                ...formFields.map(
                  (formField) => Padding(
                    padding: EdgeInsets.all(values["xs"]?.toDouble() ?? 0.0),
                    child: TextFormField(
                      key: Key(_formDraft.toString()),
                      autofocus: true,
                      initialValue: getInitialValue(formField.name),
                      decoration: InputDecoration(
                        border: const OutlineInputBorder(
                          borderRadius: BorderRadius.all(
                            Radius.circular(16),
                          ),
                        ),
                        labelText: formField.label,
                      ),
                      onChanged: (value) {
                        switch (formField.name) {
                          case "title":
                            _formFieldsOut.name = value;
                            break;
                          case "latitude":
                            _formFieldsOut.latitude = double.parse(value);
                            break;
                          case "longitude":
                            _formFieldsOut.longitude = double.parse(value);
                            break;
                          case "radius":
                            _formFieldsOut.radius = int.parse(value);
                            break;
                          default:
                        }
                        widget.setFormDraft(_formFieldsOut);
                      },
                      validator: (value) {
                        if (formField.isRequired) {
                          if (value == null || value.isEmpty) {
                            return 'Please enter ${formField.label}';
                          }
                        }
                        return null;
                      },
                      keyboardType: formField.isNumber
                          ? TextInputType.number
                          : TextInputType.text,
                    ),
                  ),
                ),
                // OSM segway
                Padding(
                  padding: const EdgeInsets.symmetric(vertical: 4),
                  child: TextButton(
                    onPressed: () {
                      showModalBottomSheet<void>(
                        context: context,
                        builder: (BuildContext context) {
                          return CoordinatesPicker(
                            currentLocation: widget.userLocation,
                            setFormDraft: _setFormDraft,
                            currentFormDraft: _formFieldsOut,
                          );
                        },
                      );
                    },
                    child: const Text(
                      "Pick Coordinates from Map",
                    ),
                  ),
                ),
                // submit button
                Padding(
                  padding: const EdgeInsets.symmetric(vertical: 4),
                  child: ElevatedButton(
                    onPressed: () {
                      if (_formKey.currentState!.validate()) {
                        LocationModel location = LocationModel(
                            latitude: _formFieldsOut.latitude,
                            longitude: _formFieldsOut.longitude);
                        AlarmModel newAlarmData = AlarmModel(
                          title: _formFieldsOut.name,
                          active: false,
                          id: isEdit ? alarmId : DateTime.now().toString(),
                          location: location,
                          radius: _formFieldsOut.radius,
                        );
                        widget.createEditAlarm(newAlarmData.id, newAlarmData);
                        widget.setCurrentAlarm(null);
                        widget.setFormDraft(null);
                        widget.closeBottomSheet();
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text(
                              'Alarm is ${isEdit ? "Edited" : "Created"} Successfully',
                            ),
                          ),
                        );
                      }
                    },
                    style: ButtonStyle(
                      backgroundColor: MaterialStateProperty.all(
                        Theme.of(context).primaryColor,
                      ),
                      elevation: MaterialStateProperty.all(8),
                    ),
                    child: Text(
                      isEdit ? "Confirm Edit" : "Create Alarm",
                      style: TextStyle(
                        color: Theme.of(context).indicatorColor,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
