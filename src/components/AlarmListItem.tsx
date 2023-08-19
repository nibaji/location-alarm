import React, { useContext } from "react";
import { View, Vibration } from "react-native";
import { Surface, Text, Button, Divider, Switch } from "react-native-paper";
import BackgroundService from "react-native-background-actions";

import { AppContext } from "../context/appContext";

import { AlarmListItemType } from "../types/propTypes";

import { alarmListItemStyle } from "../styles/styles";
import { shouldKillBgServices } from "../utils/utils";

const AlarmListItem: React.FC<AlarmListItemType> = ({ alarm }) => {
	const {
		theme,
		alarms,
		editAlarm,
		deleteAlarm,
		setCurrentAlarm,
		setShowManualLocationInputModal,
	} = useContext(AppContext);

	const handleEdit = () => {
		setCurrentAlarm(alarm);
		setShowManualLocationInputModal(true);
	};

	const handleAlarmToggle = async (value: boolean) => {
		editAlarm(alarm.id, { ...alarm, active: value });
		if (!value) {
			Vibration.cancel();
			if (shouldKillBgServices(alarms)) {
				await BackgroundService.stop();
			}
		}
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
				<Switch value={alarm.active} onValueChange={handleAlarmToggle} />
			</View>
		</Surface>
	);
};

export default AlarmListItem;
