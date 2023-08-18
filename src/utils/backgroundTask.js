import { Vibration } from "react-native";
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
	const { delay, alarm, alarms, setAlarms } = params;
	await new Promise(async () => {
		this.active = true;
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
			console.log("service is running", {
				distance,
				alarm,
				time: new Date(),
			});

			if (distance <= radius) {
				console.log("destination reached", { distance, alarm });

				for (let i = 0; i < 80; i++) {
					Vibration.vibrate();
				}

				await BackgroundService.updateNotification({
					taskDesc: `Reached ${alarm.title}`,
				});
				setAlarms(
					alarms.map((_alarm) =>
						_alarm.id === alarm.id ? { ...alarm, active: false } : alarm
					)
				);
				this.active = false;
				// BackgroundService.stop().then(() => console.log("stopped"));
			}
			await sleep(delay);
		} while (BackgroundService.isRunning() && this.active);
	});
};

export const triggerGPSPolling = async (alarms, setAlarms, theme) => {
	const options = (alarm) => ({
		taskName: "Geo Alarm",
		taskTitle: "Geo Alarm",
		taskDesc: alarm.title,
		taskIcon: {
			name: "ic_launcher",
			type: "mipmap",
		},
		color: theme.colors.primaryContainer,
		linkingURI: `geoAlarm://alarm?id=${alarm.id}`,
		parameters: {
			delay: 5000,
			alarm,
			alarms,
			setAlarms,
		},
	});
	alarms.forEach(async (alarm) => {
		if (alarm.active) {
			console.log("starting", { alarm });
			await BackgroundService.start(triggerAlarm, options(alarm));
			await BackgroundService.updateNotification({
				taskDesc: alarm.title,
			}); // Only Android, iOS will ignore this call
		}
	});
};
