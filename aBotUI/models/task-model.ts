import * as mongoose from "mongoose";

export interface ITaskModel extends mongoose.Document {
    name: string;
    description: string;
    type: string;
    taskFile: {
        name: string;
        path: string;
    };
    configFile: {
        name: string;
        path: string;
    };
    checkData: () => boolean;
}

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

taskSchema.methods.checkData = function (this: ITaskModel) {
    let result = true;
    if (!this.name || !this.description) {
        result = false;
    }
    return result;
};

taskSchema.pre("save", function (this: ITaskModel, next) {
    if (this.checkData()) {
        next();
    } else {
        next(new Error("check data error"));
    }
});

const Task = mongoose.model<ITaskModel>("Task", taskSchema);
export default Task;
