"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TaskService = require("../services/task-service");
const MissionService = require("../services/mission-service");
class Controller {
    constructor(req, res) {
        this.req = req;
        this.res = res;
    }
    query() {
        const taskService = new TaskService.Service();
        taskService.query(this.req).then((tasks) => { this.res.json(tasks); }, (err) => { this.res.json(err); });
    }
    create() {
        const taskService = new TaskService.Service();
        taskService.create(this.req).then((task) => {
            this.res.json(task);
        }, (err) => { this.res.json(err); });
    }
    index() {
        this.res.render("task-index");
    }
    edit() {
        this.res.render("task-edit");
    }
    update() {
        const taskService = new TaskService.Service();
        taskService.update(this.req)
            .then((task) => {
            this.res.redirect("/task/index?id=" + task._id + "&notifyMsg=OK&notifyType=info");
        }, (err) => {
            this.res.redirect("/task/index?notifyMsg=ERROR&notifyType=danger");
        });
    }
    delete() {
        const taskService = new TaskService.Service();
        taskService.delete(this.req).then((task) => {
            this.res.json({
                msg: "Delete Task [" + task._id + "] " + task.name + " ==> OK",
                task_id: task._id,
            });
        }, (err) => {
            this.res.json({
                msg: "error",
                error: err,
            });
        });
    }
    history() {
        this.res.render("task-history");
    }
    createTaskMission() {
        const missionService = new MissionService.Service();
        missionService.createTaskMission(this.req.body._id).then((mission) => {
            this.res.json(mission);
        }, (err) => {
            this.res.json({ msg: "error", error: err });
        });
    }
}
exports.Controller = Controller;
//# sourceMappingURL=task-controller.js.map