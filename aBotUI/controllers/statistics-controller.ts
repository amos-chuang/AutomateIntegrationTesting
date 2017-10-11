import * as Express from "express";
import { default as Statistics, IStatisticsModel } from "../models/statistics-model";
import * as StatisticsService from "../services/statistics-service";

export class Controller {
    private req: Express.Request;
    private res: Express.Response;
    constructor(req: Express.Request, res: Express.Response) {
        this.req = req;
        this.res = res;
    }
    public rotate() {
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
