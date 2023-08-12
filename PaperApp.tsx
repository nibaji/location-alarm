import React, { useState } from "react";
import { PaperProvider } from "react-native-paper";
import { LocationObject } from "expo-location";

import App from "./App";

import { AppContext, initialAppState } from "./src/context/appContext";

import { AlarmsType } from "./src/types/stateTypes";

import { dark } from "./src/styles/paperTheme";

const PaperApp = () => {
	const [theme, setTheme] = useState(dark);
	const [currentLocation, setCurrentLocation] = useState<LocationObject | null>(
		null
	);
	const [alarms, setNewAlarm] = useState<AlarmsType>([]);

	const value = {
		...initialAppState,
		theme,
		setTheme,
		currentLocation,
		setCurrentLocation,
		alarms,
		setNewAlarm,
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
