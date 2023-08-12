import React, { useState, useEffect, useContext } from "react";
import { View } from "react-native";
import * as Location from "expo-location";
import { Modal, Appbar, Text, FAB } from "react-native-paper";

import MapView from "./src/components/MapView";
import LocationInput from "./src/components/LocationInput";
import AlarmsList from "./src/components/AlarmsList";

import { AppContext } from "./src/context/appContext";

import { appStyle, locationInputStyle } from "./src/styles/styles";
import { dark, light } from "./src/styles/paperTheme";

export const App: React.FC = () => {
	const [errorMsg, setErrorMsg] = useState<string | null>(null);

	const {
		setCurrentLocation,
		theme,
		setTheme,
		setCurrentAlarm,
		showMapViewModal,
		showManualLocationInputModal,
		setShowManualLocationInputModal,
	} = useContext(AppContext);

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

	const closeModal = () => {
		setCurrentAlarm(undefined);
		setShowManualLocationInputModal(false);
	};

	useEffect(() => {}, []);

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
			{errorMsg ? (
				<Text>Please Grant Location Permission for the app to work!</Text>
			) : (
				<>
					<AlarmsList />
					<FAB
						icon="plus"
						style={appStyle(theme).fab}
						onPress={() =>
							setShowManualLocationInputModal(!showManualLocationInputModal)
						}
					/>
				</>
			)}
			<Modal
				visible={showManualLocationInputModal}
				onDismiss={closeModal}
				contentContainerStyle={locationInputStyle(theme).modalContainer}
			>
				<LocationInput closeModal={closeModal} />
			</Modal>
			<Modal visible={showMapViewModal}>
				<MapView />
			</Modal>
		</View>
	);
};

export default App;
