import React, { useState, useEffect } from "react";
import { StyleSheet, Button, View, Text, Dimensions } from "react-native";
import WebView from "react-native-webview";

const deviceWidth = Dimensions.get("window").width;

export default function App() {
	const [url, setUrl] = useState<string | undefined>(
		"https://www.google.com/maps"
	);

	const getGpsCoordinates = () => {
		const regex = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
		const match = url?.match(regex);
		if (match) {
			const latitude = parseFloat(match[1]);
			const longitude = parseFloat(match[2]);
			console.log({ latitude, longitude });
			return { latitude, longitude };
		} else {
			return null;
		}
	};

	useEffect(() => {
		getGpsCoordinates();
	}, [url]);

	return (
		<View style={styles.container}>
			<WebView
				style={styles.webView}
				source={{ uri: "https://www.google.com/maps" }}
				scrollEnabled
				geolocationEnabled
				androidLayerType="hardware"
				originWhitelist={["https://www.google.com/maps"]}
				onNavigationStateChange={(e) => setUrl(e.url)}
			/>
			<View style={styles.buttonWrapper}>
				<Button title="Pick the chosen location" color="red" />
				<Text>Search a location or Pick in the map</Text>
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
		backgroundColor: "purple",
		justifyContent: "center",
		width: "100%",
		padding: 16,
	},
});
