"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_service_1 = require("../services/base-service");
const config_model_1 = require("../models/config-model");
class Controller {
    constructor(req, res) {
        this.req = req;
        this.res = res;
    }
    create() {
        const bs = new base_service_1.BaseService();
        bs.setConfig(config_model_1.ConfigKey.MaxMissionSlot, "2");
    }
}
exports.Controller = Controller;
//# sourceMappingURL=config-controller.js.map