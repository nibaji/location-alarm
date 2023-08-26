import 'package:flutter/material.dart';

class AlarmItemIconButton extends StatelessWidget {
  const AlarmItemIconButton({
    super.key,
    required this.color,
    required this.label,
    required this.onPressed,
    required this.icon,
  });

  final Function() onPressed;
  final Color color;
  final String label;
  final Icon icon;

  @override
  Widget build(BuildContext context) {
    return TextButton.icon(
      onPressed: onPressed,
      icon: icon,
      label: Text(
        label,
        style: TextStyle(
          color: color,
        ),
      ),
      style: ButtonStyle(
        iconColor: MaterialStateProperty.all(
          color,
        ),
      ),
    );
  }
}
