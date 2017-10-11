import * as mongoose from "mongoose";

export interface IMissionSlotModel extends mongoose.Document {
    missionID: string;
    executeDate: Date;
    status: string;
    progress: number;
}

const missionSlotSchema = new mongoose.Schema({
    missionID: String,
    executeDate: Date,
    status: String,
}, { timestamps: true });

const MissionSlot = mongoose.model<IMissionSlotModel>("MissionSlot", missionSlotSchema);
export default MissionSlot;
