"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bluebird = require("bluebird");
const mission_model_1 = require("../models/mission-model");
const mission_queue_model_1 = require("../models/mission-queue-model");
const StatisticsService = require("./statistics-service");
class Service {
    push(missionID) {
        return new Bluebird((resolve, reject) => {
            mission_model_1.default.findById(missionID).then((mission) => {
                if (mission) {
                    const missionQueue = new mission_queue_model_1.default();
                    missionQueue.missionID = mission.id;
                    missionQueue.save().then((mq) => {
                        resolve(mq);
                    }, (err) => { reject(err); });
                }
                else {
                    reject("can't find mission for MissionID = " + missionID);
                }
            }, (err) => { reject(err); });
        });
    }
    pop() {
        return new Bluebird((resolve, reject) => {
            mission_queue_model_1.default.find({}).sort("createdAt").then((mqList) => {
                if (mqList && mqList.length > 0) {
                    const mq = mqList[0];
                    mission_model_1.default.findById(mq.missionID).then((mission) => {
                        if (mission) {
                            mq.remove().then(() => { resolve(mission); }, (err) => { reject(err); });
                        }
                    }, (err) => { reject(err); });
                }
                else {
                    resolve(undefined);
                }
            }, (err) => { reject(err); });
        });
    }
    popTaskMission() {
        return new Bluebird((resolve, reject) => {
            let currentMq;
            mission_queue_model_1.default.find({}).sort("createdAt").then((mqList) => {
                if (mqList && mqList.length > 0) {
                    currentMq = mqList[0];
                    mission_model_1.default.findById(currentMq.missionID).then((mission) => {
                        if (!mission.collectionID && mission.taskID) {
                            currentMq.remove().then(() => { resolve(mission); }, (err) => { reject(err); });
                        }
                    }, (err) => { reject(err); });
                }
                else {
                    reject("mission-queue-service can't find task mission in queue");
                }
            }, (err) => { reject(err); });
        });
    }
    popCollectionMission() {
        return new Bluebird((resolve, reject) => {
            let currentMq;
            mission_queue_model_1.default.find({}).sort("createdAt").then((mqList) => {
                if (mqList && mqList.length > 0) {
                    currentMq = mqList[0];
                    mission_model_1.default.findById(currentMq.missionID).then((mission) => {
                        if (mission.collectionID && !mission.taskID) {
                            currentMq.remove().then(() => { resolve(mission); }, (err) => { reject(err); });
                        }
                    }, (err) => { reject(err); });
                }
                else {
                    reject("mission-queue-service can't find collection mission in queue");
                }
            }, (err) => { reject(err); });
        });
    }
    getStatus() {
        return new Bluebird((resolve, reject) => {
            const status = {};
            mission_queue_model_1.default.find({}).then((mqList) => {
                if (mqList) {
                    status.size = mqList.length;
                }
                else {
                    status.size = 0;
                }
                const statisticsService = new StatisticsService.Service();
                return statisticsService.queryMissionQueueStatus();
            }, (err) => { reject(err); }).then((dataList) => {
                if (dataList) {
                    status.delta = dataList;
                }
                resolve(status);
            }, (err) => { reject(err); });
        });
    }
}
exports.Service = Service;
//# sourceMappingURL=mission-queue-service.js.map