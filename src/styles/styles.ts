import { StyleSheet, Dimensions } from "react-native";
import { MD3Theme } from "react-native-paper";

import { dark } from "./paperTheme";

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

export const appStyle = (theme: MD3Theme = dark) =>
	StyleSheet.create({
		app: {
			flex: 1,
			paddingVertical: 32,
			backgroundColor: theme.colors.background,
		},
		appBar: {
			marginVertical: 8,
			paddingHorizontal: 16,
		},
		container: {
			flex: 1,
			backgroundColor: theme.colors.background,
			alignItems: "center",
			justifyContent: "center",
		},
		logo: {
			width: 24,
			margin: 16,
			aspectRatio: 1,
		},
		titleText: {
			fontWeight: "bold",
		},
		fab: {
			position: "absolute",
			bottom: "-1%",
		},
		errorText: {
			color: theme.colors.error,
			textAlign: "center",
		},
	});

export const mapStyle = (theme: MD3Theme = dark) =>
	StyleSheet.create({
		modalContainer: {
			height: deviceHeight,
			alignItems: "center",
			justifyContent: "center",
		},
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
			flex: 0.24,
			backgroundColor: theme.colors.secondary,
			justifyContent: "center",
			alignItems: "center",
			width: deviceWidth,
			padding: 8,
		},
		buttonsContainer: {
			flexDirection: "row",
			justifyContent: "space-around",
			width: "100%",
		},
		buttonLabel: {
			padding: 2,
			fontWeight: "bold",
			textTransform: "uppercase",
		},
		hintText: {
			color: theme.colors.primaryContainer,
			fontSize: 12,
			margin: 2,
			padding: 2,
			textAlign: "justify",
		},
		coordinatesContainer: {
			borderRadius: theme.roundness,
			paddingHorizontal: 16,
			paddingVertical: 8,
			marginVertical: 8,
			minWidth: "80%",
		},
		coordinateItemContainer: {
			flexDirection: "row",
			justifyContent: "space-between",
			marginBottom: 2,
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

export const locationInputStyle = (theme: MD3Theme = dark) =>
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

export const alarmListStyle = (theme: MD3Theme = dark) =>
	StyleSheet.create({
		emptyTextWrapper: {
			display: "flex",
			flex: 1,
			justifyContent: "center",
			height: deviceHeight * 0.7,
		},
		emptyText: {
			color: theme.colors.error,
		},
	});

export const alarmListItemStyle = (theme: MD3Theme = dark) =>
	StyleSheet.create({
		container: {
			width: deviceWidth * 0.88,
			marginBottom: 24,
			marginHorizontal: 16,
			padding: 16,
			borderRadius: theme.roundness,
		},
		titleText: {
			fontWeight: "bold",
			fontSize: 18,
			color: theme.colors.secondary,
		},
		detailsContainer: {
			marginVertical: 8,
		},
		locationContainer: {
			flexDirection: "row",
			marginBottom: 4,
		},
		divider: {
			marginVertical: 8,
		},
		buttonsContainer: {
			flexDirection: "row",
			justifyContent: "space-between",
		},
		deleteButton: {
			color: theme.colors.error,
		},
	});
