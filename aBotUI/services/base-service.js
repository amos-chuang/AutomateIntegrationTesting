"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bluebird = require("bluebird");
const config_model_1 = require("../models/config-model");
class BaseService {
    getConfig(targetKey) {
        return new Bluebird((resolve, reject) => {
            config_model_1.default.find({ key: targetKey }).then((configList) => {
                if (configList && configList.length === 1) {
                    resolve(configList[0].value);
                }
                else {
                    reject("can't find config");
                }
            }, (err) => { reject(err); });
        });
    }
    setConfig(targetKey, targetValue) {
        return new Bluebird((resolve, reject) => {
            this.getConfig(targetKey).then((data) => {
                console.log(data);
            }, () => {
                const config = new config_model_1.default();
                config.key = targetKey;
                config.value = targetValue;
                config.save();
            });
        });
    }
}
exports.BaseService = BaseService;
//# sourceMappingURL=base-service.js.map