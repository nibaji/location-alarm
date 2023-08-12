import { LocationFormDataType } from "../types/dataTypes";

export const generateAlarmIdFromForm = (
	alarmFormData: LocationFormDataType
) => {
	const { title, latitude, longitude, radius } = alarmFormData;
	return title + latitude + longitude + radius;
};
