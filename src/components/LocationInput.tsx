import React, { useContext, useState } from "react";
import { View } from "react-native";
import { TextInput, Button, Text, Divider } from "react-native-paper";

import { AppContext } from "../context/appContext";

import { locationFormFields } from "../data/formFields";

import { generateAlarmItemFromFormData } from "../utils/utils";

import { LocationInputType } from "../types/propTypes";
import { LocationFormDataType } from "../types/dataTypes";

import { locationInputStyle } from "../styles/styles";

const LocationInput: React.FC<LocationInputType> = ({ closeModal }) => {
	const { theme, alarms, setAlarms, editAlarm, currentAlarm } =
		useContext(AppContext);

	const isEdit = Boolean(currentAlarm);

	const [formData, setFormData] = useState<LocationFormDataType>({
		title: currentAlarm?.title || " ",
		latitude: currentAlarm?.location?.latitude.toString() || "",
		longitude: currentAlarm?.location?.longitude.toString() || "",
		radius: currentAlarm?.radius.toString() || "",
	});

	const onChangeText = (text: string, item: string) =>
		setFormData({ ...formData, [item]: text });

	const setNewAlarm = () => {
		const { title, latitude, longitude, radius } = formData;
		if (formData.title && formData.latitude && formData.longitude) {
			setAlarms([
				...alarms,
				{
					title,
					location: {
						latitude: parseInt(latitude),
						longitude: parseInt(longitude),
					},
					radius: parseInt(radius),
					id: new Date().getMilliseconds().toString(),
				},
			]);

			closeModal();
		}
	};

	return (
		<View style={locationInputStyle(theme).container}>
			<Text variant="titleLarge" style={locationInputStyle(theme).title}>
				{isEdit ? `Edit Alarm` : "Add New Alarm"}
			</Text>
			<Divider style={locationInputStyle(theme).divider} />
			{locationFormFields(formData, onChangeText).map((field) => (
				<TextInput
					key={field.label}
					label={field.label}
					mode="outlined"
					style={locationInputStyle(theme).textInput}
					inputMode={field.inputMode}
					value={field.value?.toString()}
					onChangeText={(text) => field.onChangeText(text, field.name)}
				/>
			))}
			<Divider style={locationInputStyle(theme).divider} />
			<View style={locationInputStyle(theme).buttonsContainer}>
				<Button
					mode="elevated"
					labelStyle={locationInputStyle(theme).cancelButtonLabel}
					style={locationInputStyle(theme).cancelButton}
					onPress={() => closeModal()}
				>
					Cancel
				</Button>
				<Button
					mode="elevated"
					onPress={() => {
						if (isEdit && currentAlarm) {
							editAlarm(
								currentAlarm.id,
								generateAlarmItemFromFormData(currentAlarm, formData)
							);
							closeModal();
						} else {
							setNewAlarm();
						}
					}}
				>
					{isEdit ? "Confirm Edit" : "Set Alarm"}
				</Button>
			</View>
		</View>
	);
};

export default LocationInput;
