"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const StatisticsService = require("../services/statistics-service");
class Controller {
    constructor(req, res) {
        this.req = req;
        this.res = res;
    }
    rotate() {
        let keepDays = 5;
        if (this.req.body.keepDays) {
            keepDays = this.req.body.keepDays;
        }
        const statisticsService = new StatisticsService.Service();
        statisticsService.rotateRecordKeepDays(keepDays).then(() => {
            this.res.json({ status: "OK" });
        }, (err) => {
            this.res.json({ status: "ERROR", errorMsg: err });
        });
    }
}
exports.Controller = Controller;
//# sourceMappingURL=statistics-controller.js.map