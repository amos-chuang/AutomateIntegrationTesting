import * as mongoose from "mongoose";

export interface ICollectionModel extends mongoose.Document {
    name: string;
    description: string;
}

const collectionSchema = new mongoose.Schema({
    name: String,
    description: String,
}, { timestamps: true });

const Collection = mongoose.model<ICollectionModel>("Collection", collectionSchema);
export default Collection;
