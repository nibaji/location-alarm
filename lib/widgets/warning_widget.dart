import 'package:flutter/material.dart';

class WarningBanner extends StatelessWidget {
  const WarningBanner({super.key});

  @override
  Widget build(BuildContext context) {
    return Dialog(
      insetPadding: const EdgeInsets.all(8),
      backgroundColor: Theme.of(context).colorScheme.error,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(
          12,
        ),
      ),
      elevation: 8,
      child: Padding(
        padding: const EdgeInsets.symmetric(
          vertical: 12,
          horizontal: 16,
        ),
        child: RichText(
          text: TextSpan(
            style: TextStyle(
              color: Theme.of(context).colorScheme.errorContainer,
            ),
            children: const [
              TextSpan(
                text:
                    "Geo Alarm needs to run in the background for the alarm to be triggered. ",
              ),
              TextSpan(
                  text: "DO NOT CLOSE THE APP ",
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                  )),
              TextSpan(
                text:
                    "once you have an active alarm. You can keep the app in the app switcher. Make sure you have allowed Background Location Access, Notification Permission and Disabled Battery optimizations for Geo Alarm.",
              )
            ],
          ),
        ),
      ),
    );
  }
}
