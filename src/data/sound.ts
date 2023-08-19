import Sound from "react-native-sound";

import alarmSound from "../../assets/sounds/clock-alarm-8761-pixabay.mp3";

export const alarm1 = {
	sound: new Sound(alarmSound, (error) => {
		if (error) {
			console.log("failed to load the sound", error);
			return;
		}
	}),
	play() {
		this.sound.play();
		const duration = this.sound.getDuration();
		const timesToPlay = Math.floor(60 / duration);
		this.sound.setNumberOfLoops(timesToPlay);
	},
	stopAlarm() {
		this.sound.stop(() => {
			// this.sound.release();
		});
	},
};
