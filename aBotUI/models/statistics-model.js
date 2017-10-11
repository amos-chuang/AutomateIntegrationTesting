"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const statisticsSchema = new mongoose.Schema({
    type: String,
    value: Number,
}, { timestamps: true });
const Statistics = mongoose.model("Statistics", statisticsSchema);
exports.default = Statistics;
//# sourceMappingURL=statistics-model.js.map