import BackgroundService from "react-native-background-actions";
import * as Location from "expo-location";

import { getDistanceBetween2LatsLongsInMeters } from "./utils";

const sleep = (time) =>
	new Promise((resolve) => setTimeout(() => resolve(), time));

// You can do anything in your task such as network requests, timers and so on,
// as long as it doesn't touch UI. Once your task completes (i.e. the promise is resolved),
// React Native will go into "paused" mode (unless there are other tasks running,
// or there is a foreground app).
const triggerAlarm = async (params) => {
	const { delay, alarm } = params;
	await new Promise(async (resolve) => {
		do {
			await sleep(delay);
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
			console.log("service is running", {
				distance,
				alarm,
				time: new Date(),
			});
			if (distance <= radius) {
				console.log("destination reached", { distance, alarm });
				await BackgroundService.updateNotification({
					taskDesc: "done",
				});
				await BackgroundService.stop();
				resolve();
			}
		} while (BackgroundService.isRunning());
	});
};

export const triggerGPSPolling = async (alarms) => {
	const options = (alarm) => ({
		taskName: "Geo Alarm",
		taskTitle: "Geo Alarm",
		taskDesc: alarm.title,
		taskIcon: {
			name: "ic_launcher",
			type: "mipmap",
		},
		color: "grey",
		// linkingURI: "yourSchemeHere://chat/jane", // See Deep Linking for more info
		parameters: {
			delay: 5000,
			alarm,
		},
	});
	alarms.map(async (alarm) => {
		if (alarm.active) {
			console.log("starting", { alarm });
			await BackgroundService.start(triggerAlarm, options(alarm));
			await BackgroundService.updateNotification({
				taskDesc: alarm.title,
			}); // Only Android, iOS will ignore this call
		}
	});
};
