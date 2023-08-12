import React, { useState, useContext } from "react";
import { View } from "react-native";
import { Button, Text, Surface, Card } from "react-native-paper";
import WebView from "react-native-webview";
import Entypo from "react-native-vector-icons/Entypo";

import { AppContext } from "../context/appContext";

import { MapViewPropsType } from "../types/propTypes";
import { CoordinatesType } from "../types/stateTypes";

import { mapStyle } from "../styles/styles";
import { dark } from "../styles/paperTheme";

const MapView: React.FC<MapViewPropsType> = () => {
	const { theme } = useContext(AppContext);

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
		<View style={mapStyle(theme).container}>
			<WebView
				style={mapStyle(theme).webView}
				source={{ uri: "https://www.google.com/maps" }}
				scrollEnabled
				geolocationEnabled
				androidLayerType="hardware"
				originWhitelist={["https://www.google.com/maps"]}
				onNavigationStateChange={(e) => getTargetGpsCoordinates(e.url)}
			/>
			<Surface
				style={mapStyle(theme).detailsContainer}
				mode="elevated"
				elevation={4}
			>
				<Button
					icon="google-maps"
					buttonColor={dark.colors.primaryContainer}
					textColor={dark.colors.secondary}
					labelStyle={mapStyle(theme).buttonLabel}
				>
					Pick the Chosen Location
				</Button>
				<Text style={mapStyle(theme).hintText}>
					<Entypo name="info-with-circle" /> Search a location or Pick in the
					map
				</Text>
				<Card
					style={mapStyle(theme).coordinatesContainer}
					mode="elevated"
					elevation={4}
				>
					<View style={mapStyle(theme).coordinateItemContainer}>
						<Text style={mapStyle(theme).coordinateTitleText}>
							Current Target Latitude :{" "}
						</Text>
						<Text style={mapStyle(theme).coordinateDescriptionText}>
							{coordinates?.latitude}
						</Text>
					</View>
					<View style={mapStyle(theme).coordinateItemContainer}>
						<Text style={mapStyle(theme).coordinateTitleText}>
							Current Target longitude :{" "}
						</Text>
						<Text style={mapStyle(theme).coordinateDescriptionText}>
							{coordinates?.longitude}
						</Text>
					</View>
				</Card>
			</Surface>
		</View>
	);
};

export default MapView;
