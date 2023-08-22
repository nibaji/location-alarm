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
	saveAlarmsToAsync: async () => {},
	deleteAlarm: () => {},
	editAlarm: () => {},
	currentAlarm: undefined,
	setCurrentAlarm: () => {},
	showMapViewModal: false,
	setShowMapViewModal: () => {},
	showCreateEditAlarm: false,
	setShowCreateEditAlarm: () => {},
	formDataDraft: null,
	setFormDataDraft: () => {},
};

export const AppContext = createContext(initialAppState);
