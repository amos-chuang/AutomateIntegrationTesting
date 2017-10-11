"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const missionQueueSchema = new mongoose.Schema({
    missionID: String,
}, { timestamps: true });
const MissionQueue = mongoose.model("MissionQueue", missionQueueSchema);
exports.default = MissionQueue;
//# sourceMappingURL=mission-queue-model.js.map