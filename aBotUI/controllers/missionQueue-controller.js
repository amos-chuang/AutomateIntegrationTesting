"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MissionQueueService = require("../services/mission-queue-service");
class Controller {
    constructor(req, res) {
        this.req = req;
        this.res = res;
    }
    status() {
        const missionQueueService = new MissionQueueService.Service();
        missionQueueService.getStatus().then((status) => {
            this.res.json(status);
        }, (err) => {
            this.res.json(err);
        });
    }
}
exports.Controller = Controller;
//# sourceMappingURL=missionQueue-controller.js.map