"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MissionReportService = require("../services/mission-report-service");
const MissionService = require("../services/mission-service");
class Controller {
    constructor(req, res) {
        this.req = req;
        this.res = res;
    }
    index() {
        this.res.render("mission-index");
    }
    report() {
        this.res.render("mission-report");
    }
    query() {
        const missionService = new MissionService.Service();
        missionService.query(this.req).then((data) => {
            this.res.json(data);
        }).catch((err) => {
            this.res.json(err);
        });
    }
    getReport() {
        let missionID = this.req.query.missionID;
        if (this.req.body.id) {
            missionID = this.req.body.id;
        }
        const mrService = new MissionReportService.Service();
        mrService.getViewData(missionID).then((viewData) => {
            this.res.json(viewData);
        }).catch((err) => {
            this.res.json(err);
        });
    }
}
exports.Controller = Controller;
//# sourceMappingURL=mission-controller.js.map