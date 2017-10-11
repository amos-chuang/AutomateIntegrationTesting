"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const taskSchema = new mongoose.Schema({
    name: String,
    description: String,
    type: String,
    taskFile: {
        name: String,
        path: String,
    },
    configFile: {
        name: String,
        path: String,
    },
}, { timestamps: true });
taskSchema.methods.checkData = function () {
    let result = true;
    if (!this.name || !this.description) {
        result = false;
    }
    return result;
};
taskSchema.pre("save", function (next) {
    if (this.checkData()) {
        next();
    }
    else {
        next(new Error("check data error"));
    }
});
const Task = mongoose.model("Task", taskSchema);
exports.default = Task;
//# sourceMappingURL=task-model.js.map