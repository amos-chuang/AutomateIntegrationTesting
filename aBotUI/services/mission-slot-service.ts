import * as Bluebird from "bluebird";
import { default as Task, ITaskModel } from "../models/task-model";
import { default as Mission, IMissionModel } from "../models/mission-model";
import { default as MissionQueue, IMissionQueueModel } from "../models/mission-queue-model";
import { default as MissionSlot, IMissionSlotModel } from "../models/mission-slot-model";
import { default as Config, IConfigModel, ConfigKey } from "../models/config-model";
import { IMissionSlotStatusViewModel } from "../models/view_models/mission-slot-status-view-model";
import { BaseService } from "./base-service";
import * as StatisticsService from "./statistics-service";

export class Service {
    public isMissionSlotHasSapce() {
        return new Bluebird<boolean>((resolve, reject) => {
            let maxSlot = 0;
            const baseService = new BaseService();
            baseService.getConfig(ConfigKey.MaxMissionSlot).then<IMissionSlotModel[]>(
                (value: string) => {
                    if (value) {
                        maxSlot = parseInt(value, 10);
                        return MissionSlot.find({}).then<IMissionSlotModel[]>();
                    } else {
                        return Bluebird.reject("can't find config[MaxMissionSlot]");
                    }
                },
                (err: any) => Bluebird.reject(err)).then(
                (msList: IMissionSlotModel[]) => {
                    if (msList.length < maxSlot) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                },
                (err: any) => { reject(err); });
        });
    }
    public insert(missionID: string) {
        return new Bluebird<IMissionSlotModel>((resolve, reject) => {
            Mission.findById(missionID).then(
                (mission: IMissionModel) => {
                    if (mission) {
                        const slot = new MissionSlot();
                        slot.missionID = mission.id as string;
                        slot.status = "waiting for execute";
                        slot.save().then(
                            (currentSlot) => {
                                resolve(currentSlot);
                            },
                            (err) => { reject(err); });
                    } else {
                        reject("mission-slot-service can't find MissionID : " + missionID);
                    }
                },
                (err) => { reject(err); });
        });
    }
    public remove(slotID: string) {
        return new Bluebird((resolve, reject) => {
            MissionSlot.findById(slotID).then(
                (slot) => {
                    if (slot) {
                        slot.remove().then(
                            (removedSlot) => { resolve(removedSlot); },
                            (err) => { reject(err); });
                    } else {
                        resolve({} as IMissionSlotModel);
                    }
                },
                (err) => { reject(err); });
        });
    }
    public getStatus() {
        return new Bluebird<IMissionSlotStatusViewModel>((resolve, reject) => {
            let maxSlot = 0;
            const status = {} as IMissionSlotStatusViewModel;
            const baseService = new BaseService();
            baseService.getConfig(ConfigKey.MaxMissionSlot).then(
                (configValue) => {
                    if (configValue) {
                        maxSlot = parseInt(configValue, 10);
                    }
                    return MissionSlot.find({});
                }, (err: any) => Bluebird.reject(err)).then(
                (slotList: IMissionSlotModel[]) => {
                    status.capacity = maxSlot;
                    status.slots = [];
                    if (slotList) {
                        status.size = slotList.length;
                        slotList.forEach((slot) => {
                            status.slots.push(slot);
                        });
                    } else {
                        status.size = 0;
                    }
                    const statisticsService = new StatisticsService.Service();
                    return statisticsService.queryMissionSlotStatus();
                },
                (err) => { reject(err); }).then(
                (data: number[]) => {
                    if (data) {
                        status.delta = data;
                    }
                    resolve(status);
                },
                (err) => { reject(err); });
        });
    }
}
