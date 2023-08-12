import React, { useState } from "react";
import { PaperProvider } from "react-native-paper";
import { LocationObject } from "expo-location";

import App from "./App";

import { AppContext, initialAppState } from "./src/context/appContext";

import { AlarmItemType, AlarmsType } from "./src/types/stateTypes";

import { dark } from "./src/styles/paperTheme";

const PaperApp = () => {
	const [theme, setTheme] = useState(dark);
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

	const value = {
		...initialAppState,
		theme,
		setTheme,
		currentLocation,
		setCurrentLocation,
		alarms,
		setAlarms,
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

	return (
		<AppContext.Provider value={value}>
			<PaperProvider theme={value.theme}>
				<App />
			</PaperProvider>
		</AppContext.Provider>
	);
};

export default PaperApp;
