import * as Bluebird from "bluebird";
import * as Express from "express";
import * as Mongoose from "mongoose";
import { default as Collection, ICollectionModel } from "../models/collection-model";
import { default as CollectionStep, ICollectionStepModel } from "../models/collection-step-model";

export class Service {
    public query(req: Express.Request) {
        return new Bluebird<ICollectionStepModel[]>((resolve, reject) => {
            const conditions = { $or: [] } as { $or: any[] };
            if (req.body.id) {
                if (Mongoose.Types.ObjectId.isValid(req.body.id)) {
                    const objId = new Mongoose.Types.ObjectId(req.body.id);
                    conditions.$or.push({ _id: objId });
                }
            }
            if (req.body.collectionID) {
                conditions.$or.push({ collectionID: req.body.collectionID });
            }
            if (req.body.taskID) {
                conditions.$or.push({ taskID: req.body.taskID });
            }
            if (req.body.taskName) {
                conditions.$or.push({ taskName: new RegExp(req.body.taskName, "i") });
            }
            if (req.body.searchKeyword) {
                if (Mongoose.Types.ObjectId.isValid(req.body.searchKeyword)) {
                    const objId = new Mongoose.Types.ObjectId(req.body.searchKeyword);
                    conditions.$or.push({ _id: objId });
                }
                conditions.$or.push({ collectionID: req.body.searchKeyword });
                conditions.$or.push({ taskID: req.body.searchKeyword });
                conditions.$or.push({ taskName: new RegExp(req.body.searchKeyword, "i") });
            }
            CollectionStep.find(conditions).sort("seq").then(
                (steps) => {
                    resolve(steps);
                },
                (err) => { reject(err); });
        });
    }
    public updateCollectionSteps(collection: ICollectionModel, nextSteps: ICollectionStepModel[]) {
        return new Bluebird<ICollectionModel>((resolve, reject) => {
            if (nextSteps && nextSteps.length > 0) {
                CollectionStep.find({ collectionID: collection.id }).then((currentSteps) => {
                    if (currentSteps && currentSteps.length > 0) {
                        console.log("remove step");
                        console.log(currentSteps);
                        for (const s of currentSteps) {
                            console.log(" == remove == ");
                            console.log(s);
                            s.remove();
                        }
                    }
                    return Bluebird.resolve();
                }).then(() => {
                    console.log("nextSteps");
                    console.log(nextSteps);
                    nextSteps.forEach((stepData) => {
                        console.log("save step");
                        console.log(stepData);
                        const step = new CollectionStep();
                        step.collectionID = collection.id as string;
                        step.taskID = stepData.taskID;
                        step.taskName = stepData.taskName;
                        step.seq = stepData.seq;
                        step.save();
                    });
                    resolve(collection);
                }).catch((err: any) => {
                    reject(err);
                });
            } else {
                resolve(collection);
            }
        });
    }
}
