"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bluebird = require("bluebird");
const Mongoose = require("mongoose");
const task_model_1 = require("../models/task-model");
const collection_model_1 = require("../models/collection-model");
const collection_step_model_1 = require("../models/collection-step-model");
const mission_model_1 = require("../models/mission-model");
const mission_report_model_1 = require("../models/mission-report-model");
const MissionQueueService = require("./mission-queue-service");
const NewmanService = require("./newman-service");
const SeleniumService = require("./selenium-service");
class Service {
    createTaskMission(taskID) {
        return new Bluebird((resolve, reject) => {
            task_model_1.default.findById(taskID).then((task) => {
                if (task) {
                    const mission = new mission_model_1.default();
                    mission.name = task.name;
                    mission.taskID = task.id;
                    return mission.save();
                }
                else {
                    reject("TaskID " + taskID + " can't find");
                }
            }, (err) => { reject(err); }).then((currentMission) => {
                const mqService = new MissionQueueService.Service();
                const mid = currentMission.id;
                mqService.push(mid).then((mq) => {
                    currentMission.queueDate = new Date();
                    currentMission.save();
                    resolve(currentMission);
                }, (err) => {
                    currentMission.errorDate = new Date();
                    currentMission.errorMsg = err;
                    reject(err);
                });
            }, (err) => { reject(err); });
        });
    }
    createCollectionMission(collectionID) {
        return new Bluebird((resolve, reject) => {
            collection_model_1.default.findById(collectionID).then((collection) => {
                if (collection) {
                    const mission = new mission_model_1.default();
                    mission.name = collection.name;
                    mission.collectionID = collection.id;
                    return mission.save();
                }
                else {
                    reject("CollectionID " + collectionID + " can't find");
                }
            }, (err) => { reject(err); }).then((currentMission) => {
                const mqService = new MissionQueueService.Service();
                const mid = currentMission.id;
                mqService.push(mid).then((mq) => {
                    currentMission.queueDate = new Date();
                    currentMission.save();
                    resolve(currentMission);
                }, (err) => {
                    currentMission.errorDate = new Date();
                    currentMission.errorMsg = err;
                    reject(err);
                });
            }, (err) => { reject(err); });
        });
    }
    executeMission(missionSlot) {
        return new Bluebird((resolve, reject) => {
            const missionID = missionSlot.missionID;
            let currentMission;
            Bluebird.try(() => {
                return mission_model_1.default.findById(missionID).then();
            }).then((mission) => {
                currentMission = mission;
                missionSlot.executeDate = new Date();
                missionSlot.status = "mission executing";
                missionSlot.progress = 0;
                missionSlot.save();
                return this.getTaskList(missionID);
            }).then((taskList) => {
                let totalTask = 0;
                if (taskList) {
                    totalTask = taskList.length;
                }
                let taskCount = 0;
                function exe(task) {
                    missionSlot.progress = taskCount / totalTask;
                    missionSlot.save();
                    if (task) {
                        taskCount++;
                        switch (task.type.toLowerCase()) {
                            case "newman":
                                const newmanService = new NewmanService.Service();
                                return newmanService.run(currentMission, task, taskCount).then(() => {
                                    return exe(taskList.shift());
                                });
                            case "selenium":
                                const seleniumService = new SeleniumService.Service();
                                return seleniumService.run(currentMission, task, taskCount).then(() => {
                                    return exe(taskList.shift());
                                });
                        }
                    }
                    else {
                        return Bluebird.resolve();
                    }
                }
                return exe(taskList.shift());
            }).then(() => {
                return mission_report_model_1.default.find({ missionID: currentMission.id }).then();
            }).then((reportList) => {
                let passedCount = 0;
                let failedCount = 0;
                reportList.forEach((report) => {
                    if (report.passedCaseCount) {
                        passedCount += report.passedCaseCount;
                    }
                    if (report.failedCaseCount) {
                        failedCount = report.failedCaseCount;
                    }
                });
                console.log("mission accomplished " + missionID);
                currentMission.totalPassedCount = passedCount;
                currentMission.totalFailedCount = failedCount;
                currentMission.completeDate = new Date();
                currentMission.save();
                resolve();
            }).catch((err) => {
                console.log(err);
                currentMission.errorMsg = err;
                currentMission.errorDate = new Date();
                currentMission.save();
                reject(err);
            }).finally(() => {
                missionSlot.remove();
            });
        });
    }
    query(req) {
        return new Bluebird((resolve, reject) => {
            const targetMissionID = req.body.id;
            const targetCollectionID = req.body.collectionID;
            const targetTaskID = req.body.taskID;
            const targetDate = req.body.date;
            const targetKeyword = req.body.searchKeyword;
            let page = 1;
            let pageSize = 100;
            if (req.body.page) {
                try {
                    page = parseInt(req.body.page, 10);
                }
                catch (ex) {
                    page = 1;
                }
            }
            if (req.body.pageSize) {
                try {
                    pageSize = parseInt(req.body.pageSize, 10);
                }
                catch (ex) {
                    pageSize = 100;
                }
            }
            const condition = { $or: [] };
            if (targetMissionID) {
                condition.$or.push({ _id: targetMissionID });
            }
            if (targetCollectionID) {
                condition.$or.push({ collectionID: targetCollectionID });
            }
            if (targetTaskID) {
                condition.$or.push({ taskID: targetTaskID });
            }
            if (targetDate) {
                condition.$or.push({ createdAt: targetDate });
                condition.$or.push({ completeDate: targetDate });
            }
            if (targetKeyword) {
                if (Mongoose.Types.ObjectId.isValid(targetKeyword)) {
                    condition.$or.push({ _id: targetKeyword });
                    condition.$or.push({ collectionID: targetKeyword });
                    condition.$or.push({ taskID: targetKeyword });
                }
                condition.$or.push({ name: new RegExp(targetKeyword, "i") });
            }
            mission_model_1.default.find(condition).sort({ createdAt: -1 }).limit(pageSize).skip(pageSize * (page - 1)).then((missionList) => {
                resolve(missionList);
            }).catch((err) => {
                reject(err);
            });
        });
    }
    getTaskList(missionID) {
        return new Bluebird((resolve, reject) => {
            let currentMission;
            let stepList = [];
            const taskList = [];
            mission_model_1.default.findById(missionID).then((mission) => {
                if (mission) {
                    currentMission = mission;
                    if (currentMission.taskID) {
                        return task_model_1.default.findById(mission.taskID).then();
                    }
                    else if (currentMission.collectionID) {
                        const condition = {
                            collectionID: currentMission.collectionID,
                        };
                        return collection_step_model_1.default.find(condition).sort("seq").then((steps) => {
                            if (steps && steps.length > 0) {
                                stepList = steps;
                            }
                            return Bluebird.resolve();
                        }, (err) => Bluebird.reject("can't find step for CollectionID : " + currentMission.collectionID));
                    }
                }
                else {
                    return Bluebird.reject("can't find MissionID : " + missionID);
                }
            }).then((task) => {
                if (task) {
                    taskList.push(task);
                }
                return Bluebird.resolve();
            }).then(() => {
                function extract() {
                    if (stepList) {
                        const step = stepList.shift();
                        if (step) {
                            if (step.subCollectionID) {
                                collection_model_1.default.findById(step.subCollectionID).then((collection) => {
                                    const condition = {
                                        collectionID: collection.id,
                                    };
                                    return collection_step_model_1.default.find(condition).sort("seq").then((steps) => {
                                        while (steps && steps.length > 0) {
                                            stepList.unshift(steps.pop());
                                        }
                                        return extract();
                                    });
                                });
                            }
                            else if (step.taskID) {
                                return task_model_1.default.findById(step.taskID).then((task) => {
                                    taskList.push(task);
                                    return extract();
                                });
                            }
                        }
                        else {
                            return Bluebird.resolve();
                        }
                    }
                }
                return extract();
            }).then(() => {
                resolve(taskList);
            }).catch((err) => {
                reject(err);
            });
        });
    }
}
exports.Service = Service;
//# sourceMappingURL=mission-service.js.map