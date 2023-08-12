import React, { useContext } from "react";
import { FlatList } from "react-native";

import { AppContext } from "../context/appContext";
import AlarmListItem from "./AlarmListItem";

const AlarmsList = () => {
	const { alarms } = useContext(AppContext);

	return (
		<FlatList
			data={alarms}
			renderItem={({ item }) => <AlarmListItem alarm={item} />}
			keyExtractor={(item) => item.id}
		/>
	);
};

export default AlarmsList;
