"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bluebird = require("bluebird");
const mission_model_1 = require("../models/mission-model");
const mission_slot_model_1 = require("../models/mission-slot-model");
const config_model_1 = require("../models/config-model");
const base_service_1 = require("./base-service");
const StatisticsService = require("./statistics-service");
class Service {
    isMissionSlotHasSapce() {
        return new Bluebird((resolve, reject) => {
            let maxSlot = 0;
            const baseService = new base_service_1.BaseService();
            baseService.getConfig(config_model_1.ConfigKey.MaxMissionSlot).then((value) => {
                if (value) {
                    maxSlot = parseInt(value, 10);
                    return mission_slot_model_1.default.find({}).then();
                }
                else {
                    return Bluebird.reject("can't find config[MaxMissionSlot]");
                }
            }, (err) => Bluebird.reject(err)).then((msList) => {
                if (msList.length < maxSlot) {
                    resolve(true);
                }
                else {
                    resolve(false);
                }
            }, (err) => { reject(err); });
        });
    }
    insert(missionID) {
        return new Bluebird((resolve, reject) => {
            mission_model_1.default.findById(missionID).then((mission) => {
                if (mission) {
                    const slot = new mission_slot_model_1.default();
                    slot.missionID = mission.id;
                    slot.status = "waiting for execute";
                    slot.save().then((currentSlot) => {
                        resolve(currentSlot);
                    }, (err) => { reject(err); });
                }
                else {
                    reject("mission-slot-service can't find MissionID : " + missionID);
                }
            }, (err) => { reject(err); });
        });
    }
    remove(slotID) {
        return new Bluebird((resolve, reject) => {
            mission_slot_model_1.default.findById(slotID).then((slot) => {
                if (slot) {
                    slot.remove().then((removedSlot) => { resolve(removedSlot); }, (err) => { reject(err); });
                }
                else {
                    resolve({});
                }
            }, (err) => { reject(err); });
        });
    }
    getStatus() {
        return new Bluebird((resolve, reject) => {
            let maxSlot = 0;
            const status = {};
            const baseService = new base_service_1.BaseService();
            baseService.getConfig(config_model_1.ConfigKey.MaxMissionSlot).then((configValue) => {
                if (configValue) {
                    maxSlot = parseInt(configValue, 10);
                }
                return mission_slot_model_1.default.find({});
            }, (err) => Bluebird.reject(err)).then((slotList) => {
                status.capacity = maxSlot;
                status.slots = [];
                if (slotList) {
                    status.size = slotList.length;
                    slotList.forEach((slot) => {
                        status.slots.push(slot);
                    });
                }
                else {
                    status.size = 0;
                }
                const statisticsService = new StatisticsService.Service();
                return statisticsService.queryMissionSlotStatus();
            }, (err) => { reject(err); }).then((data) => {
                if (data) {
                    status.delta = data;
                }
                resolve(status);
            }, (err) => { reject(err); });
        });
    }
}
exports.Service = Service;
//# sourceMappingURL=mission-slot-service.js.map