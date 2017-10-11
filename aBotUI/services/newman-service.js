"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bluebird = require("bluebird");
const MissionReportService = require("./mission-report-service");
const newman = require("newman");
const Shell = require("shelljs");
const fs = require("fs");
const path = require("path");
class Service {
    run(currentMission, currentTask, seq) {
        return new Bluebird((resolve, reject) => {
            const missionID = currentMission.id;
            const missionReportDirPath = "./mission/" + missionID + "/";
            const dirPath = missionReportDirPath + seq + "/";
            const fileName = "report.json";
            const reportFilePath = dirPath + fileName;
            const startDate = new Date();
            let endDate;
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
                    newman.run(config, (err, result) => {
                        if (err) {
                            newmanReject(err);
                        }
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
exports.Service = Service;
//# sourceMappingURL=newman-service.js.map