import React, { useState } from "react";
import { View } from "react-native";
import { Button, Text, Surface, Card } from "react-native-paper";
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
			<Surface style={mapStyle.detailsContainer} mode="elevated" elevation={4}>
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
				<Card
					style={mapStyle.coordinatesContainer}
					mode="elevated"
					elevation={4}
				>
					<View style={mapStyle.coordinateItemContainer}>
						<Text style={mapStyle.coordinateTitleText}>
							Current Target Latitude :{" "}
						</Text>
						<Text style={mapStyle.coordinateDescriptionText}>
							{coordinates?.latitude}
						</Text>
					</View>
					<View style={mapStyle.coordinateItemContainer}>
						<Text style={mapStyle.coordinateTitleText}>
							Current Target longitude :{" "}
						</Text>
						<Text style={mapStyle.coordinateDescriptionText}>
							{coordinates?.longitude}
						</Text>
					</View>
				</Card>
			</Surface>
		</View>
	);
};

export default MapView;
