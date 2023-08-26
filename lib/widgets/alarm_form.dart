import 'package:flutter/material.dart';

import 'package:location_alarm_flutter/consts.dart';
import 'package:location_alarm_flutter/data/alarm_form_data.dart';
import 'package:location_alarm_flutter/model/alarm_form_model.dart';
import 'package:location_alarm_flutter/model/alarms_model.dart';

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
  });

  void Function(String id, AlarmModel newAlarmData) createEditAlarm;
  void Function(dynamic draft) setFormDraft;
  void Function(dynamic currentAlarm) setCurrentAlarm;
  void Function() closeBottomSheet;
  AlarmFormOutModel? formDraft;
  AlarmModel? currentAlarm;

  @override
  State<AlarmForm> createState() => _AlarmFormState();
}

class _AlarmFormState extends State<AlarmForm> {
  final _formKey = GlobalKey<FormState>();

  final formFields = alarmFormFields
      .map((alarmField) => AlarmFormFieldModel.fromJson(alarmField));
  AlarmFormOutModel formFieldsOut =
      AlarmFormOutModel(name: "", latitude: 0, longitude: 0, radius: 0);

  @override
  Widget build(BuildContext context) {
    dynamic alarmId = widget.currentAlarm?.id;

    bool isEdit = alarmId != null;

    // initialize field values
    formFieldsOut = AlarmFormOutModel(
      name: widget.formDraft?.name ?? widget.currentAlarm?.title ?? "",
      latitude: widget.formDraft?.latitude ??
          widget.currentAlarm?.location.latitude ??
          0.0,
      longitude: widget.formDraft?.longitude ??
          widget.currentAlarm?.location.longitude ??
          0.0,
      radius: widget.formDraft?.radius ?? widget.currentAlarm?.radius ?? 0,
    );

    String getInitialValue(String fieldName) {
      switch (fieldName) {
        case "title":
          return formFieldsOut.name;

        case "latitude":
          return formFieldsOut.latitude.toString();

        case "longitude":
          return formFieldsOut.longitude.toString();

        case "radius":
          return formFieldsOut.radius.toString();

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
                            formFieldsOut.name = value;
                            break;
                          case "latitude":
                            formFieldsOut.latitude = double.parse(value);
                            break;
                          case "longitude":
                            formFieldsOut.longitude = double.parse(value);
                            break;
                          case "radius":
                            formFieldsOut.radius = int.parse(value);
                            break;
                          default:
                        }
                        widget.setFormDraft(formFieldsOut);
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
                // submit button
                Padding(
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  child: ElevatedButton(
                    onPressed: () {
                      if (_formKey.currentState!.validate()) {
                        LocationModel location = LocationModel(
                            latitude: formFieldsOut.latitude,
                            longitude: formFieldsOut.longitude);
                        AlarmModel newAlarmData = AlarmModel(
                          title: formFieldsOut.name,
                          active: false,
                          id: isEdit ? alarmId : DateTime.now().toString(),
                          location: location,
                          radius: formFieldsOut.radius,
                        );
                        widget.createEditAlarm(newAlarmData.id, newAlarmData);
                        widget.setCurrentAlarm(null);
                        widget.setFormDraft(null);
                        widget.closeBottomSheet();
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Alarm is created')),
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
