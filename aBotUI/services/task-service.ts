import * as Express from "express";
import * as Mongoose from "mongoose";
import * as Bluebird from "bluebird";
import { BaseService } from "./base-service";
import { default as Task, ITaskModel } from "../models/task-model";
import { default as CollectionStep, ICollectionStepModel } from "../models/collection-step-model";
import * as Shell from "shelljs";
import * as fs from "fs";
import * as rmrf from "rimraf";

export interface IRequest extends Express.Request {
    files: {
        taskfile: {
            name: string;
            mimetype: string;
            mv: (path: string, callback?: any) => Promise<any>;
        },
        configfile: {
            name: string;
            mimetype: string;
            mv: (path: string, callback?: any) => Promise<any>;
        },
    };
}

export class Service {
    public query(req: IRequest) {
        return new Bluebird<ITaskModel[]>((resolve, reject) => {
            let page = 0;
            if (req.body.page) {
                try {
                    page = parseInt(req.body.page, 10);
                } catch (ex) {
                    page = 0;
                }
            }
            let pageSize = 100;
            if (req.body.pageSize) {
                try {
                    pageSize = parseInt(req.body.pageSize, 10);
                } catch (ex) {
                    pageSize = 100;
                }
            }
            const conditions = { $or: [] } as { $or: any[] };
            if (req.body.id) {
                if (Mongoose.Types.ObjectId.isValid(req.body.id)) {
                    const objId = new Mongoose.Types.ObjectId(req.body.id);
                    conditions.$or.push({ _id: objId });
                }
            }
            if (req.body.name) {
                conditions.$or.push({ name: new RegExp(req.body.name, "i") });
            }
            if (req.body.searchKeyword) {
                if (Mongoose.Types.ObjectId.isValid(req.body.searchKeyword)) {
                    const objId = new Mongoose.Types.ObjectId(req.body.searchKeyword);
                    conditions.$or.push({ _id: objId });
                }
                conditions.$or.push({ name: new RegExp(req.body.searchKeyword, "i") });
            }
            Task.find(conditions).limit(pageSize).skip(pageSize * (page - 1)).then(
                (tasks) => {
                    resolve(tasks);
                },
                (err) => { reject(err); });
        });
    }
    public create(req: IRequest) {
        return new Bluebird<ITaskModel>((resolve, reject) => {
            console.log(" == add == ");
            console.log("name : " + req.body.name);
            console.log("descripton : " + req.body.description);
            console.log("");
            const task = new Task({
                name: req.body.name,
                description: req.body.description,
            });
            task.save((err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }
    public update(req: IRequest) {
        return new Bluebird<ITaskModel>((resolve, reject) => {
            Bluebird.try<ITaskModel>(() => {
                console.log("");
                console.log("service-update");
                if (Mongoose.Types.ObjectId.isValid(req.body._id) === false) {
                    return this.create(req).then((task: ITaskModel) => {
                        req.body._id = task._id;
                        return this.update(req);
                    },
                        (err) => {
                            reject(err);
                        });
                } else {
                    return this.updateTask(req);
                }
            }).then((task) => resolve(task), (err) => reject(err));
        });
    }
    public delete(req: Express.Request) {
        return new Bluebird((resolve, reject) => {
            Task.findById(req.body._id).then(
                (targetTask: ITaskModel) => {
                    if (targetTask) {
                        this.deleteTaskFiles(targetTask).then((task) => {
                            return targetTask.remove();
                        }, (err) => {
                            reject(err);
                        }).then((task: ITaskModel) => {
                            resolve(task);
                        }, () => {
                            reject("remove fail");
                        });
                    } else {
                        reject("can't find task");
                    }
                },
                (err) => {
                    reject(err);
                },
            );
        });
    }
    public execute(taskID: string) {
        return new Bluebird((resolve, reject) => {

        });
    }
    private updateTask(req: IRequest) {
        return new Bluebird<ITaskModel>((resolve, reject) => {
            Task.find({ _id: req.body._id }).then(
                (taskList) => {
                    console.log("");
                    console.log("taskList");
                    console.log(taskList);
                    console.log("");
                    if (taskList && taskList.length === 1) {
                        const task = taskList[0];
                        task.name = req.body.name;
                        task.description = req.body.description;
                        task.type = req.body.type;
                        task.save();
                        CollectionStep.find({ taskID: task.id }).then((csList) => {
                            csList.forEach((cs) => {
                                cs.taskName = task.name;
                                cs.save();
                            });
                        });
                        return this.updateTaskFile(task, req.files.taskfile);
                    } else {
                        reject("can't find task");
                    }
                }, (err) => {
                    reject(err);
                }).then(
                (task: ITaskModel) => {
                    return this.updateConfigFile(task, req.files.configfile);
                }, (err) => {
                    reject(err);
                }).then(
                (task: ITaskModel) => {
                    console.log("updateTask resolve");
                    resolve(task);
                }, (err) => {
                    reject(err);
                });
        });
    }
    private deleteTaskFiles(task: ITaskModel) {
        return new Bluebird((resolve, reject) => {
            if (task) {
                if (task.taskFile && task.taskFile.path) {
                    const folderPath = task.taskFile.path.substr(0, task.taskFile.path.lastIndexOf("/"));
                    if (fs.existsSync(folderPath)) {
                        rmrf(folderPath, (err) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(task);
                            }
                        });
                    } else {
                        resolve(task);
                    }
                } else {
                    resolve(task);
                }
            } else {
                reject("Task == null");
            }
        });
    }
    private updateTaskFile(task: ITaskModel, taskFile: any) {
        return new Bluebird((resolve, reject) => {
            if (taskFile) {
                const taskDirPath = "./public/uploads/tasks/" + task._id + "/";
                const newmanTaskFileName = "taskFile.json";
                const seleniumTaskFileName = "taskFile.js";
                let taskFileName = "";
                if (fs.existsSync(taskDirPath) === false) {
                    Shell.mkdir("-p", taskDirPath);
                }
                switch (task.type.toLowerCase()) {
                    case "newman":
                        taskFileName = newmanTaskFileName;
                        break;
                    case "selenium":
                        taskFileName = seleniumTaskFileName;
                        break;
                }
                const taskFileFullPath = taskDirPath + taskFileName;
                taskFile.mv(taskFileFullPath).then(() => {
                    task.taskFile.name = taskFileName;
                    task.taskFile.path = taskFileFullPath;
                    task.save();
                    resolve(task);
                }, () => {
                    reject("taskFile mv error");
                });
            } else {
                resolve(task);
            }
        });
    }
    private updateConfigFile(task: ITaskModel, configFile: any) {
        return new Bluebird((resolve, reject) => {
            if (configFile) {
                const taskDirPath = "./public/uploads/tasks/" + task._id + "/";
                if (fs.existsSync(taskDirPath) === false) {
                    Shell.mkdir("-p", taskDirPath);
                }
                const configFileName = "configFile.json";
                const configFileFullPath = taskDirPath + configFileName;
                configFile.mv(configFileFullPath).then(
                    () => {
                        task.configFile.name = configFileName;
                        task.configFile.path = configFileFullPath;
                        task.save();
                        resolve(task);
                    },
                    () => {
                        reject("configFile mv error");
                    });
            } else {
                resolve(task);
            }
        });
    }
}
