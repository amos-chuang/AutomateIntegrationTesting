"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
var ConfigKey;
(function (ConfigKey) {
    ConfigKey["MaxMissionSlot"] = "MaxMissionSlot";
})(ConfigKey = exports.ConfigKey || (exports.ConfigKey = {}));
const configSchema = new mongoose.Schema({
    key: String,
    value: String,
}, { timestamps: true });
const Config = mongoose.model("Config", configSchema);
exports.default = Config;
//# sourceMappingURL=config-model.js.map