import * as mongoose from "mongoose";

export enum ConfigKey {
    MaxMissionSlot = "MaxMissionSlot",
}

export interface IConfigModel extends mongoose.Document {
    key: string;
    value: string;
}

const configSchema = new mongoose.Schema({
    key: String,
    value: String,
}, { timestamps: true });

const Config = mongoose.model<IConfigModel>("Config", configSchema);
export default Config;
