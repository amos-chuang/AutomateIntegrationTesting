import * as Express from "express";
import * as Bluebird from "bluebird";
import * as SeleniumService from "../services/selenium-service";
import { default as Mission, IMissionModel } from "../models/mission-model";
import { default as Collection, ICollectionModel } from "../models/collection-model";
import { default as Task, ITaskModel } from "../models/task-model";
import { default as CollectionStep, ICollectionStepModel } from "../models/collection-step-model";
import { default as MissionQueue, IMissionQueueModel } from "../models/mission-queue-model";

export class Controller {
    private req: Express.Request;
    private res: Express.Response;
    constructor(req: Express.Request, res: Express.Response) {
        this.req = req;
        this.res = res;
    }
    public run() {
        let mission: IMissionModel;
        let collection: ICollectionModel;
        let step: ICollectionStepModel;
        let task: ITaskModel;
        MissionQueue.find({}).then((qs) => {
            return Bluebird.resolve(qs[0].missionID);
        }).then((missionID) => {
            return Mission.findById(missionID as string).then();
        }).then((m: IMissionModel) => {
            mission = m;
            return Collection.findById(mission.collectionID as string).then();
        }).then((c: ICollectionModel) => {
            collection = c;
            return CollectionStep.findOne({ collectionID: collection.id }).then();
        }).then((s: ICollectionStepModel) => {
            step = s;
            return Task.findById(step.taskID as string).then();
        }).then((t: ITaskModel) => {
            task = t;
            const ss = new SeleniumService.Service();
            return ss.run(mission, task, step.seq);
        }).then(() => {
            this.res.json({ status: "DONE" });
        }).catch((err) => {
            this.res.json({ status: err });
        });
    }
}
