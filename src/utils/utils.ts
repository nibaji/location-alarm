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
		coordinates: {
			latitude: Number(latitude),
			longitude: Number(longitude),
		},
		title,
		radius: Number(radius || 0),
	};
};
