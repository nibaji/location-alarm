import { createContext } from "react";
import { dark } from "../styles/paperTheme";
4;

import { AppStateType } from "../types/stateTypes";

export const initialAppState: AppStateType = {
	theme: dark,
	setTheme: () => {},
	currentLocation: null,
	setCurrentLocation: () => {},
	alarms: [],
	setAlarms: () => {},
	deleteAlarm: () => {},
	editAlarm: () => {},
	currentAlarm: undefined,
	setCurrentAlarm: () => {},
	showMapViewModal: false,
	setShowMapViewModal: () => {},
	showManualLocationInputModal: false,
	setShowManualLocationInputModal: () => {},
};

export const AppContext = createContext(initialAppState);
