"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const missionSlotSchema = new mongoose.Schema({
    missionID: String,
    executeDate: Date,
    status: String,
}, { timestamps: true });
const MissionSlot = mongoose.model("MissionSlot", missionSlotSchema);
exports.default = MissionSlot;
//# sourceMappingURL=mission-slot-model.js.map