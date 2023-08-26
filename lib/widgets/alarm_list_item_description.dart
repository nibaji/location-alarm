import 'package:flutter/material.dart';
import 'package:location_alarm_flutter/consts.dart';

class AlarmDescription extends StatelessWidget {
  const AlarmDescription(
      {super.key, required this.title, required this.description});

  final String title;
  final String description;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.symmetric(
        vertical: values["xs"]?.toDouble() ?? 4,
        horizontal: values["s"]?.toDouble() ?? 8,
      ),
      child: RichText(
        text: TextSpan(
          children: [
            TextSpan(
              text: title,
              style: TextStyle(
                color: Theme.of(context).colorScheme.tertiary,
              ),
            ),
            TextSpan(
              text: description,
              style: TextStyle(
                  color: Theme.of(context).colorScheme.tertiary,
                  fontWeight: FontWeight.bold),
            ),
          ],
        ),
      ),
    );
  }
}
