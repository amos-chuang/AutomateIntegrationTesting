import * as Express from "express";
import * as NewmanService from "../services/newman-service";

export class Controller {
    private req: Express.Request;
    private res: Express.Response;
    constructor(req: Express.Request, res: Express.Response) {
        this.req = req;
        this.res = res;
    }
    public run() {
    }
}
