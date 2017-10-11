"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MissionSlotService = require("../services/mission-slot-service");
class Controller {
    constructor(req, res) {
        this.req = req;
        this.res = res;
    }
    status() {
        const missionSlotService = new MissionSlotService.Service();
        missionSlotService.getStatus().then((status) => {
            this.res.json(status);
        }, (err) => {
            this.res.json(err);
        });
    }
}
exports.Controller = Controller;
//# sourceMappingURL=missionSlot-controller.js.map