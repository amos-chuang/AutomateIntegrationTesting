import * as mongoose from "mongoose";

export interface IStatisticsModel extends mongoose.Document {
    type: string;
    value: number;
}

const statisticsSchema = new mongoose.Schema({
    type: String,
    value: Number,
}, { timestamps: true });

const Statistics = mongoose.model<IStatisticsModel>("Statistics", statisticsSchema);
export default Statistics;
