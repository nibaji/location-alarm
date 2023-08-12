import React, { useState, useEffect, useContext } from "react";
import { View, ScrollView } from "react-native";
import * as Location from "expo-location";
import { Modal, Appbar, Text, FAB } from "react-native-paper";

import MapView from "./src/components/MapView";
import LocationInput from "./src/components/LocationInput";

import { AppContext } from "./src/context/appContext";

import { appStyle, locationInputStyle } from "./src/styles/styles";
import { dark, light } from "./src/styles/paperTheme";
import AlarmsList from "./src/components/AlarmsList";

export const App: React.FC = () => {
	const [showMapViewModal, setMapViewShowModal] = useState(false);
	const [showManualLocationInputModal, setShowManualLocationInputModal] =
		useState(false);
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
			<AlarmsList />
			<FAB
				icon="plus"
				style={appStyle(theme).fab}
				onPress={() =>
					setShowManualLocationInputModal(!showManualLocationInputModal)
				}
			/>
			<Modal
				visible={showManualLocationInputModal}
				onDismiss={() => setShowManualLocationInputModal(false)}
				contentContainerStyle={locationInputStyle(theme).modalContainer}
			>
				<LocationInput
					closeModal={() => setShowManualLocationInputModal(false)}
				/>
			</Modal>
			<Modal visible={showMapViewModal}>
				<MapView />
			</Modal>
		</View>
	);
};

export default App;
