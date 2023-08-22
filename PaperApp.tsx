import React, { useState, useEffect } from "react";
import { PaperProvider, MD3Theme } from "react-native-paper";
import { LocationObject } from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";

import App from "./App";

import { AppContext, initialAppState } from "./src/context/appContext";

import { AlarmItemType, AlarmsType } from "./src/types/stateTypes";

import { dark } from "./src/styles/paperTheme";

const PaperApp = () => {
	const [theme, setTheme] = useState<MD3Theme>();
	const [currentLocation, setCurrentLocation] = useState<LocationObject | null>(
		null
	);
	const [alarms, setAlarms] = useState<AlarmsType>();
	const [currentAlarm, setCurrentAlarm] = useState<AlarmItemType>();

	const [showMapViewModal, setShowMapViewModal] = useState(false);
	const [showCreateEditAlarm, setShowCreateEditAlarm] = useState(false);

	const [formDataDraft, setFormDataDraft] = useState(null);

	const deleteAlarm = (id: string) => {
		const newAlarmsMap = { ...alarms };
		delete newAlarmsMap?.[id];
		setAlarms(newAlarmsMap);
	};

	const editAlarm = (id: string, newAlarmData: AlarmItemType) =>
		setAlarms({
			...alarms,
			[id]: newAlarmData,
		});

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
			await AsyncStorage.setItem("alarmsMap", JSON.stringify(alarms));
		} catch (e) {
			console.log(e, "Alarms Set Async");
		}
	};

	const hydrateAlarmsFromAsync = async () => {
		try {
			const theAlarms = await AsyncStorage.getItem("alarmsMap");
			if (theAlarms) setAlarms(JSON.parse(theAlarms));
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
		showCreateEditAlarm,
		setShowCreateEditAlarm,
		formDataDraft,
		setFormDataDraft,
	};

	useEffect(() => {
		if (alarms) saveAlarmsToAsync();
		if (theme) saveThemeToAsync();
	}, [JSON.stringify(alarms), JSON.stringify(theme)]);

	useEffect(() => {
		hydrateAlarmsFromAsync();
		hydrateThemeFromAsync();
	}, []);

	return (
		<AppContext.Provider value={value}>
			<PaperProvider theme={value?.theme ?? dark}>
				<App />
			</PaperProvider>
		</AppContext.Provider>
	);
};

export default PaperApp;
