import * as Express from "express";

export class Controller {
    private req: Express.Request;
    private res: Express.Response;
    constructor(req: Express.Request, res: Express.Response) {
        this.req = req;
        this.res = res;
    }
    public index() {
        this.res.render("index", { title: "IndexController" });
    }
    public dashboard() {
        this.res.render("dashboard");
    }
    public chartDemo() {
        this.res.render("chart-demo", { title: "Chart Demo" });
    }
}
