"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bluebird = require("bluebird");
const MissionReportService = require("./mission-report-service");
const WDIO = require("webdriverio");
const Shell = require("shelljs");
const fs = require("fs");
const path = require("path");
const PS = require("ps-node");
class Service {
    run(currentMission, currentTask, seq) {
        return new Bluebird((resolve, reject) => {
            const paths = this.getPaths(currentMission, currentTask, seq);
            const startDate = new Date();
            let endDate;
            this.cleanProcess().then(() => {
                return this.checkXvfb();
            }).then(() => {
                return this.generateWdioConfigFile(currentMission, currentTask, seq);
            }).then(() => {
                const launcher = new WDIO.Launcher(paths.missionWdioConfigPath, {});
                return launcher.run();
            }).then(() => {
                let reportFilePath = "";
                fs.readdirSync(paths.reportFileDirPath).forEach((reportFileName) => {
                    reportFilePath = paths.reportFileDirPath + reportFileName;
                });
                console.log("reportFilePath : " + reportFilePath);
                const reportData = require(path.resolve(reportFilePath));
                const missionReportService = new MissionReportService.Service();
                endDate = new Date();
                return missionReportService.save(currentMission, currentTask, reportData, seq, "", startDate, endDate);
            }).then(() => {
                resolve();
            }).catch((err) => {
                reject(err);
            });
        });
    }
    cleanProcess() {
        return new Bluebird((resolve, reject) => {
            PS.lookup({ command: ".selenium" }, (err, infos) => {
                if (err) {
                    reject(err);
                }
                let hasSeleniumServer = false;
                const geckodriverPidList = [];
                const serverName = ".selenium/selenium-server";
                const geckodriverName = ".selenium/geckodriver";
                console.log("");
                infos.forEach((info) => {
                    console.log(info.pid + " " + info.command);
                    if (info.command.indexOf(serverName) >= 0) {
                        console.log("found selenium " + info.pid);
                        hasSeleniumServer = true;
                    }
                    if (info.command.indexOf(geckodriverName) >= 0) {
                        console.log("found gecko " + info.pid);
                        geckodriverPidList.push(info.pid);
                    }
                });
                if (hasSeleniumServer === false && geckodriverPidList.length > 0) {
                    console.log("it does not has any running selenium server");
                    console.log("kill unnecessary driver");
                    while (geckodriverPidList.length > 0) {
                        const pid = geckodriverPidList.pop();
                        console.log("kill " + pid);
                        PS.kill(pid, (e) => { });
                    }
                }
                console.log("");
                resolve();
            });
        });
    }
    checkXvfb() {
        return new Bluebird((resolve, reject) => {
            Shell.exec("echo $DISPLAY", (code, stdout, stderr) => {
                if (stderr) {
                    reject(stderr);
                }
                stdout = stdout.trim();
                if (stdout !== ":2") {
                    reject("$DISPLAY should be :2 => export DISPLAY=:2");
                }
                Shell.exec("ps -aux | grep Xvfb", (xc, xo, xe) => {
                    if (xe) {
                        reject(xe);
                    }
                    xo = xo.trim();
                    if (xo.indexOf("Xvfb :2") <= 0) {
                        reject("Xvfb have not started => Xvfb :2 -screen 0 1633x768x16 &");
                    }
                    else {
                        resolve();
                    }
                });
            });
        });
    }
    getPaths(currentMission, currentTask, seq) {
        const result = {};
        result.dirPath = "./mission/" + currentMission.id + "/" + seq + "/";
        result.fileName = "report.json";
        result.reportFileDirPath = result.dirPath + "reports/";
        result.screenshotDirPath = "./public/mission/" + currentMission.id + "/" + seq + "/" + "screenshots/";
        result.screenshotLiveDirPath = "./public/mission/" + currentMission.id + "/" + seq + "/" + "screenshotLive/";
        result.wdioConfigPath = "./configs/wdio.conf.js";
        result.missionWdioConfigPath = result.dirPath + "wdio.conf.js";
        result.errorShotDirPath = "./public/mission/" + currentMission.id + "/" + seq + "/" + "errorShots/";
        return result;
    }
    generateWdioConfigFile(currentMission, currentTask, seq) {
        return new Bluebird((resolve, reject) => {
            const paths = this.getPaths(currentMission, currentTask, seq);
            if (fs.existsSync(paths.dirPath) === false) {
                console.log("shell mkdir " + paths.dirPath);
                Shell.mkdir("-p", paths.dirPath);
            }
            if (fs.existsSync(paths.reportFileDirPath) === false) {
                console.log("shell mkdir " + paths.reportFileDirPath);
                Shell.mkdir("-p", paths.reportFileDirPath);
            }
            if (fs.existsSync(paths.screenshotDirPath) === false) {
                console.log("shell mkdir " + paths.screenshotDirPath);
                Shell.mkdir("-p", paths.screenshotDirPath);
            }
            if (fs.existsSync(paths.screenshotLiveDirPath) === false) {
                console.log("shell mkdir " + paths.screenshotLiveDirPath);
                Shell.mkdir("-p", paths.screenshotLiveDirPath);
            }
            let config = fs.readFileSync(path.resolve(paths.wdioConfigPath)).toString();
            // {aBotTestSpecs}
            config = config.replace("{aBotTestSpecs}", currentTask.taskFile.path);
            // {aBotErrorShotPath}
            config = config.replace("{aBotErrorShotPath}", paths.errorShotDirPath);
            // {aBotJsonReportOutputPath}
            config = config.replace("{aBotJsonReportOutputDirPath}", paths.reportFileDirPath);
            // {aBotScreenshotDirPath}
            config = config.replace("{aBotScreenshotDirPath}", paths.screenshotDirPath);
            // {screenshotLiveDirPath}
            config = config.replace("{screenshotLiveDirPath}", paths.screenshotLiveDirPath);
            // {aBotEnv}
            const envArgs = {
                dev: {
                    url: "dev-url",
                },
            };
            config = config.replace("'{aBotEnv}'", JSON.stringify(envArgs));
            fs.writeFile(paths.missionWdioConfigPath, config, "utf8", (err) => {
                if (err) {
                    reject(err);
                }
                resolve();
            });
        });
    }
}
exports.Service = Service;
//# sourceMappingURL=selenium-service.js.map