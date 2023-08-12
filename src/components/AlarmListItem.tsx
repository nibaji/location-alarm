import React from "react";
import { View } from "react-native";
import { Surface, Text } from "react-native-paper";

import { AlarmListItemType } from "../types/propTypes";

const AlarmListItem: React.FC<AlarmListItemType> = ({ alarm }) => {
	return (
		<Surface>
			<Text>{alarm.title}</Text>
			<View>
				<Text>Location : </Text>
				<Text>{`${alarm.location?.latitude}, ${alarm.location?.longitude}`}</Text>
			</View>
		</Surface>
	);
};

export default AlarmListItem;
