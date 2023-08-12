export type LocationFormDataType = {
	title: string;
	latitude: string;
	longitude: string;
	radius: string;
};

export type LocationInputFormFieldType = {
	label: string;
	name: string;
	value: string;
	inputMode: "text" | "numeric";
	onChangeText: Function;
};

export type LocationInputFormFieldsType = (
	formData: LocationFormDataType,
	onChangeText: Function
) => LocationInputFormFieldType[];
