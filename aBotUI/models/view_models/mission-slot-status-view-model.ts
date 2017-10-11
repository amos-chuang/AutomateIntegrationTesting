export interface IMissionSlotStatusViewModel {
    capacity: number;
    size: number;
    slots: {
        missionID: string;
    }[];
    delta: number[];
}
