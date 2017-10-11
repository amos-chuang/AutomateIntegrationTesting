"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MissionRunnerService = require("../services/mission-runner-service");
class Controller {
    constructor(req, res) {
        this.req = req;
        this.res = res;
    }
    run() {
        const mrs = new MissionRunnerService.Service();
        mrs.run().then(() => { });
        this.res.json({
            status: "run",
        });
    }
}
exports.Controller = Controller;
//# sourceMappingURL=missionRunner-controller.js.map