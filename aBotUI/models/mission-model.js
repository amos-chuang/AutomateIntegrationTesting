"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
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
const Mission = mongoose.model("Mission", missionSchema);
exports.default = Mission;
//# sourceMappingURL=mission-model.js.map