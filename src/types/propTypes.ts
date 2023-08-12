import { AlarmItemType } from "./stateTypes";

export type MapViewPropsType = {};

export type LocationInputType = {
	closeModal: Function;
	isEdit?: Boolean;
	currentAlarm?: AlarmItemType;
};

export type AlarmListItemType = {
	alarm: AlarmItemType;
};
