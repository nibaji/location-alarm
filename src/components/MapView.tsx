import React, { useState } from "react";
import { View, Button, Text } from "react-native";
import WebView from "react-native-webview";

import { MapViewPropsType } from "../types/propTypes";
import { CoordinatesType } from "../types/stateTypes";

import { mapStyle } from "../styles/styles";

const MapView: React.FC<MapViewPropsType> = () => {
	const [coordinates, setCoordinates] = useState<CoordinatesType>(null);

	const getTargetGpsCoordinates = (url: string) => {
		const regex = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
		const match = url?.match(regex);
		if (match) {
			const latitude = parseFloat(match[1]);
			const longitude = parseFloat(match[2]);
			console.log({ latitude, longitude, url });
			setCoordinates({ latitude, longitude });
		} else {
			setCoordinates(null);
		}
	};

	return (
		<View style={mapStyle.container}>
			<WebView
				style={mapStyle.webView}
				source={{ uri: "https://www.google.com/maps" }}
				scrollEnabled
				geolocationEnabled
				androidLayerType="hardware"
				originWhitelist={["https://www.google.com/maps"]}
				onNavigationStateChange={(e) => getTargetGpsCoordinates(e.url)}
			/>
			<View style={mapStyle.buttonWrapper}>
				<Button
					title="Pick the chosen location"
					color="royalblue"
					disabled={!coordinates}
				/>
				<Text>Search a location or Pick in the map</Text>
				<Text>Current Latitude: {coordinates?.latitude}</Text>
				<Text>Current longitude: {coordinates?.longitude}</Text>
			</View>
		</View>
	);
};

export default MapView;
