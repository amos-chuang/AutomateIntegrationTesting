import * as mongoose from "mongoose";

export interface IMissionQueueModel extends mongoose.Document {
    missionID?: string;
}

const missionQueueSchema = new mongoose.Schema({
    missionID: String,
}, { timestamps: true });

const MissionQueue = mongoose.model<IMissionQueueModel>("MissionQueue", missionQueueSchema);
export default MissionQueue;
