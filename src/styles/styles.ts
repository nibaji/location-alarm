import { StyleSheet, Dimensions } from "react-native";
import { MD3Theme } from "react-native-paper";

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

export const appStyle = (theme: MD3Theme) =>
	StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: theme.colors.background,
			alignItems: "center",
			justifyContent: "center",
		},
		fab: {
			position: "absolute",
			bottom: "4%",
		},
	});

export const mapStyle = (theme: MD3Theme) =>
	StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: theme.colors.background,
			alignItems: "center",
			justifyContent: "center",
		},
		webView: {
			flex: 1,
			width: deviceWidth,
		},
		detailsContainer: {
			flex: 0.28,
			backgroundColor: theme.colors.secondary,
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
			color: theme.colors.primaryContainer,
			fontSize: 12,
			margin: 2,
			marginBottom: 8,
			marginLeft: 16,
			padding: 2,
			borderRadius: theme.roundness,
			textAlign: "center",
		},
		coordinatesContainer: {
			borderRadius: theme.roundness,
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
			color: theme.colors.secondary,
			fontWeight: "bold",
		},
		coordinateDescriptionText: {
			color: theme.colors.tertiary,
			fontStyle: "italic",
			fontWeight: "bold",
			textAlign: "right",
		},
	});

export const locationInputStyle = (theme: MD3Theme) =>
	StyleSheet.create({
		modalContainer: {
			alignItems: "center",
			justifyContent: "center",
		},
		container: {
			width: deviceWidth * 0.9,
			backgroundColor: theme.colors.background,
			borderRadius: theme.roundness,
			padding: 24,
		},
		title: {
			textAlign: "center",
			fontWeight: "bold",
		},
		divider: {
			marginTop: 16,
		},
		textInput: {
			marginTop: 12,
		},
		buttonsContainer: {
			flexDirection: "row",
			marginTop: 16,
			justifyContent: "space-between",
			alignItems: "center",
		},
		cancelButtonLabel: {
			color: theme.colors.error,
		},
		cancelButton: {
			backgroundColor: theme.colors.errorContainer,
		},
	});
