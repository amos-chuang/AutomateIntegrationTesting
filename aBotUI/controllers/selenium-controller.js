"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bluebird = require("bluebird");
const SeleniumService = require("../services/selenium-service");
const mission_model_1 = require("../models/mission-model");
const collection_model_1 = require("../models/collection-model");
const task_model_1 = require("../models/task-model");
const collection_step_model_1 = require("../models/collection-step-model");
const mission_queue_model_1 = require("../models/mission-queue-model");
class Controller {
    constructor(req, res) {
        this.req = req;
        this.res = res;
    }
    run() {
        let mission;
        let collection;
        let step;
        let task;
        mission_queue_model_1.default.find({}).then((qs) => {
            return Bluebird.resolve(qs[0].missionID);
        }).then((missionID) => {
            return mission_model_1.default.findById(missionID).then();
        }).then((m) => {
            mission = m;
            return collection_model_1.default.findById(mission.collectionID).then();
        }).then((c) => {
            collection = c;
            return collection_step_model_1.default.findOne({ collectionID: collection.id }).then();
        }).then((s) => {
            step = s;
            return task_model_1.default.findById(step.taskID).then();
        }).then((t) => {
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
exports.Controller = Controller;
//# sourceMappingURL=selenium-controller.js.map