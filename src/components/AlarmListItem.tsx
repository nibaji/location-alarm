import React, { useContext } from "react";
import { View } from "react-native";
import { Surface, Text, Button, Divider, Switch } from "react-native-paper";

import { AppContext } from "../context/appContext";

import { AlarmListItemType } from "../types/propTypes";

import { alarmListItemStyle } from "../styles/styles";

const AlarmListItem: React.FC<AlarmListItemType> = ({ alarm }) => {
	const {
		theme,
		editAlarm,
		deleteAlarm,
		setCurrentAlarm,
		setShowManualLocationInputModal,
	} = useContext(AppContext);

	const handleEdit = () => {
		setCurrentAlarm(alarm);
		setShowManualLocationInputModal(true);
	};

	return (
		<Surface
			style={alarmListItemStyle(theme).container}
			mode="elevated"
			elevation={1}
		>
			<>
				<Text variant="titleMedium">{alarm.title}</Text>
				<View style={alarmListItemStyle(theme).locationContainer}>
					<Text>Location : </Text>
					<Text variant="titleSmall">{`${alarm.location?.latitude}, ${alarm.location?.longitude}`}</Text>
				</View>
				<Text variant="titleSmall">
					Triggers around {alarm.radius}m radius.
				</Text>
			</>
			<Divider style={alarmListItemStyle(theme).divider} />

			<View style={alarmListItemStyle(theme).buttonsContainer}>
				<Button
					icon="delete"
					labelStyle={alarmListItemStyle(theme).deleteButton}
					onPress={() => deleteAlarm(alarm.id)}
				>
					Delete
				</Button>
				<Button icon="circle-edit-outline" onPress={handleEdit}>
					Edit
				</Button>
				<Switch
					value={alarm.active}
					onValueChange={(value) =>
						editAlarm(alarm.id, { ...alarm, active: value })
					}
				/>
			</View>
		</Surface>
	);
};

export default AlarmListItem;
