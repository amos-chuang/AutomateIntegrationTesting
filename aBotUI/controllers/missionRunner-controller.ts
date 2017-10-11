import * as Express from "express";
import * as MissionRunnerService from "../services/mission-runner-service";

export class Controller {
    private req: Express.Request;
    private res: Express.Response;
    constructor(req: Express.Request, res: Express.Response) {
        this.req = req;
        this.res = res;
    }
    public run() {
        const mrs = new MissionRunnerService.Service();
        mrs.run().then(() => { });
        this.res.json({
            status: "run",
        });
    }
}
