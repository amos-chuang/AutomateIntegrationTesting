import * as mongoose from "mongoose";

export interface IMissionModel extends mongoose.Document {
    name: string;
    collectionID?: string;
    taskID?: string;
    errorMsg?: string;
    queueDate?: Date;
    executeDate?: Date;
    completeDate?: Date;
    errorDate?: Date;
    totalPassedCount?: number;
    totalFailedCount?: number;
}

const missionSchema = new mongoose.Schema({
    name: String,
    collectionID: String,
    taskID: String,
    errorMsg: String,
    queueDate: Date,
    executeDate: Date,
    completeDate: Date,
    errorDate: Date,
    totalPassedCount: Number,
    totalFailedCount: Number,
}, { timestamps: true });

const Mission = mongoose.model<IMissionModel>("Mission", missionSchema);
export default Mission;
