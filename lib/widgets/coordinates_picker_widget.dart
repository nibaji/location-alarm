import 'package:flutter/material.dart';
import 'package:location/location.dart';
import 'package:location_alarm_flutter/model/alarm_form_model.dart';
import 'package:location_picker_flutter_map/location_picker_flutter_map.dart';

// ignore: must_be_immutable
class CoordinatesPicker extends StatefulWidget {
  CoordinatesPicker({
    super.key,
    required this.currentLocation,
    required this.setFormDraft,
    required this.currentFormDraft,
  });

  LocationData? currentLocation;
  Function setFormDraft;
  AlarmFormOutModel currentFormDraft;

  @override
  State<CoordinatesPicker> createState() => _CoordinatesPickerState();
}

class _CoordinatesPickerState extends State<CoordinatesPicker> {
  @override
  Widget build(BuildContext context) {
    double? draftLatitude = widget.currentFormDraft.latitude != ""
        ? widget.currentFormDraft.latitude
        : null;
    double? draftLongitude = widget.currentFormDraft.longitude != ""
        ? widget.currentFormDraft.longitude
        : null;

    return FlutterLocationPicker(
      initPosition:
          (draftLatitude != null || widget.currentLocation?.latitude != null)
              ? LatLong(
                  draftLatitude ?? widget.currentLocation?.latitude ?? 0,
                  draftLongitude ?? widget.currentLocation?.longitude ?? 0,
                )
              : null,
      selectLocationButtonStyle: ButtonStyle(
        backgroundColor: MaterialStateProperty.all(
            Theme.of(context).colorScheme.primaryContainer),
      ),
      searchbarBorderRadius: BorderRadius.circular(16),
      searchbarInputBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      searchbarInputFocusBorderp: OutlineInputBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      markerIcon: const Icon(
        Icons.location_pin,
        color: Colors.red,
        size: 48,
      ),
      selectedLocationButtonTextstyle: const TextStyle(fontSize: 18),
      selectLocationButtonText: 'Confirm Location',
      selectLocationButtonLeadingIcon: const Icon(Icons.location_pin),
      initZoom: 11,
      minZoomLevel: 5,
      maxZoomLevel: 16,
      trackMyPosition: true,
      onError: (e) => debugPrint(e.toString()),
      onPicked: (pickedData) {
        AlarmFormOutModel newFormDraft = widget.currentFormDraft;
        newFormDraft.name = pickedData.addressData.values.firstOrNull;
        newFormDraft.latitude = pickedData.latLong.latitude;
        newFormDraft.longitude = pickedData.latLong.longitude;
        widget.setFormDraft(newFormDraft);
        Navigator.pop(context);
      },
    );
  }
}
