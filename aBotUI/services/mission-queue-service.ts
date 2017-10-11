import * as Bluebird from "bluebird";
import { default as Task, ITaskModel } from "../models/task-model";
import { default as Mission, IMissionModel } from "../models/mission-model";
import { default as MissionQueue, IMissionQueueModel } from "../models/mission-queue-model";
import { IMissionQueueStatusViewModel } from "../models/view_models/mission-queue-status-view-model";
import * as StatisticsService from "./statistics-service";

export class Service {
    public push(missionID: string) {
        return new Bluebird<IMissionQueueModel>((resolve, reject) => {
            Mission.findById(missionID).then((mission) => {
                if (mission) {
                    const missionQueue = new MissionQueue();
                    missionQueue.missionID = mission.id;
                    missionQueue.save().then((mq) => {
                        resolve(mq);
                    }, (err) => { reject(err); });
                } else {
                    reject("can't find mission for MissionID = " + missionID);
                }
            }, (err) => { reject(err); });
        });
    }
    public pop() {
        return new Bluebird<IMissionQueueModel>((resolve, reject) => {
            MissionQueue.find({}).sort("createdAt").then((mqList) => {
                if (mqList && mqList.length > 0) {
                    const mq = mqList[0];
                    Mission.findById(mq.missionID as string).then(
                        (mission: IMissionModel) => {
                            if (mission) {
                                mq.remove().then(() => { resolve(mission); }, (err) => { reject(err); });
                            }
                        },
                        (err) => { reject(err); });
                } else {
                    resolve(undefined);
                }
            }, (err) => { reject(err); });
        });
    }
    public popTaskMission() {
        return new Bluebird<IMissionModel>((resolve, reject) => {
            let currentMq: IMissionQueueModel;
            MissionQueue.find({}).sort("createdAt").then(
                (mqList: IMissionQueueModel[]) => {
                    if (mqList && mqList.length > 0) {
                        currentMq = mqList[0];
                        Mission.findById(currentMq.missionID as string).then(
                            (mission: IMissionModel) => {
                                if (!mission.collectionID && mission.taskID) {
                                    currentMq.remove().then(
                                        () => { resolve(mission); },
                                        (err) => { reject(err); });
                                }
                            },
                            (err) => { reject(err); });
                    } else {
                        reject("mission-queue-service can't find task mission in queue");
                    }
                }, (err) => { reject(err); });
        });
    }
    public popCollectionMission() {
        return new Bluebird<IMissionModel>((resolve, reject) => {
            let currentMq: IMissionQueueModel;
            MissionQueue.find({}).sort("createdAt").then(
                (mqList: IMissionQueueModel[]) => {
                    if (mqList && mqList.length > 0) {
                        currentMq = mqList[0];
                        Mission.findById(currentMq.missionID as string).then(
                            (mission: IMissionModel) => {
                                if (mission.collectionID && !mission.taskID) {
                                    currentMq.remove().then(
                                        () => { resolve(mission); },
                                        (err) => { reject(err); });
                                }
                            },
                            (err) => { reject(err); });
                    } else {
                        reject("mission-queue-service can't find collection mission in queue");
                    }
                }, (err) => { reject(err); });
        });
    }
    public getStatus() {
        return new Bluebird<IMissionQueueStatusViewModel>((resolve, reject) => {
            const status = {} as IMissionQueueStatusViewModel;
            MissionQueue.find({}).then((mqList) => {
                if (mqList) {
                    status.size = mqList.length;
                } else {
                    status.size = 0;
                }
                const statisticsService = new StatisticsService.Service();
                return statisticsService.queryMissionQueueStatus();
            }, (err) => { reject(err); }).then(
                (dataList: number[]) => {
                    if (dataList) {
                        status.delta = dataList;
                    }
                    resolve(status);
                },
                (err) => { reject(err); });
        });
    }
}
