import React, { useState, useContext } from "react";
import { View } from "react-native";
import { Button, Text, Surface, Card } from "react-native-paper";
import WebView from "react-native-webview";
import Entypo from "react-native-vector-icons/Entypo";

import { AppContext } from "../context/appContext";

import { MapViewPropsType } from "../types/propTypes";
import { CoordinatesType } from "../types/stateTypes";

import { mapStyle } from "../styles/styles";

const MapView: React.FC<MapViewPropsType> = () => {
	const {
		theme,
		currentLocation,
		setShowMapViewModal,
		setShowManualLocationInputModal,
		formDataDraft,
		setFormDataDraft,
	} = useContext(AppContext);

	const [coordinates, setCoordinates] = useState<CoordinatesType>(null);

	const getTargetGpsCoordinates = (url: string) => {
		const regex = /lat=(-?\d+\.\d+)&lon=(-?\d+\.\d+)/;
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
				source={{
					uri: `https://www.openstreetmap.org/query?lat=${currentLocation?.coords.latitude}&lon=${currentLocation?.coords.longitude}`,
				}}
				scrollEnabled
				geolocationEnabled
				androidLayerType="hardware"
				originWhitelist={["https://www.openstreetmap.org/query?"]}
				onNavigationStateChange={(e) => getTargetGpsCoordinates(e.url)}
			/>
			<Surface
				style={mapStyle(theme).detailsContainer}
				mode="elevated"
				elevation={4}
			>
				<Text style={mapStyle(theme).hintText}>
					<Entypo name="info-with-circle" /> Drag and tap on the desired
					location in "Query Feature" to get the latitude and longitude.
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

				<View style={mapStyle(theme).buttonsContainer}>
					<Button
						buttonColor={theme.colors.errorContainer}
						textColor={theme.colors.error}
						mode="elevated"
						onPress={() => setShowMapViewModal(false)}
					>
						Cancel
					</Button>
					<Button
						icon="google-maps"
						buttonColor={theme.colors.primaryContainer}
						textColor={theme.colors.secondary}
						labelStyle={mapStyle(theme).buttonLabel}
						mode="elevated"
						onPress={() => {
							if (coordinates?.latitude && coordinates.longitude) {
								setFormDataDraft({
									...formDataDraft,
									latitude: coordinates.latitude,
									longitude: coordinates.longitude,
								});
								setShowMapViewModal(false);
								setShowManualLocationInputModal(true);
							}
						}}
					>
						Pick the Chosen Location
					</Button>
				</View>
			</Surface>
		</View>
	);
};

export default MapView;
