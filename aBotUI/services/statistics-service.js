"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bluebird = require("bluebird");
const statistics_model_1 = require("../models/statistics-model");
const MissionSlotService = require("./mission-slot-service");
const MissionQueueService = require("./mission-queue-service");
class Service {
    rotateRecord() {
        return this.rotateRecordKeepDays(5);
    }
    rotateRecordKeepDays(keepDays) {
        return new Bluebird((resolve, reject) => {
            const diff = keepDays * 24 * 60 * 60 * 1000;
            const date = new Date() - diff;
            statistics_model_1.default.remove({ createdAt: { $lt: date } }).then(() => {
                resolve();
            }).catch((err) => {
                reject(err);
            });
        });
    }
    recordMissionSlotStatus() {
        return new Bluebird((resolve, reject) => {
            const missionSlotService = new MissionSlotService.Service();
            missionSlotService.getStatus().then((status) => {
                const missionSlotSizeStatistics = new statistics_model_1.default();
                missionSlotSizeStatistics.type = "MissionSlotSize";
                missionSlotSizeStatistics.value = status.size;
                missionSlotSizeStatistics.save();
                resolve();
            });
        });
    }
    queryMissionSlotStatus() {
        return new Bluebird((resolve, reject) => {
            statistics_model_1.default.find({ type: "MissionSlotSize" }).sort({ createdAt: -1 }).limit(20).then((dataList) => {
                const result = [];
                if (dataList && dataList.length > 0) {
                    dataList.forEach((x) => {
                        result.unshift(x.value);
                    });
                }
                resolve(result);
            }, (err) => { reject(err); });
        });
    }
    recordMissionQueueStatus() {
        return new Bluebird((resolve, reject) => {
            const missionQueueService = new MissionQueueService.Service();
            missionQueueService.getStatus().then((status) => {
                const missionQueueSizeStatistics = new statistics_model_1.default();
                missionQueueSizeStatistics.type = "MissionQueueSize";
                missionQueueSizeStatistics.value = status.size;
                missionQueueSizeStatistics.save();
                resolve();
            });
        });
    }
    queryMissionQueueStatus() {
        return new Bluebird((resolve, reject) => {
            statistics_model_1.default.find({ type: "MissionQueueSize" }).sort({ createdAt: -1 }).limit(20).then((dataList) => {
                const result = [];
                if (dataList && dataList.length > 0) {
                    dataList.forEach((x) => {
                        result.unshift(x.value);
                    });
                }
                resolve(result);
            }, (err) => { reject(err); });
        });
    }
}
exports.Service = Service;
//# sourceMappingURL=statistics-service.js.map