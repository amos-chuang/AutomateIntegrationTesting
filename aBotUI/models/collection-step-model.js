"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const collectionStepSchema = new mongoose.Schema({
    collectionID: String,
    subCollectionID: String,
    subCollectionName: String,
    taskID: String,
    taskName: String,
    seq: Number,
}, { timestamps: true });
const CollectionStep = mongoose.model("CollectionStep", collectionStepSchema);
exports.default = CollectionStep;
//# sourceMappingURL=collection-step-model.js.map