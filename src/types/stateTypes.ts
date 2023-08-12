import { MD3Theme } from "react-native-paper";
import { LocationObject } from "expo-location";

export type CoordinatesType = {
	latitude: number;
	longitude: number;
} | null;

export type AppStateType = {
	theme: MD3Theme;
	setTheme: Function;
	currentLocation: LocationObject | null;
	setCurrentLocation: Function;
};
