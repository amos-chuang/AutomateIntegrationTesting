import * as Bluebird from "bluebird";
import { default as Statistics, IStatisticsModel } from "../models/statistics-model";
import * as MissionSlotService from "./mission-slot-service";
import * as MissionQueueService from "./mission-queue-service";

export class Service {
    public rotateRecord() {
        return this.rotateRecordKeepDays(5);
    }
    public rotateRecordKeepDays(keepDays: number) {
        return new Bluebird((resolve, reject) => {
            const diff = keepDays * 24 * 60 * 60 * 1000;
            const date = new Date() as any - diff;
            Statistics.remove({ createdAt: { $lt: date } }).then(() => {
                resolve();
            }).catch((err) => {
                reject(err);
            });
        });
    }
    public recordMissionSlotStatus() {
        return new Bluebird((resolve, reject) => {
            const missionSlotService = new MissionSlotService.Service();
            missionSlotService.getStatus().then((status) => {
                const missionSlotSizeStatistics = new Statistics();
                missionSlotSizeStatistics.type = "MissionSlotSize";
                missionSlotSizeStatistics.value = status.size;
                missionSlotSizeStatistics.save();
                resolve();
            });
        });
    }
    public queryMissionSlotStatus() {
        return new Bluebird<number[]>((resolve, reject) => {
            Statistics.find({ type: "MissionSlotSize" }).sort({ createdAt: -1 }).limit(20).then(
                (dataList) => {
                    const result = [] as number[];
                    if (dataList && dataList.length > 0) {
                        dataList.forEach((x) => {
                            result.unshift(x.value);
                        });
                    }
                    resolve(result);
                },
                (err) => { reject(err); });
        });
    }
    public recordMissionQueueStatus() {
        return new Bluebird((resolve, reject) => {
            const missionQueueService = new MissionQueueService.Service();
            missionQueueService.getStatus().then((status) => {
                const missionQueueSizeStatistics = new Statistics();
                missionQueueSizeStatistics.type = "MissionQueueSize";
                missionQueueSizeStatistics.value = status.size;
                missionQueueSizeStatistics.save();
                resolve();
            });
        });
    }
    public queryMissionQueueStatus() {
        return new Bluebird<number[]>((resolve, reject) => {
            Statistics.find({ type: "MissionQueueSize" }).sort({ createdAt: -1 }).limit(20).then(
                (dataList) => {
                    const result = [] as number[];
                    if (dataList && dataList.length > 0) {
                        dataList.forEach((x) => {
                            result.unshift(x.value);
                        });
                    }
                    resolve(result);
                },
                (err) => { reject(err); });
        });
    }
}
