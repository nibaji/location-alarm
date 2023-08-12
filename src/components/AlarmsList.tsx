import React, { useContext } from "react";
import { FlatList } from "react-native";
import { Divider } from "react-native-paper";

import { AppContext } from "../context/appContext";
import AlarmListItem from "./AlarmListItem";

const AlarmsList = () => {
	const { alarms } = useContext(AppContext);

	return (
		<FlatList
			data={alarms}
			renderItem={({ item }) => <AlarmListItem alarm={item} />}
			keyExtractor={(item) => item.id}
			showsVerticalScrollIndicator={false}
		/>
	);
};

export default AlarmsList;
