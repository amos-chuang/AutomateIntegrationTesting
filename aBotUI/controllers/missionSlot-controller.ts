import * as Express from "express";
import { default as MissionQueue, IMissionQueueModel } from "../models/mission-queue-model";
import * as MissionSlotService from "../services/mission-slot-service";

export class Controller {
    private req: Express.Request;
    private res: Express.Response;
    constructor(req: Express.Request, res: Express.Response) {
        this.req = req;
        this.res = res;
    }
    public status() {
        const missionSlotService = new MissionSlotService.Service();
        missionSlotService.getStatus().then((status) => {
            this.res.json(status);
        }, (err) => {
            this.res.json(err);
        });
    }
}
