import { AlarmItemType } from "./stateTypes";

export type MapViewPropsType = {};

export type createEditAlarmPropsType = {
	closeModal: Function;
	isEdit?: Boolean;
	currentAlarm?: AlarmItemType;
};

export type AlarmListItemPropsType = {
	alarm: AlarmItemType;
};
