import { StyleSheet, Dimensions } from "react-native";
import { MD3Theme } from "react-native-paper";

import { dark } from "./paperTheme";

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

export const appStyle = (theme: MD3Theme = dark) =>
	StyleSheet.create({
		app: {
			flex: 1,
			paddingTop: 24,
			backgroundColor: theme.colors.background,
		},
		appBar: {
			marginTop: 8,
			paddingHorizontal: 8,
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
			bottom: "2%",
		},
		errorText: {
			color: theme.colors.error,
			textAlign: "center",
		},
	});

export const mapStyle = (theme: MD3Theme = dark) =>
	StyleSheet.create({
		modalContainer: {
			justifyContent: "center",
			alignItems: "center",
		},
		container: {
			height: deviceHeight * 0.96,
			width: deviceWidth * 0.96,
			backgroundColor: theme.colors.background,
			alignItems: "center",
			justifyContent: "center",
			padding: 8,
			borderRadius: theme.roundness,
		},
		webView: {
			flex: 1,
			width: deviceWidth * 0.92,
		},
		detailsContainer: {
			flex: 0.16,
			backgroundColor: theme.colors.background,
			justifyContent: "center",
			alignItems: "center",
			width: "100%",
			padding: 8,
		},
		buttonsContainer: {
			backgroundColor: theme.colors.background,
			flexDirection: "row",
			justifyContent: "space-around",
			width: "100%",
			paddingTop: 16,
			paddingBottom: 8,
		},
		buttonLabel: {
			padding: 2,
			fontWeight: "bold",
			textTransform: "uppercase",
		},
		hintText: {
			color: theme.colors.primary,
			fontSize: 12,
			marginHorizontal: 2,
			textAlign: "justify",
		},
		coordinatesContainer: {
			borderRadius: theme.roundness,
			paddingHorizontal: 16,
			paddingVertical: 8,
			marginVertical: 8,
			minWidth: "88%",
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
		container: {
			width: deviceWidth * 0.96,
		},
		emptyTextWrapper: {
			display: "flex",
			flex: 1,
			justifyContent: "center",
			alignItems: "center",
			height: deviceHeight * 0.5,
		},
		emptyText: {
			color: theme.colors.error,
		},
		banner: {
			marginBottom: 24,
			marginTop: 8,
			paddingTop: 4,
			paddingBottom: 16,
			paddingHorizontal: 2,
			backgroundColor: theme.colors.errorContainer,
			borderRadius: theme.roundness * 0.4,
		},
		bannerContent: {
			marginTop: -16,
			marginLeft: -16,
			marginBottom: -16,
		},
		bannerText: {
			color: theme.colors.onBackground,
			textAlign: "justify",
			fontStyle: "italic",
		},
	});

export const alarmListItemStyle = (theme: MD3Theme = dark) =>
	StyleSheet.create({
		container: {
			marginBottom: 16,
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
