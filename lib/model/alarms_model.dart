class AlarmModel {
  String title = "";
  LocationModel location = LocationModel(latitude: 0, longitude: 0);
  num radius = 0;
  bool active = false;
  String id = "";

  AlarmModel(
      {required this.title,
      required this.location,
      required this.radius,
      required this.active,
      required this.id});

  AlarmModel.fromJson(Map<String, dynamic> json) {
    title = json['title'];
    location = (json['location'] != null
        ? LocationModel.fromJson(json['location'])
        : null)!;
    radius = json['radius'];
    active = json['active'];
    id = json['id'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['title'] = title;
    data['location'] = location.toJson();
    data['radius'] = radius;
    data['active'] = active;
    data['id'] = id;
    return data;
  }
}

class LocationModel {
  double latitude = 0;
  double longitude = 0;

  LocationModel({required this.latitude, required this.longitude});

  LocationModel.fromJson(Map<String, dynamic> json) {
    latitude = json['latitude'];
    longitude = json['longitude'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['latitude'] = latitude;
    data['longitude'] = longitude;
    return data;
  }
}
