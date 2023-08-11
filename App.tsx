import React, { useState, useEffect } from "react";
import { StyleSheet, Button, View, Text, Dimensions } from "react-native";
import WebView from "react-native-webview";

const deviceWidth = Dimensions.get("window").width;

export default function App() {
	const [coordinates, setCoordinates] = useState<{
		latitude: number;
		longitude: number;
	} | null>(null);

	const getGpsCoordinates = (url: string) => {
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
		<View style={styles.container}>
			<WebView
				style={styles.webView}
				source={{ uri: "https://www.google.com/maps" }}
				scrollEnabled
				geolocationEnabled
				androidLayerType="hardware"
				originWhitelist={["https://www.google.com/maps"]}
				onNavigationStateChange={(e) => getGpsCoordinates(e.url)}
			/>
			<View style={styles.buttonWrapper}>
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
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
	webView: {
		flex: 1,
		width: deviceWidth,
	},
	buttonWrapper: {
		flex: 0.16,
		backgroundColor: "lightcyan",
		justifyContent: "center",
		width: "100%",
		padding: 16,
	},
});
