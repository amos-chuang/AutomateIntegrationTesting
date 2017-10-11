import * as Bluebird from "bluebird";
import { default as Task, ITaskModel } from "../models/task-model";
import { default as Mission, IMissionModel } from "../models/mission-model";
import { default as MissionQueue, IMissionQueueModel } from "../models/mission-queue-model";
import { default as MissionSlot, IMissionSlotModel } from "../models/mission-slot-model";
import { default as Config, IConfigModel, ConfigKey } from "../models/config-model";
import { BaseService } from "./base-service";
import * as MissionSlotService from "./mission-slot-service";
import * as MissionQueueService from "./mission-queue-service";
import * as MissionService from "./mission-service";
import * as rmrf from "rimraf";
import * as fs from "fs";

export class Service {
    public run() {
        return new Bluebird((resolve, reject) => {
            console.log("task runner run ... " + new Date());
            const slotService = new MissionSlotService.Service();
            const queueService = new MissionQueueService.Service();
            const missionService = new MissionService.Service();
            let currentMission: IMissionModel;
            Bluebird.try(() => {
                return slotService.isMissionSlotHasSapce();
            }).then((isSlotHasSpace) => {
                console.log("isMissionSlotHasSapce result : " + isSlotHasSpace);
                if (isSlotHasSpace) {
                    return queueService.pop();
                } else {
                    return Bluebird.reject("mission slot has no space");
                }
            }).then((mission) => {
                if (mission) {
                    console.log("insert into slot");
                    currentMission = mission;
                    return slotService.insert(mission.id as string);
                } else {
                    return Bluebird.reject("has no mission in queue");
                }
            }).then((slot: IMissionSlotModel) => {
                console.log("execute mission");
                return missionService.executeMission(slot);
            }).catch((ex) => {
                console.log("task runner service : " + ex);
            }).finally(() => {
                if (currentMission) {
                    const currentMissionDirPath = "./mission/" + currentMission.id + "/";
                    if (fs.existsSync(currentMissionDirPath)) {
                        console.log("rmrf mission dir : " + currentMissionDirPath);
                        rmrf(currentMissionDirPath, (err: any) => { });
                    }
                }
            });
        });
    }
}
