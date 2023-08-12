import { StyleSheet, Dimensions } from "react-native";

import { paperTheme } from "./paperTheme";

const deviceWidth = Dimensions.get("window").width;

export const appStyle = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: paperTheme.colors.background,
		alignItems: "center",
		justifyContent: "center",
	},
});

export const mapStyle = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: paperTheme.colors.background,
		alignItems: "center",
		justifyContent: "center",
	},
	webView: {
		flex: 1,
		width: deviceWidth,
	},
	detailsContainer: {
		flex: 0.28,
		backgroundColor: paperTheme.colors.secondary,
		justifyContent: "center",
		alignItems: "center",
		width: deviceWidth,
		padding: 16,
	},
	buttonLabel: {
		padding: 4,
		fontWeight: "bold",
		textTransform: "uppercase",
	},
	hintText: {
		color: paperTheme.colors.primaryContainer,
		fontSize: 12,
		margin: 2,
		marginBottom: 8,
		marginLeft: 16,
		padding: 2,
		borderRadius: 8,
		textAlign: "center",
	},
	coordinatesContainer: {
		borderRadius: 16,
		paddingHorizontal: 24,
		paddingVertical: 16,
		margin: 8,
		minWidth: "80%",
	},
	coordinateItemContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 4,
	},
	coordinateTitleText: {
		color: paperTheme.colors.secondary,
		fontWeight: "bold",
	},
	coordinateDescriptionText: {
		color: paperTheme.colors.tertiary,
		fontStyle: "italic",
		fontWeight: "bold",
		textAlign: "right",
	},
});
