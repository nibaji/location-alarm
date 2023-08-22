import React, { useContext, useState, useEffect } from "react";
import { View } from "react-native";
import { TextInput, Button, Text, Divider } from "react-native-paper";

import { AppContext } from "../context/appContext";

import { locationFormFields } from "../data/formFields";

import { generateAlarmItemFromFormData } from "../utils/utils";

import { createEditAlarmPropsType } from "../types/propTypes";
import { LocationFormDataType } from "../types/dataTypes";

import { locationInputStyle } from "../styles/styles";

const CreateEditAlarm: React.FC<createEditAlarmPropsType> = ({
	closeModal,
}) => {
	const {
		theme,
		alarms,
		setAlarms,
		editAlarm,
		currentAlarm,
		setShowMapViewModal,
		formDataDraft,
		setFormDataDraft,
	} = useContext(AppContext);

	const isEdit = Boolean(currentAlarm);

	const [formData, setFormData] = useState<LocationFormDataType>({
		title: currentAlarm?.title ?? "",
		latitude: currentAlarm?.location?.latitude.toString() ?? "",
		longitude: currentAlarm?.location?.longitude.toString() ?? "",
		radius: currentAlarm?.radius.toString() ?? "",
	});

	const onChangeText = (text: string, item: string) =>
		setFormData({ ...formData, [item]: text });

	const setNewAlarm = () => {
		const { title, latitude, longitude, radius } = formData;
		if (formData.title && formData.latitude && formData.longitude) {
			const newId = new Date().toString();

			setAlarms({
				...alarms,
				[newId]: {
					title,
					location: {
						latitude: Number(latitude),
						longitude: Number(longitude),
					},
					radius: Number(radius) | 0,
					id: newId,
				},
			});
			setFormDataDraft(null);
			closeModal();
		}
	};

	const pickCoordinatesFromMap = () => {
		setFormDataDraft(formData);
		closeModal(true);
		setShowMapViewModal(true);
	};

	useEffect(() => {
		if (formDataDraft) {
			setFormData(formDataDraft);
		}
	}, [formDataDraft]);

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
			<Button onPress={pickCoordinatesFromMap}>
				Pick Coordinates from Map
			</Button>
			<Divider style={locationInputStyle(theme).divider} />
			<View style={locationInputStyle(theme).buttonsContainer}>
				<Button
					mode="elevated"
					labelStyle={locationInputStyle(theme).cancelButtonLabel}
					style={locationInputStyle(theme).cancelButton}
					onPress={() => {
						setFormDataDraft(null);
						closeModal();
					}}
				>
					Cancel
				</Button>
				<Button
					mode="elevated"
					onPress={() => {
						setFormDataDraft(null);
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
					{isEdit ? "Confirm Edit" : "Create Alarm"}
				</Button>
			</View>
		</View>
	);
};

export default CreateEditAlarm;
