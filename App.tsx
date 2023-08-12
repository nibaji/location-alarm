import React, { useState, useEffect, useContext } from "react";
import { View, ScrollView } from "react-native";
import * as Location from "expo-location";
import { Modal, Appbar, Text } from "react-native-paper";

import MapView from "./src/components/MapView";

import { AppContext } from "./src/context/appContext";

import { appStyle } from "./src/styles/styles";
import { dark, light } from "./src/styles/paperTheme";

export const App: React.FC = () => {
	const [showModal, setShowModal] = useState(false);
	const [errorMsg, setErrorMsg] = useState<string | null>(null);

	const { setCurrentLocation, currentLocation, theme, setTheme } =
		useContext(AppContext);

	const getUserLocation = async () => {
		let { status } = await Location.requestForegroundPermissionsAsync();
		if (status !== "granted") {
			setErrorMsg("Permission to access location was denied");
			return;
		}

		let location = await Location.getCurrentPositionAsync({});
		setCurrentLocation(location);
		console.log({ location });
	};

	useEffect(() => {
		getUserLocation();
	}, []);

	return (
		<View style={appStyle(theme).container}>
			<Appbar>
				<Text variant="headlineSmall"> Location Alarm</Text>
				<Appbar.Action
					icon={theme === dark ? "lightbulb-on" : "lightbulb-on-outline"}
					onPress={() => setTheme(theme === dark ? light : dark)}
				/>
			</Appbar>
			<ScrollView></ScrollView>
			<Modal visible={showModal}>
				<MapView />
			</Modal>
		</View>
	);
};

export default App;
