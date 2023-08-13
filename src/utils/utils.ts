import { LocationFormDataType } from "../types/dataTypes";
import { AlarmItemType } from "../types/stateTypes";

export const generateAlarmIdFromForm = (
	alarmFormData: LocationFormDataType
) => {
	const { title, latitude, longitude, radius } = alarmFormData;
	return title + latitude + longitude + radius;
};

export const generateAlarmItemFromFormData = (
	alarm: AlarmItemType,
	formData: LocationFormDataType
) => {
	const { latitude, longitude, title, radius } = formData;
	return {
		...alarm,
		location: {
			latitude: Number(latitude),
			longitude: Number(longitude),
		},
		title,
		radius: Number(radius || 0),
	};
};

// https://stackoverflow.com/a/27943
export const getDistanceBetween2LatsLongsInMeters = (
	userLatitude: number,
	userLongitude: number,
	targetLatitude: number,
	targetLongitude: number
) => {
	const earthRadius = 6371000; // Radius of the Earth in meters

	const degToRad = (degrees: number) => {
		return degrees * (Math.PI / 180);
	};

	const latitudeDifference = degToRad(targetLatitude - userLatitude);
	const longitudeDifference = degToRad(targetLongitude - userLongitude);

	const squareHalfLatitudeDifference =
		Math.sin(latitudeDifference / 2) * Math.sin(latitudeDifference / 2);
	const squareHalfLongitudeDifference =
		Math.sin(longitudeDifference / 2) * Math.sin(longitudeDifference / 2);

	const haversineTerm =
		squareHalfLatitudeDifference +
		Math.cos(degToRad(userLatitude)) *
			Math.cos(degToRad(targetLatitude)) *
			squareHalfLongitudeDifference;

	const angularDistance =
		2 * Math.atan2(Math.sqrt(haversineTerm), Math.sqrt(1 - haversineTerm));

	const distance = earthRadius * angularDistance; // Distance in meters
	return distance;
};
