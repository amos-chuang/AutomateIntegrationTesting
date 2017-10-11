"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bluebird = require("bluebird");
const Mongoose = require("mongoose");
const collection_step_model_1 = require("../models/collection-step-model");
class Service {
    query(req) {
        return new Bluebird((resolve, reject) => {
            const conditions = { $or: [] };
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
            collection_step_model_1.default.find(conditions).sort("seq").then((steps) => {
                resolve(steps);
            }, (err) => { reject(err); });
        });
    }
    updateCollectionSteps(collection, nextSteps) {
        return new Bluebird((resolve, reject) => {
            if (nextSteps && nextSteps.length > 0) {
                collection_step_model_1.default.find({ collectionID: collection.id }).then((currentSteps) => {
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
                        const step = new collection_step_model_1.default();
                        step.collectionID = collection.id;
                        step.taskID = stepData.taskID;
                        step.taskName = stepData.taskName;
                        step.seq = stepData.seq;
                        step.save();
                    });
                    resolve(collection);
                }).catch((err) => {
                    reject(err);
                });
            }
            else {
                resolve(collection);
            }
        });
    }
}
exports.Service = Service;
//# sourceMappingURL=collection-step-service.js.map