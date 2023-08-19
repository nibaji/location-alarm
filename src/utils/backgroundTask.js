import { Vibration } from "react-native";
import BackgroundService from "react-native-background-actions";
import * as Location from "expo-location";

import {
	getDistanceBetween2LatsLongsInMeters,
	shouldKillBgServices,
	triggerVibrationAndSound,
} from "./utils";

const sleep = (time) =>
	new Promise((resolve) => setTimeout(() => resolve(), time));

// You can do anything in your task such as network requests, timers and so on,
// as long as it doesn't touch UI. Once your task completes (i.e. the promise is resolved),
// React Native will go into "paused" mode (unless there are other tasks running,
// or there is a foreground app).
const triggerAlarm = async (params) => {
	const { delay, alarm, editAlarm } = params;
	let isTriggered;
	await new Promise(async () => {
		do {
			const {
				radius,
				location: { latitude, longitude },
			} = alarm;
			const userLocationObj = await Location.getCurrentPositionAsync({});
			const userLatitude = userLocationObj.coords.latitude;
			const userLongitude = userLocationObj.coords.longitude;
			const distance = getDistanceBetween2LatsLongsInMeters(
				userLatitude,
				userLongitude,
				latitude,
				longitude
			);

			if (distance <= radius) {
				await triggerVibrationAndSound(editAlarm, alarm);
				isTriggered = true;
			}
			await sleep(delay);
		} while ((BackgroundService.isRunning(), !isTriggered));
	});
};

export const triggerGPSPolling = async (alarms, editAlarm, theme) => {
	const options = (alarm) => ({
		taskName: "Geo Alarm",
		taskTitle: "Geo Alarm",
		taskDesc: `${alarm.title} is on`,
		taskIcon: {
			name: "ic_launcher",
			type: "mipmap",
		},
		color: theme?.colors.primaryContainer ?? "cyan",
		linkingURI: `geoAlarm://alarm?id=${alarm.id}`,
		parameters: {
			delay: 5000,
			alarm,
			editAlarm,
		},
	});
	Object.values(alarms || {}).forEach(async (alarm) => {
		if (alarm.active) {
			await BackgroundService.start(triggerAlarm, options(alarm));
			await BackgroundService.updateNotification({
				taskDesc: alarm.title,
			}); // Only Android, iOS will ignore this call
		}
	});

	if (shouldKillBgServices(alarms)) {
		await BackgroundService.stop();
	}
};
