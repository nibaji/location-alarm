import React, { useState, useEffect } from "react";
import { View } from "react-native";
import * as Location from "expo-location";

import MapView from "./src/components/MapView";

import { appStyle } from "./src/styles/styles";

export const App: React.FC = () => {
	const [userLocation, setUserLocation] =
		useState<Location.LocationObject | null>(null);
	const [errorMsg, setErrorMsg] = useState<string | null>(null);

	const getUserLocation = async () => {
		let { status } = await Location.requestForegroundPermissionsAsync();
		if (status !== "granted") {
			setErrorMsg("Permission to access location was denied");
			return;
		}

		let location = await Location.getCurrentPositionAsync({});
		console.log({ location });
		setUserLocation(location);
	};

	useEffect(() => {
		getUserLocation();
	}, []);

	return (
		<View style={appStyle.container}>
			<MapView />
		</View>
	);
};

export default App;
