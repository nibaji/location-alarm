import React, { useState, useEffect, useContext } from "react";
import { View, PermissionsAndroid, SafeAreaView, Alert } from "react-native";
import * as Location from "expo-location";
import { Modal, Appbar, Text, FAB } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import * as TaskManager from "expo-task-manager";
import * as Notifications from "expo-notifications";
import {
	BatteryOptEnabled,
	RequestDisableOptimization,
} from "react-native-battery-optimization-check";

import MapView from "./src/components/MapView";
import CreateEditAlarm from "./src/components/CreateEditAlarm";
import AlarmsList from "./src/components/AlarmsList";

import { AppContext } from "./src/context/appContext";

import { appStyle, locationInputStyle, mapStyle } from "./src/styles/styles";
import { dark, light } from "./src/styles/paperTheme";
import { triggerVibrationAndSound } from "./src/utils/utils";

const GEO_FENCING_TASK_NAME = "geoFencing";

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: false,
		shouldSetBadge: true,
	}),
});

// todo: implement proper  types
let currentRegions: Location.LocationRegion[] | any = [];

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
		showCreateEditAlarm,
		setShowCreateEditAlarm,
	} = useContext(AppContext);

	const getUserLocation = async () => {
		console.log("here");
		const location = await Location.getCurrentPositionAsync({});
		setCurrentLocation(location);
	};

	const disableDoze = async () => {
		await RequestDisableOptimization();
	};

	const getLocationPermission = async () => {
		const fgLocationPerm = await Location.requestForegroundPermissionsAsync();
		if (fgLocationPerm.status === "granted") {
			const { status } = await Location.requestBackgroundPermissionsAsync();
			if (status !== "granted") {
				setErrorMsg("Permission to access location was denied");
				return;
			}

			await getUserLocation(); // get user location
		} else {
			setErrorMsg("Permission to access location was denied");
			return;
		}
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
				const bgLocationPermission =
					await Location.getBackgroundPermissionsAsync();
				if (bgLocationPermission.status !== "granted") {
					Alert.alert(
						"Allow Background Location Access",
						"App requires to access background location for the alarm to work.",
						[
							{
								text: "Cancel",
								onPress: () =>
									setErrorMsg("location permission is not granted"),
								style: "cancel",
							},
							{
								text: "OK",
								onPress: getLocationPermission,
							},
						]
					);
				}
				const isDozeEnabled = await BatteryOptEnabled();
				if (isDozeEnabled) {
					Alert.alert(
						"Allow App to run in the Background",
						"App requires to run in the background for the alarm to be triggered.",
						[
							{
								text: "Cancel",
								onPress: () => setErrorMsg("doze is not disabled"),
								style: "cancel",
							},
							{
								text: "OK",
								onPress: disableDoze,
							},
						]
					);
					disableDoze();
				}
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
		setShowCreateEditAlarm(false);
	};

	useEffect(() => {
		const regions: Location.LocationRegion[] | any = [];
		Object.values(alarms ?? {}).forEach((alarm) => {
			if (alarm.active) {
				regions.push({
					latitude: alarm.location?.latitude ?? 0,
					longitude: alarm.location?.longitude ?? 0,
					radius: alarm.radius || 0.01,
					identifier: JSON.stringify({
						id: alarm.id,
						title: alarm.title,
					}),
					editAlarm,
					alarm,
				});
			}
		});

		if (TaskManager.isTaskDefined(GEO_FENCING_TASK_NAME)) {
			if (regions.length) {
				currentRegions = [...regions];
				Location.startGeofencingAsync(GEO_FENCING_TASK_NAME, regions);
			} else {
				TaskManager.unregisterAllTasksAsync();
			}
		}
	}, [JSON.stringify(alarms)]);

	useEffect(() => {
		getAllPermissions();
	}, []);

	return (
		<SafeAreaView style={appStyle(theme).app}>
			<StatusBar
				style={
					JSON.stringify(theme) === JSON.stringify(dark) ? "light" : "dark"
				}
			/>
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
					<Text style={appStyle(theme).errorText} onPress={getAllPermissions}>
						Please Grant Background Location and Notification Permissions,
						disable battery optimization(doze) for the app!
					</Text>
				) : (
					<>
						<AlarmsList />
						<FAB
							icon="plus"
							style={appStyle(theme).fab}
							onPress={() => {
								setCurrentAlarm(null);
								setShowCreateEditAlarm(!showCreateEditAlarm);
							}}
						/>
					</>
				)}
			</View>
			<Modal
				visible={showCreateEditAlarm}
				onDismiss={closeManualModal}
				contentContainerStyle={locationInputStyle(theme).modalContainer}
			>
				<CreateEditAlarm closeModal={closeManualModal} />
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

TaskManager.defineTask(GEO_FENCING_TASK_NAME, ({ data, error }) => {
	const { eventType, region } = data as {
		eventType: Location.GeofencingEventType;
		region: Location.LocationRegion;
	};
	if (error) {
		console.log({ error: error.message });
		return;
	}
	if (eventType === Location.GeofencingEventType.Enter) {
		const theRegion = currentRegions.find(
			(_region: any) => _region.identifier === region.identifier
		);
		const alarm = theRegion?.alarm;
		const editAlarm = theRegion?.editAlarm;
		triggerVibrationAndSound(editAlarm, alarm);
		Notifications.scheduleNotificationAsync({
			content: {
				title: "You've Arrived",
				subtitle: alarm?.title,
				body: `You have reached ${alarm.title}`,
			},
			trigger: null,
		});
	}
});

export default App;
