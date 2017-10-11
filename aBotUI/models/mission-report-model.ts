import * as mongoose from "mongoose";

export interface IMissionReportModel extends mongoose.Document {
    missionID: string;
    collectionID: string;
    taskID: string;
    type: string;
    seq: number;
    data: any;
    html: string;
    folder: string;
    passedCaseCount: number;
    failedCaseCount: number;
    errorMsg: string;
    startDate: Date;
    finishDate: Date;
    elapsedMS: number;
}

const missionReportSchema = new mongoose.Schema({
    missionID: String,
    collectionID: String,
    taskID: String,
    type: String,
    seq: Number,
    data: Object,
    html: String,
    folder: String,
    passedCaseCount: Number,
    failedCaseCount: Number,
    errorMsg: String,
    startDate: Date,
    finishDate: Date,
    elapsedMS: Number,
}, { timestamps: true });

const MissionReport = mongoose.model<IMissionReportModel>("MissionReport", missionReportSchema);
export default MissionReport;
