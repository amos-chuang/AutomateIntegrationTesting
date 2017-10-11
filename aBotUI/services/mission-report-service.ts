import * as Bluebird from "bluebird";
import { default as Task, ITaskModel } from "../models/task-model";
import { default as Mission, IMissionModel } from "../models/mission-model";
import { default as MissionReport, IMissionReportModel } from "../models/mission-report-model";
import * as fs from "fs";

export class Service {
    public save(mission: IMissionModel, task: ITaskModel, reportData: any, seq: number, error: any, startDate: Date, endDate: Date) {
        return new Bluebird((resolve, reject) => {
            const mr = new MissionReport();
            mr.missionID = mission.id as string;
            mr.collectionID = mission.collectionID as string;
            mr.taskID = task.id as string;
            mr.type = task.type as string;
            mr.seq = seq;
            mr.startDate = startDate;
            mr.finishDate = endDate;
            mr.elapsedMS = (endDate as any) - (startDate as any);
            mr.data = reportData;
            mr.errorMsg = error;
            let passedCount = 0;
            let failedCount = 0;
            switch (task.type.toLowerCase()) {
                case "newman":
                    try {
                        passedCount = reportData.run.stats.tests.total - reportData.run.stats.tests.failed;
                    } catch (ex) { }
                    try {
                        failedCount = reportData.run.stats.tests.failed;
                    } catch (ex) { }
                    break;
                case "selenium":
                    try {
                        passedCount = reportData.state.passed;
                    } catch (ex) { }
                    try {
                        failedCount = reportData.state.failed;
                    } catch (ex) { }
                    break;
            }
            mr.passedCaseCount = passedCount;
            mr.failedCaseCount = failedCount;
            return mr.save().then(() => {
                resolve();
            }).catch((err) => { reject(err); });
        });
    }
    public getViewData(missionID: string) {
        return new Bluebird((resolve, reject) => {
            const result = {} as any;
            result.data = [] as any[];
            let currentMission: IMissionModel;
            let currentMissionReportList: IMissionReportModel[];
            Mission.findById(missionID).then((m: IMissionModel) => {
                currentMission = m;
                result.mission = currentMission;
                return MissionReport.find({ missionID: currentMission.id }).sort({ seq: 1 }).then();
            }).then((reports: IMissionReportModel[]) => {
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
    private convertNewmanReport(report: IMissionReportModel) {
        const result = {} as any;
        result.id = report.id;
        result.name = report.data.collection.info.name;
        result.type = "Newman";
        result.seq = report.seq;
        result.passed = report.passedCaseCount;
        result.failed = report.failedCaseCount;
        result.data = [] as any[];
        const executions = report.data.run.executions as any[];
        executions.forEach((exe) => {
            const row = {} as any;
            row.name = exe.item.name;
            row.urlMethod = exe.request.method;
            row.url = exe.request.url;
            row.responseSize = exe.response.responseSize;
            row.responseTime = exe.response.responseTime;
            row.responseCode = exe.response.code;
            row.responseStatus = exe.response.status;
            let resData = "";
            try {
                const streamData = exe.response.stream.data as number[];
                streamData.forEach((code) => {
                    resData += String.fromCharCode(code);
                });
            } catch (ex) { }
            row.responseData = resData;
            row.assertions = exe.assertions;
            result.data.push(row);
        });
        return result;
    }
    private convertSeleniumReport(report: IMissionReportModel) {
        const result = {} as any;
        result.id = report.id;
        if (report.data.suites && report.data.suites.length > 0) {
            result.name = report.data.suites[0].name;
        }
        result.type = "Selenium";
        result.seq = report.seq;
        result.passed = report.passedCaseCount;
        result.failed = report.failedCaseCount;
        result.data = [] as any[];
        const suites = report.data.suites as any[];
        suites.forEach((suite) => {
            const row = {} as any;
            row.name = suite.name;
            row.duration = suite.duration;
            row.start = suite.start;
            row.end = suite.end;
            row.tests = suite.tests;
            result.data.push(row);
        });
        result.images = {} as any;
        result.images.screenshots = [] as string[];
        const screenshotDirPath = "./public/mission/" + report.missionID + "/" + report.seq + "/screenshots/";
        if (fs.existsSync(screenshotDirPath)) {
            const screenshotFileList = fs.readdirSync(screenshotDirPath);
            screenshotFileList.forEach((fileName) => {
                const imgSrc = screenshotDirPath.substr(8) + fileName;
                result.images.screenshots.push(imgSrc);
            });
        }
        result.images.errorShots = [] as string[];
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
