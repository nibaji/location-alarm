import React, { useContext } from "react";
import { FlatList, View } from "react-native";
import { Text, Banner } from "react-native-paper";

import { AppContext } from "../context/appContext";
import AlarmListItem from "./AlarmListItem";
import { alarmListStyle } from "../styles/styles";

const AlarmsList = () => {
	const { alarms, setShowCreateEditAlarm, theme } = useContext(AppContext);

	return (
		<FlatList
			data={Object.values(alarms || {})}
			renderItem={({ item }) => <AlarmListItem alarm={item} />}
			keyExtractor={(item) => item.id}
			showsVerticalScrollIndicator={false}
			contentContainerStyle={alarmListStyle(theme).container}
			ListHeaderComponent={
				<Banner
					visible={true}
					icon="information-variant"
					contentStyle={alarmListStyle(theme).bannerContent}
					style={alarmListStyle(theme).banner}
				>
					<Text style={alarmListStyle(theme).bannerText} variant="labelMedium">
						App need to be in background for it to work. So please DO NOT CLOSE
						THE APP if you have an active alarm. Instead you can have this app
						in the App Switcher and use other apps while this app lives in the
						background.
					</Text>
				</Banner>
			}
			ListEmptyComponent={
				<View style={alarmListStyle(theme).emptyTextWrapper}>
					<Text
						onPress={() => setShowCreateEditAlarm(true)}
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
