import { StyleSheet, Dimensions } from "react-native";

const deviceWidth = Dimensions.get("window").width;

export const appStyle = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
});

export const mapStyle = StyleSheet.create({
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
		width: deviceWidth,
		padding: 16,
	},
});
