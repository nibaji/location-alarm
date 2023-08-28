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

  AlarmFormOutModel? _formFieldsValue;

  final formFields = alarmFormFields
      .map((alarmField) => AlarmFormFieldModel.fromJson(alarmField));

  void _setFormFieldsValue() {
    _formFieldsValue = AlarmFormOutModel(
      name: _formFieldsValue?.name ?? widget.currentAlarm?.title,
      latitude: _formFieldsValue?.latitude ??
          widget.currentAlarm?.location?.latitude ??
          "",
      longitude: _formFieldsValue?.longitude ??
          widget.currentAlarm?.location?.longitude ??
          "",
      radius: _formFieldsValue?.radius ?? widget.currentAlarm?.radius ?? 0,
    );
  }

  void _setFormDraft(AlarmFormOutModel newFormDraft) {
    setState(() {
      widget.setFormDraft(newFormDraft);
    });
  }

  @override
  void initState() {
    setState(() {
      if (widget.formDraft != null) {
        _formFieldsValue = widget.formDraft;
      }
      // initialize field values
      _setFormFieldsValue();
    });
    super.initState();
  }

  @override
  void dispose() {
    widget.setCurrentAlarm(null);
    widget.setFormDraft(null);
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    dynamic alarmId = widget.currentAlarm?.id;

    bool isEdit = alarmId != null;

    String? getInitialValue(String fieldName) {
      switch (fieldName) {
        case "title":
          return _formFieldsValue?.name;

        case "latitude":
          return _formFieldsValue?.latitude.toString();

        case "longitude":
          return _formFieldsValue?.longitude.toString();

        case "radius":
          return _formFieldsValue?.radius.toString();

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
                    key: Key(formField.name),
                    padding: EdgeInsets.all(values["xs"]?.toDouble() ?? 0.0),
                    child: TextFormField(
                      key: Key(
                          "${formField.name} ${widget.formDraft?.toJson().toString()}"),
                      controller: TextEditingController(
                          text: getInitialValue(formField.name)),
                      autofocus: true,
                      // initialValue: getInitialValue(formField.name),
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
                            _formFieldsValue?.name = value;
                            break;
                          case "latitude":
                            _formFieldsValue?.latitude = double.parse(value);
                            break;
                          case "longitude":
                            _formFieldsValue?.longitude = double.parse(value);
                            break;
                          case "radius":
                            _formFieldsValue?.radius =
                                value != "" ? int.parse(value) : 0;
                            break;
                          default:
                        }
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
                            currentFormDraft: _formFieldsValue!,
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
                      if (_formKey.currentState!.validate() &&
                          _formFieldsValue != null) {
                        LocationModel? location = LocationModel(
                            latitude: _formFieldsValue?.latitude,
                            longitude: _formFieldsValue?.longitude);
                        AlarmModel? newAlarmData = AlarmModel(
                          title: _formFieldsValue?.name,
                          active: false,
                          id: isEdit ? alarmId : DateTime.now().toString(),
                          location: location,
                          radius: _formFieldsValue?.radius?.toInt() ?? 0,
                        );
                        widget.createEditAlarm(newAlarmData.id!, newAlarmData);
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
