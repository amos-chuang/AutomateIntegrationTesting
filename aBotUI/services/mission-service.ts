import * as Bluebird from "bluebird";
import * as Express from "express";
import * as Mongoose from "mongoose";
import { default as Task, ITaskModel } from "../models/task-model";
import { default as Collection, ICollectionModel } from "../models/collection-model";
import { default as CollectionStep, ICollectionStepModel } from "../models/collection-step-model";
import { default as Mission, IMissionModel } from "../models/mission-model";
import { default as MissionReport, IMissionReportModel } from "../models/mission-report-model";
import { default as MissionSlot, IMissionSlotModel } from "../models/mission-slot-model";
import * as MissionQueueService from "./mission-queue-service";
import * as TaskService from "./task-service";
import * as CollectionService from "./collection-service";
import * as NewmanService from "./newman-service";
import * as SeleniumService from "./selenium-service";

export class Service {
    public createTaskMission(taskID: string) {
        return new Bluebird((resolve, reject) => {
            Task.findById(taskID).then((task) => {
                if (task) {
                    const mission = new Mission();
                    mission.name = task.name;
                    mission.taskID = task.id;
                    return mission.save();
                } else {
                    reject("TaskID " + taskID + " can't find");
                }
            }, (err) => { reject(err); }).then(
                (currentMission) => {
                    const mqService = new MissionQueueService.Service();
                    const mid = currentMission.id as string;
                    mqService.push(mid).then(
                        (mq) => {
                            currentMission.queueDate = new Date();
                            currentMission.save();
                            resolve(currentMission);
                        },
                        (err) => {
                            currentMission.errorDate = new Date();
                            currentMission.errorMsg = err;
                            reject(err);
                        });
                },
                (err) => { reject(err); });
        });
    }
    public createCollectionMission(collectionID: string) {
        return new Bluebird((resolve, reject) => {
            Collection.findById(collectionID).then((collection) => {
                if (collection) {
                    const mission = new Mission();
                    mission.name = collection.name;
                    mission.collectionID = collection.id;
                    return mission.save();
                } else {
                    reject("CollectionID " + collectionID + " can't find");
                }
            }, (err) => { reject(err); }).then(
                (currentMission) => {
                    const mqService = new MissionQueueService.Service();
                    const mid = currentMission.id as string;
                    mqService.push(mid).then(
                        (mq) => {
                            currentMission.queueDate = new Date();
                            currentMission.save();
                            resolve(currentMission);
                        },
                        (err) => {
                            currentMission.errorDate = new Date();
                            currentMission.errorMsg = err;
                            reject(err);
                        });
                },
                (err) => { reject(err); });
        });
    }
    public executeMission(missionSlot: IMissionSlotModel) {
        return new Bluebird((resolve, reject) => {
            const missionID = missionSlot.missionID;
            let currentMission: IMissionModel;
            Bluebird.try(() => {
                return Mission.findById(missionID).then();
            }).then((mission: IMissionModel) => {
                currentMission = mission;
                missionSlot.executeDate = new Date();
                missionSlot.status = "mission executing";
                missionSlot.progress = 0;
                missionSlot.save();
                return this.getTaskList(missionID);
            }).then<any>((taskList) => {
                let totalTask = 0;
                if (taskList) {
                    totalTask = taskList.length;
                }
                let taskCount = 0;
                function exe(task: ITaskModel): any {
                    missionSlot.progress = taskCount / totalTask;
                    missionSlot.save();
                    if (task) {
                        taskCount++;
                        switch (task.type.toLowerCase()) {
                            case "newman":
                                const newmanService = new NewmanService.Service();
                                return newmanService.run(currentMission, task, taskCount).then(() => {
                                    return exe(taskList.shift() as ITaskModel);
                                });
                            case "selenium":
                                const seleniumService = new SeleniumService.Service();
                                return seleniumService.run(currentMission, task, taskCount).then(() => {
                                    return exe(taskList.shift() as ITaskModel);
                                });
                        }
                    } else {
                        return Bluebird.resolve();
                    }
                }
                return exe(taskList.shift() as ITaskModel);
            }).then(() => {
                return MissionReport.find({ missionID: currentMission.id }).then();
            }).then((reportList: IMissionReportModel[]) => {
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
    public query(req: Express.Request) {
        return new Bluebird<IMissionModel[]>((resolve, reject) => {
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
                } catch (ex) {
                    page = 1;
                }
            }
            if (req.body.pageSize) {
                try {
                    pageSize = parseInt(req.body.pageSize, 10);
                } catch (ex) {
                    pageSize = 100;
                }
            }
            const condition = { $or: [] } as { $or: any[] };
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
            Mission.find(condition).sort({ createdAt: -1 }).limit(pageSize).skip(pageSize * (page - 1)).then((missionList) => {
                resolve(missionList);
            }).catch((err) => {
                reject(err);
            });
        });
    }
    private getTaskList(missionID: string) {
        return new Bluebird<ITaskModel[]>((resolve, reject) => {
            let currentMission: IMissionModel;
            let stepList = [] as ICollectionStepModel[];
            const taskList = [] as ITaskModel[];
            Mission.findById(missionID).then<IMissionModel>((mission) => {
                if (mission) {
                    currentMission = mission;
                    if (currentMission.taskID) {
                        return Task.findById(mission.taskID as string).then<IMissionModel>();
                    } else if (currentMission.collectionID) {
                        const condition = {
                            collectionID: currentMission.collectionID,
                        };
                        return CollectionStep.find(condition).sort("seq").then((steps: ICollectionStepModel[]) => {
                            if (steps && steps.length > 0) {
                                stepList = steps;
                            }
                            return Bluebird.resolve();
                        }, (err) => Bluebird.reject("can't find step for CollectionID : " + currentMission.collectionID));
                    }
                } else {
                    return Bluebird.reject("can't find MissionID : " + missionID);
                }
            }).then((task: ITaskModel) => {
                if (task) {
                    taskList.push(task);
                }
                return Bluebird.resolve();
            }).then(() => {
                function extract(): any {
                    if (stepList) {
                        const step = stepList.shift();
                        if (step) {
                            if (step.subCollectionID) {
                                Collection.findById(step.subCollectionID).then((collection: ICollectionModel) => {
                                    const condition = {
                                        collectionID: collection.id,
                                    };
                                    return CollectionStep.find(condition).sort("seq").then((steps: ICollectionStepModel[]) => {
                                        while (steps && steps.length > 0) {
                                            stepList.unshift(steps.pop() as ICollectionStepModel);
                                        }
                                        return extract();
                                    });
                                });
                            } else if (step.taskID) {
                                return Task.findById(step.taskID as string).then((task: ITaskModel) => {
                                    taskList.push(task);
                                    return extract();
                                });
                            }
                        } else {
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
