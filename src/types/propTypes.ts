import { AlarmItemType } from "./stateTypes";

export type MapViewPropsType = {};

export type createEditAlarmPropsType = {
	closeModal: Function;
	isEdit?: boolean;
	currentAlarm?: AlarmItemType;
};

export type AlarmListItemPropsType = {
	alarm: AlarmItemType;
};
