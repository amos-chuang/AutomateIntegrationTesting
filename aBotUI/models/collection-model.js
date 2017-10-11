"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const collectionSchema = new mongoose.Schema({
    name: String,
    description: String,
}, { timestamps: true });
const Collection = mongoose.model("Collection", collectionSchema);
exports.default = Collection;
//# sourceMappingURL=collection-model.js.map