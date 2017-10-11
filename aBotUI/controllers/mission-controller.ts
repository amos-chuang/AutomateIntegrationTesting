import * as Express from "express";
import { default as Task, ITaskModel } from "../models/task-model";
import { BaseService } from "../services/base-service";
import * as TaskService from "../services/task-service";
import * as MissionReportService from "../services/mission-report-service";
import * as MissionService from "../services/mission-service";
import * as Mongoose from "mongoose";

export class Controller {
    private req: Express.Request;
    private res: Express.Response;
    constructor(req: Express.Request, res: Express.Response) {
        this.req = req;
        this.res = res;
    }
    public index() {
        this.res.render("mission-index");
    }
    public report() {
        this.res.render("mission-report");
    }
    public query() {
        const missionService = new MissionService.Service();
        missionService.query(this.req).then((data) => {
            this.res.json(data);
        }).catch((err) => {
            this.res.json(err);
        });

    }
    public getReport() {
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
