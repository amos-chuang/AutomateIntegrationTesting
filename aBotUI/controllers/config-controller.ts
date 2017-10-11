import * as Express from "express";
import { BaseService } from "../services/base-service";
import { default as Config, IConfigModel, ConfigKey } from "../models/config-model";

export class Controller {
    private req: Express.Request;
    private res: Express.Response;
    constructor(req: Express.Request, res: Express.Response) {
        this.req = req;
        this.res = res;
    }
    public create() {
        const bs = new BaseService();
        bs.setConfig(ConfigKey.MaxMissionSlot, "2");
    }
}
