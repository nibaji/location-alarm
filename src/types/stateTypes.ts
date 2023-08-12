import { MD3Theme } from "react-native-paper";
import { LocationObject } from "expo-location";

export type CoordinatesType = {
	latitude: number;
	longitude: number;
} | null;

export type AlarmItemType = {
	title: string;
	location: CoordinatesType;
	radius: number;
	active: Boolean;
	id: string; // title + location.latitude.toString() + location.longitude.toString() + radius.toString()
};

export type AlarmsType = AlarmItemType[];

export type AppStateType = {
	theme: MD3Theme;
	setTheme: Function;
	currentLocation: LocationObject | null;
	setCurrentLocation: Function;
	alarms: AlarmItemType[];
	setNewAlarm: Function;
};
