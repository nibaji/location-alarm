class AlarmFormFieldModel {
  String label = "";
  String name = "";
  bool isNumber = false;
  bool isRequired = false;

  AlarmFormFieldModel(
      {required this.label,
      required this.name,
      required this.isNumber,
      required this.isRequired});

  AlarmFormFieldModel.fromJson(Map<String, dynamic> json) {
    label = json['label'];
    name = json['name'];
    isNumber = json['isNumber'];
    isRequired = json['isRequired'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['label'] = label;
    data['name'] = name;
    data['isNumber'] = isNumber;
    data['isRequired'] = isRequired;
    return data;
  }
}

class AlarmFormOutModel {
  String name = "";
  double latitude = 0.0;
  double longitude = 0.0;
  num radius = 0.0;

  AlarmFormOutModel(
      {required this.name,
      required this.latitude,
      required this.longitude,
      required this.radius});

  AlarmFormOutModel.fromJson(Map<String, dynamic> json) {
    name = json['name'];
    latitude = json['latitude'];
    longitude = json['longitude'];
    radius = json['radius'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['name'] = name;
    data['latitude'] = latitude;
    data['longitude'] = longitude;
    data['radius'] = radius;
    return data;
  }
}
