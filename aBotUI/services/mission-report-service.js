"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bluebird = require("bluebird");
const mission_model_1 = require("../models/mission-model");
const mission_report_model_1 = require("../models/mission-report-model");
const fs = require("fs");
class Service {
    save(mission, task, reportData, seq, error, startDate, endDate) {
        return new Bluebird((resolve, reject) => {
            const mr = new mission_report_model_1.default();
            mr.missionID = mission.id;
            mr.collectionID = mission.collectionID;
            mr.taskID = task.id;
            mr.type = task.type;
            mr.seq = seq;
            mr.startDate = startDate;
            mr.finishDate = endDate;
            mr.elapsedMS = endDate - startDate;
            mr.data = reportData;
            mr.errorMsg = error;
            let passedCount = 0;
            let failedCount = 0;
            switch (task.type.toLowerCase()) {
                case "newman":
                    try {
                        passedCount = reportData.run.stats.tests.total - reportData.run.stats.tests.failed;
                    }
                    catch (ex) { }
                    try {
                        failedCount = reportData.run.stats.tests.failed;
                    }
                    catch (ex) { }
                    break;
                case "selenium":
                    try {
                        passedCount = reportData.state.passed;
                    }
                    catch (ex) { }
                    try {
                        failedCount = reportData.state.failed;
                    }
                    catch (ex) { }
                    break;
            }
            mr.passedCaseCount = passedCount;
            mr.failedCaseCount = failedCount;
            return mr.save().then(() => {
                resolve();
            }).catch((err) => { reject(err); });
        });
    }
    getViewData(missionID) {
        return new Bluebird((resolve, reject) => {
            const result = {};
            result.data = [];
            let currentMission;
            let currentMissionReportList;
            mission_model_1.default.findById(missionID).then((m) => {
                currentMission = m;
                result.mission = currentMission;
                return mission_report_model_1.default.find({ missionID: currentMission.id }).sort({ seq: 1 }).then();
            }).then((reports) => {
                currentMissionReportList = reports;
                currentMissionReportList.forEach((report) => {
                    switch (report.type.toLowerCase()) {
                        case "newman":
                            result.data.push(this.convertNewmanReport(report));
                            break;
                        case "selenium":
                            result.data.push(this.convertSeleniumReport(report));
                            break;
                    }
                });
                resolve(result);
            }).catch((err) => {
                reject(err);
            });
        });
    }
    convertNewmanReport(report) {
        const result = {};
        result.id = report.id;
        result.name = report.data.collection.info.name;
        result.type = "Newman";
        result.seq = report.seq;
        result.passed = report.passedCaseCount;
        result.failed = report.failedCaseCount;
        result.data = [];
        const executions = report.data.run.executions;
        executions.forEach((exe) => {
            const row = {};
            row.name = exe.item.name;
            row.urlMethod = exe.request.method;
            row.url = exe.request.url;
            row.responseSize = exe.response.responseSize;
            row.responseTime = exe.response.responseTime;
            row.responseCode = exe.response.code;
            row.responseStatus = exe.response.status;
            let resData = "";
            try {
                const streamData = exe.response.stream.data;
                streamData.forEach((code) => {
                    resData += String.fromCharCode(code);
                });
            }
            catch (ex) { }
            row.responseData = resData;
            row.assertions = exe.assertions;
            result.data.push(row);
        });
        return result;
    }
    convertSeleniumReport(report) {
        const result = {};
        result.id = report.id;
        if (report.data.suites && report.data.suites.length > 0) {
            result.name = report.data.suites[0].name;
        }
        result.type = "Selenium";
        result.seq = report.seq;
        result.passed = report.passedCaseCount;
        result.failed = report.failedCaseCount;
        result.data = [];
        const suites = report.data.suites;
        suites.forEach((suite) => {
            const row = {};
            row.name = suite.name;
            row.duration = suite.duration;
            row.start = suite.start;
            row.end = suite.end;
            row.tests = suite.tests;
            result.data.push(row);
        });
        result.images = {};
        result.images.screenshots = [];
        const screenshotDirPath = "./public/mission/" + report.missionID + "/" + report.seq + "/screenshots/";
        if (fs.existsSync(screenshotDirPath)) {
            const screenshotFileList = fs.readdirSync(screenshotDirPath);
            screenshotFileList.forEach((fileName) => {
                const imgSrc = screenshotDirPath.substr(8) + fileName;
                result.images.screenshots.push(imgSrc);
            });
        }
        result.images.errorShots = [];
        const errorShotDirPath = "./public/mission/" + report.missionID + "/" + report.seq + "/errorShots/";
        if (fs.existsSync(errorShotDirPath)) {
            const errorShotFileList = fs.readdirSync(errorShotDirPath);
            errorShotFileList.forEach((fileName) => {
                const imgSrc = errorShotDirPath.substr(8) + fileName;
                result.images.errorShots.push(imgSrc);
            });
        }
        result.browserName = report.data.capabilities.browserName;
        return result;
    }
}
exports.Service = Service;
//# sourceMappingURL=mission-report-service.js.map