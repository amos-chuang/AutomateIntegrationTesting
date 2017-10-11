"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
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
const MissionReport = mongoose.model("MissionReport", missionReportSchema);
exports.default = MissionReport;
//# sourceMappingURL=mission-report-model.js.map