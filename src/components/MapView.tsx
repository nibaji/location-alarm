import React, { useState } from "react";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import WebView from "react-native-webview";
import Entypo from "react-native-vector-icons/Entypo";

import { MapViewPropsType } from "../types/propTypes";
import { CoordinatesType } from "../types/stateTypes";

import { mapStyle } from "../styles/styles";
import { paperTheme } from "../styles/paperTheme";

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
			<View style={mapStyle.detailsContainer}>
				<Button
					icon="google-maps"
					buttonColor={paperTheme.colors.primaryContainer}
					textColor={paperTheme.colors.secondary}
					labelStyle={mapStyle.buttonLabel}
				>
					Pick the Chosen Location
				</Button>
				<Text style={mapStyle.hintText}>
					<Entypo name="info-with-circle" /> Search a location or Pick in the
					map
				</Text>
				<View style={mapStyle.coordinatesContainer}>
					<Text style={mapStyle.coordinateTitleText}>
						Current Target Latitude :{" "}
						<Text style={mapStyle.coordinateDescriptionText}>
							{coordinates?.latitude}
						</Text>
					</Text>
					<Text style={mapStyle.coordinateTitleText}>
						Current Target longitude :{" "}
						<Text style={mapStyle.coordinateDescriptionText}>
							{coordinates?.longitude}
						</Text>
					</Text>
				</View>
			</View>
		</View>
	);
};

export default MapView;
