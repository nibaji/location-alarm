import React, { useState, useEffect, useContext } from "react";
import { View, PermissionsAndroid, SafeAreaView } from "react-native";
import * as Location from "expo-location";
import { Modal, Appbar, Text, FAB } from "react-native-paper";
import { StatusBar } from "expo-status-bar";

import MapView from "./src/components/MapView";
import LocationInput from "./src/components/LocationInput";
import AlarmsList from "./src/components/AlarmsList";

import { triggerGPSPolling } from "./src/utils/backgroundTask";

import { AppContext } from "./src/context/appContext";

import { appStyle, locationInputStyle, mapStyle } from "./src/styles/styles";
import { dark, light } from "./src/styles/paperTheme";

export const App: React.FC = () => {
	const [errorMsg, setErrorMsg] = useState<string | null>(null);

	const {
		setCurrentLocation,
		theme,
		setTheme,
		alarms,
		editAlarm,
		setCurrentAlarm,
		showMapViewModal,
		setShowMapViewModal,
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
	};

	const getAllPermissions = async function requestPostNotification() {
		try {
			const granted = await PermissionsAndroid.request(
				PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
				{
					title: "Notification",
					message: "Please allow to show notifications",
					buttonNeutral: "Ask Me Later",
					buttonNegative: "Cancel",
					buttonPositive: "OK",
				}
			);
			if (granted === PermissionsAndroid.RESULTS.GRANTED) {
				await getUserLocation();
			} else {
				setErrorMsg("Notification Error");
			}
		} catch (err) {
			setErrorMsg("Some Error");
			console.warn(err);
		}
	};

	const closeManualModal = (preserveCurrentAlarm: boolean = false) => {
		if (!preserveCurrentAlarm) {
			setCurrentAlarm(undefined);
		}
		setShowManualLocationInputModal(false);
	};

	useEffect(() => {
		triggerGPSPolling(alarms, editAlarm, theme);
	}, [JSON.stringify(alarms)]);

	useEffect(() => {
		getAllPermissions();
	}, []);

	return (
		<SafeAreaView style={appStyle(theme).app}>
			<StatusBar />
			<Appbar style={appStyle(theme).appBar}>
				<Appbar.Content
					title="Geo Alarm"
					titleStyle={appStyle(theme).titleText}
					mode="large"
					color={theme?.colors.primary}
				/>
				<Appbar.Action
					icon={
						JSON.stringify(theme) === JSON.stringify(dark)
							? "weather-night"
							: "white-balance-sunny"
					}
					color={theme?.colors.primary}
					onPress={() => setTheme(theme === dark ? light : dark)}
				/>
			</Appbar>
			<View style={appStyle(theme).container}>
				{errorMsg ? (
					<Text style={appStyle(theme).errorText}>
						Please Grant Location and Notification Permissions for the app to
						work!
					</Text>
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
			</View>
			<Modal
				visible={showManualLocationInputModal}
				onDismiss={closeManualModal}
				contentContainerStyle={locationInputStyle(theme).modalContainer}
			>
				<LocationInput closeModal={closeManualModal} />
			</Modal>
			<Modal
				visible={showMapViewModal}
				onDismiss={() => setShowMapViewModal(false)}
				contentContainerStyle={mapStyle(theme).modalContainer}
			>
				<MapView />
			</Modal>
		</SafeAreaView>
	);
};

export default App;
