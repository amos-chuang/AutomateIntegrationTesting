import * as Bluebird from "bluebird";
import { default as Task, ITaskModel } from "../models/task-model";
import { default as Mission, IMissionModel } from "../models/mission-model";
import * as MissionReportService from "./mission-report-service";
import * as newman from "newman";
import * as Shell from "shelljs";
import * as fs from "fs";
import * as path from "path";
import * as rmrf from "rimraf";

export class Service {
    public run(currentMission: IMissionModel, currentTask: ITaskModel, seq: number) {
        return new Bluebird<void>((resolve, reject) => {
            const missionID = currentMission.id;
            const missionReportDirPath = "./mission/" + missionID + "/";
            const dirPath = missionReportDirPath + seq + "/";
            const fileName = "report.json";
            const reportFilePath = dirPath + fileName;
            const startDate = new Date();
            let endDate: Date;
            Bluebird.try(() => {
                console.log("newman service start");
                if (fs.existsSync(dirPath) === false) {
                    console.log("shell mkdir " + dirPath);
                    Shell.mkdir("-p", dirPath);
                }
                if (fs.existsSync(reportFilePath)) {
                    console.log("delete report " + reportFilePath);
                    fs.unlinkSync(reportFilePath);
                }
                console.log("newman run");
                return new Bluebird((newmanResolve, newmanReject) => {
                    const config = {
                        environment: "",
                        collection: require(path.resolve(currentTask.taskFile.path)),
                        reporters: "json",
                        reporter: { json: { export: path.resolve(reportFilePath) } },
                        delayRequest: 500,
                    };
                    if (currentTask.configFile && currentTask.configFile.path) {
                        if (fs.existsSync(path.resolve(currentTask.configFile.path))) {
                            config.environment = require(path.resolve(currentTask.configFile.path));
                        }
                    }
                    newman.run(config, (err: any, result: any) => {
                        if (err) { newmanReject(err); }
                        console.log("collection run complete!");
                        newmanResolve();
                    });
                });
            }).then(() => {
                const reportData = require(path.resolve(reportFilePath));
                const missionReportService = new MissionReportService.Service();
                endDate = new Date();
                return missionReportService.save(currentMission, currentTask, reportData, seq, "", startDate, endDate);
            }).then(() => {
                console.log("newman service run final resolve");
                resolve();
            }).catch((err) => {
                console.log("newman service catch error");
                console.log(err);
                const missionReportService = new MissionReportService.Service();
                endDate = new Date();
                missionReportService.save(currentMission, currentTask, {}, seq, err, startDate, endDate);
                reject(err);
            });
        });
    }
}
