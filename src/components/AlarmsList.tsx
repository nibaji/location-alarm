import React, { useContext } from "react";
import { FlatList, View } from "react-native";
import { Text } from "react-native-paper";

import { AppContext } from "../context/appContext";
import AlarmListItem from "./AlarmListItem";
import { alarmListStyle } from "../styles/styles";

const AlarmsList = () => {
	const { alarms, setShowManualLocationInputModal, theme } =
		useContext(AppContext);

	return (
		<FlatList
			data={Object.values(alarms || {})}
			renderItem={({ item }) => <AlarmListItem alarm={item} />}
			keyExtractor={(item) => item.id}
			showsVerticalScrollIndicator={false}
			ListEmptyComponent={
				<View style={alarmListStyle(theme).emptyTextWrapper}>
					<Text
						onPress={() => setShowManualLocationInputModal(true)}
						style={alarmListStyle(theme).emptyText}
					>
						Alarms List is Empty! Add one?
					</Text>
				</View>
			}
		/>
	);
};

export default AlarmsList;
