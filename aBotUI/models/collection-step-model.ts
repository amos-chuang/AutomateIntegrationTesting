import * as mongoose from "mongoose";

export interface ICollectionStepModel extends mongoose.Document {
    collectionID: string;
    subCollectionID?: string;
    subCollectionName?: string;
    taskID?: string;
    taskName?: string;
    seq: number;
}

const collectionStepSchema = new mongoose.Schema({
    collectionID: String,
    subCollectionID: String,
    subCollectionName: String,
    taskID: String,
    taskName: String,
    seq: Number,
}, { timestamps: true });

const CollectionStep = mongoose.model<ICollectionStepModel>("CollectionStep", collectionStepSchema);
export default CollectionStep;
