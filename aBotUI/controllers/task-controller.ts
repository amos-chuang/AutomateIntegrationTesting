import * as Express from "express";
import { default as Task, ITaskModel } from "../models/task-model";
import { BaseService } from "../services/base-service";
import * as TaskService from "../services/task-service";
import * as MissionService from "../services/mission-service";
import * as Mongoose from "mongoose";

export class Controller {
    private req: Express.Request;
    private res: Express.Response;
    constructor(req: Express.Request, res: Express.Response) {
        this.req = req;
        this.res = res;
    }
    public query() {
        const taskService = new TaskService.Service();
        taskService.query(this.req as TaskService.IRequest).then(
            (tasks) => { this.res.json(tasks); },
            (err) => { this.res.json(err); });
    }
    public create() {
        const taskService = new TaskService.Service();
        taskService.create(this.req as TaskService.IRequest).then((task: ITaskModel) => {
            this.res.json(task);
        }, (err: any) => { this.res.json(err); });
    }
    public index() {
        this.res.render("task-index");
    }
    public edit() {
        this.res.render("task-edit");
    }
    public update() {
        const taskService = new TaskService.Service();
        taskService.update(this.req as TaskService.IRequest)
            .then((task: ITaskModel) => {
                this.res.redirect("/task/index?id=" + task._id + "&notifyMsg=OK&notifyType=info");
            }, (err) => {
                this.res.redirect("/task/index?notifyMsg=ERROR&notifyType=danger");
            });
    }
    public delete() {
        const taskService = new TaskService.Service();
        taskService.delete(this.req).then(
            (task: ITaskModel) => {
                this.res.json({
                    msg: "Delete Task [" + task._id + "] " + task.name + " ==> OK",
                    task_id: task._id,
                });
            },
            (err) => {
                this.res.json({
                    msg: "error",
                    error: err,
                });
            },
        );
    }
    public history() {
        this.res.render("task-history");
    }
    public createTaskMission() {
        const missionService = new MissionService.Service();
        missionService.createTaskMission(this.req.body._id).then((mission) => {
            this.res.json(mission);
        }, (err) => {
            this.res.json({ msg: "error", error: err });
        });
    }
}
