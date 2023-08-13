import React, { useState, useEffect } from "react";
import { PaperProvider, MD3Theme } from "react-native-paper";
import { LocationObject } from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";

import App from "./App";

import { AppContext, initialAppState } from "./src/context/appContext";

import { AlarmItemType, AlarmsType } from "./src/types/stateTypes";

import { dark } from "./src/styles/paperTheme";

const PaperApp = () => {
	const [theme, setTheme] = useState<MD3Theme | undefined>();
	const [currentLocation, setCurrentLocation] = useState<LocationObject | null>(
		null
	);
	const [alarms, setAlarms] = useState<AlarmsType>([]);
	const [currentAlarm, setCurrentAlarm] = useState<AlarmItemType | undefined>();

	const [showMapViewModal, setShowMapViewModal] = useState(false);
	const [showManualLocationInputModal, setShowManualLocationInputModal] =
		useState(false);

	const [formDataDraft, setFormDataDraft] = useState(null);

	const deleteAlarm = (id: string) =>
		setAlarms(alarms.filter((_alarm) => _alarm.id !== id));

	const editAlarm = (id: string, newAlarmData: AlarmItemType) =>
		setAlarms(
			alarms.map((_alarm) => {
				if (_alarm.id === id) {
					return newAlarmData;
				}
				return _alarm;
			})
		);

	const saveThemeToAsync = async () => {
		try {
			await AsyncStorage.setItem("theme", JSON.stringify(theme));
		} catch (e) {
			console.log(e, "Theme Set Async");
		}
	};

	const hydrateThemeFromAsync = async () => {
		try {
			const theTheme = await AsyncStorage.getItem("theme");
			if (theTheme) setTheme(JSON.parse(theTheme));
		} catch (e) {
			console.log(e, "Alarms Get Async");
		}
	};

	const saveAlarmsToAsync = async () => {
		try {
			await AsyncStorage.setItem("alarms", JSON.stringify(alarms));
		} catch (e) {
			console.log(e, "Alarms Set Async");
		}
	};

	const hydrateAlarmsFromAsync = async () => {
		try {
			const theAlarms = await AsyncStorage.getItem("alarms");
			console.log({ theAlarms, alarms: theAlarms && JSON.parse(theAlarms) });
			if (theAlarms) setAlarms([...JSON.parse(theAlarms)]);
		} catch (e) {
			console.log(e, "Alarms Get Async");
		}
	};

	const value = {
		...initialAppState,
		theme,
		setTheme,
		currentLocation,
		setCurrentLocation,
		alarms,
		setAlarms,
		saveAlarmsToAsync,
		deleteAlarm,
		editAlarm,
		currentAlarm,
		setCurrentAlarm,
		showMapViewModal,
		setShowMapViewModal,
		showManualLocationInputModal,
		setShowManualLocationInputModal,
		formDataDraft,
		setFormDataDraft,
	};

	useEffect(() => {
		saveAlarmsToAsync();
		saveThemeToAsync();
	}, [JSON.stringify(alarms), theme]);

	useEffect(() => {
		hydrateAlarmsFromAsync();
		hydrateThemeFromAsync();
	}, []);

	return (
		<AppContext.Provider value={value}>
			<PaperProvider theme={value?.theme || dark}>
				<App />
			</PaperProvider>
		</AppContext.Provider>
	);
};

export default PaperApp;
