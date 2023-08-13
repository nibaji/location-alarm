import { MD3Theme } from "react-native-paper";
import { LocationObject } from "expo-location";

import { LocationFormDataType } from "./dataTypes";

export type CoordinatesType = {
	latitude: number;
	longitude: number;
} | null;

export type AlarmItemType = {
	title: string;
	location: CoordinatesType;
	radius: number;
	active: boolean;
	id: string; // date in millisecond string
};

export type AlarmsType = AlarmItemType[];

export type AppStateType = {
	theme?: MD3Theme;
	setTheme: Function;
	currentLocation: LocationObject | null;
	setCurrentLocation: Function;
	alarms: AlarmItemType[];
	setAlarms: Function;
	saveAlarmsToAsync: Function;
	deleteAlarm: Function;
	editAlarm: Function;
	currentAlarm: AlarmItemType | undefined;
	setCurrentAlarm: Function;
	showMapViewModal: boolean;
	setShowMapViewModal: Function;
	showManualLocationInputModal: boolean;
	setShowManualLocationInputModal: Function;
	formDataDraft: LocationFormDataType | null;
	setFormDataDraft: Function;
};
