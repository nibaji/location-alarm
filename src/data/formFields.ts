import { LocationInputFormFieldsType } from "../types/dataTypes";

export const locationFormFields: LocationInputFormFieldsType = (
	formData,
	onChangeText
) => [
	{
		label: "Title",
		name: "title",
		value: formData.title,
		inputMode: "text",
		onChangeText,
	},
	{
		label: "Latitude",
		name: "latitude",
		value: formData.latitude,
		inputMode: "numeric",
		onChangeText,
	},
	{
		label: "Longitude",
		name: "longitude",
		value: formData.longitude,
		inputMode: "numeric",
		onChangeText,
	},
	{
		label: "Radius in meters",
		name: "radius",
		value: formData.radius,
		inputMode: "numeric",
		onChangeText,
	},
];
