import * as Bluebird from "bluebird";
import { default as Config, IConfigModel, ConfigKey } from "../models/config-model";

export class BaseService {
    public getConfig(targetKey: ConfigKey) {
        return new Bluebird<string>((resolve, reject) => {
            Config.find({ key: targetKey }).then(
                (configList) => {
                    if (configList && configList.length === 1) {
                        resolve(configList[0].value);
                    } else {
                        reject("can't find config");
                    }
                },
                (err) => { reject(err); });
        });
    }
    public setConfig(targetKey: ConfigKey, targetValue: string) {
        return new Bluebird<string>((resolve, reject) => {
            this.getConfig(targetKey).then((data) => {
                console.log(data);
            }, () => {
                const config = new Config();
                config.key = targetKey;
                config.value = targetValue;
                config.save();
            });
        });
    }
}
