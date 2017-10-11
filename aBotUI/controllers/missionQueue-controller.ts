import * as Express from "express";
import { default as MissionQueue, IMissionQueueModel } from "../models/mission-queue-model";
import * as MissionQueueService from "../services/mission-queue-service";

export class Controller {
    private req: Express.Request;
    private res: Express.Response;
    constructor(req: Express.Request, res: Express.Response) {
        this.req = req;
        this.res = res;
    }
    public status() {
        const missionQueueService = new MissionQueueService.Service();
        missionQueueService.getStatus().then((status) => {
            this.res.json(status);
        }, (err) => {
            this.res.json(err);
        });
    }
}
