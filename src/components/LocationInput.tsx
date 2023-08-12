import React, { useContext, useState } from "react";
import { View } from "react-native";
import { TextInput, Button, Text, Divider } from "react-native-paper";

import { AppContext } from "../context/appContext";

import { locationFormFields } from "../data/formFields";

import { LocationInputType } from "../types/propTypes";
import { LocationFormDataType } from "../types/dataTypes";

import { locationInputStyle } from "../styles/styles";

const LocationInput: React.FC<LocationInputType> = ({ closeModal }) => {
	const { theme } = useContext(AppContext);

	const [formData, setFormData] = useState<LocationFormDataType>({
		title: "",
		latitude: "",
		longitude: "",
		radius: "",
	});

	const onChangeText = (text: string, item: string) =>
		setFormData({ ...formData, [item]: text });

	console.log({ formData });

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
				<Button mode="elevated">Set Alarm</Button>
			</View>
		</View>
	);
};

export default LocationInput;
