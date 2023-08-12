import React, { useContext, useState } from "react";
import { View } from "react-native";
import { TextInput, Button, Text, Divider } from "react-native-paper";

import { AppContext } from "../context/appContext";

import { locationFormFields } from "../data/formFields";

import { LocationInputType } from "../types/propTypes";
import { LocationFormDataType } from "../types/dataTypes";

import { locationInputStyle } from "../styles/styles";
import { generateAlarmIdFromForm } from "../utils/utils";

const LocationInput: React.FC<LocationInputType> = ({ closeModal }) => {
	const { theme, alarms, setNewAlarm } = useContext(AppContext);

	const [formData, setFormData] = useState<LocationFormDataType>({
		title: "",
		latitude: "",
		longitude: "",
		radius: "",
	});

	const onChangeText = (text: string, item: string) =>
		setFormData({ ...formData, [item]: text });

	const setAlarm = () => {
		const { title, latitude, longitude, radius } = formData;
		if (formData.title && formData.latitude && formData.longitude) {
			const isAlarmAlreadyPresent = alarms.find(
				(_alarm) =>
					_alarm.id ===
					formData.title +
						formData.latitude +
						formData.longitude +
						formData.radius
			);
			if (!isAlarmAlreadyPresent) {
				setNewAlarm([
					...alarms,
					{
						title,
						location: {
							latitude,
							longitude,
						},
						radius,
						id: generateAlarmIdFromForm(formData),
					},
				]);
			}
			closeModal();
		}
	};

	return (
		<View style={locationInputStyle(theme).container}>
			<Text variant="titleLarge" style={locationInputStyle(theme).title}>
				Add New Alarm
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
				<Button mode="elevated" onPress={setAlarm}>
					Set Alarm
				</Button>
			</View>
		</View>
	);
};

export default LocationInput;
