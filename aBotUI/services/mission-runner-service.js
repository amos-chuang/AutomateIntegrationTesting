"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bluebird = require("bluebird");
const MissionSlotService = require("./mission-slot-service");
const MissionQueueService = require("./mission-queue-service");
const MissionService = require("./mission-service");
const rmrf = require("rimraf");
const fs = require("fs");
class Service {
    run() {
        return new Bluebird((resolve, reject) => {
            console.log("task runner run ... " + new Date());
            const slotService = new MissionSlotService.Service();
            const queueService = new MissionQueueService.Service();
            const missionService = new MissionService.Service();
            let currentMission;
            Bluebird.try(() => {
                return slotService.isMissionSlotHasSapce();
            }).then((isSlotHasSpace) => {
                console.log("isMissionSlotHasSapce result : " + isSlotHasSpace);
                if (isSlotHasSpace) {
                    return queueService.pop();
                }
                else {
                    return Bluebird.reject("mission slot has no space");
                }
            }).then((mission) => {
                if (mission) {
                    console.log("insert into slot");
                    currentMission = mission;
                    return slotService.insert(mission.id);
                }
                else {
                    return Bluebird.reject("has no mission in queue");
                }
            }).then((slot) => {
                console.log("execute mission");
                return missionService.executeMission(slot);
            }).catch((ex) => {
                console.log("task runner service : " + ex);
            }).finally(() => {
                if (currentMission) {
                    const currentMissionDirPath = "./mission/" + currentMission.id + "/";
                    if (fs.existsSync(currentMissionDirPath)) {
                        console.log("rmrf mission dir : " + currentMissionDirPath);
                        rmrf(currentMissionDirPath, (err) => { });
                    }
                }
            });
        });
    }
}
exports.Service = Service;
//# sourceMappingURL=mission-runner-service.js.map