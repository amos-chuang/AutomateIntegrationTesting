import * as Bluebird from "bluebird";
import * as Express from "express";
import * as Mongoose from "mongoose";
import { default as Collection, ICollectionModel } from "../models/collection-model";
import { default as CollectionStep, ICollectionStepModel } from "../models/collection-step-model";
import { default as Mission, IMissionModel } from "../models/mission-model";
import { default as MissionQueue, IMissionQueueModel } from "../models/mission-queue-model";
import * as CollectionStepService from "./collection-step-service";

export class Service {
    public query(req: Express.Request) {
        return new Bluebird<ICollectionModel[]>((resolve, reject) => {
            let page = 1;
            if (req.body.page) {
                try {
                    page = parseInt(req.body.page, 10);
                } catch (ex) {
                    page = 1;
                }
            }
            let pageSize = 100;
            if (req.body.pageSize) {
                try {
                    pageSize = parseInt(req.body.pageSize, 10);
                } catch (ex) {
                    pageSize = 100;
                }
            }
            const conditions = { $or: [] } as { $or: any[] };
            if (req.body.id) {
                if (Mongoose.Types.ObjectId.isValid(req.body.id)) {
                    const objId = new Mongoose.Types.ObjectId(req.body.id);
                    conditions.$or.push({ _id: objId });
                }
            }
            if (req.body.name) {
                conditions.$or.push({ name: new RegExp(req.body.name, "i") });
            }
            if (req.body.searchKeyword) {
                if (Mongoose.Types.ObjectId.isValid(req.body.searchKeyword)) {
                    const objId = new Mongoose.Types.ObjectId(req.body.searchKeyword);
                    conditions.$or.push({ _id: objId });
                }
                conditions.$or.push({ name: new RegExp(req.body.searchKeyword, "i") });
            }
            Collection.find(conditions).limit(pageSize).skip(pageSize * (page - 1)).then(
                (collections) => {
                    resolve(collections);
                },
                (err) => { reject(err); });
        });
    }
    public create(req: Express.Request) {
        return new Bluebird<ICollectionModel>((resolve, reject) => {
            console.log(" == add collection == ");
            console.log("name : " + req.body.name);
            console.log("descripton : " + req.body.description);
            console.log("");
            const collection = new Collection({
                name: req.body.name,
                description: req.body.description,
            });
            collection.save((err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }
    public update(req: Express.Request) {
        return new Bluebird<ICollectionModel>((resolve, reject) => {
            Bluebird.try<ICollectionModel>(() => {
                if (Mongoose.Types.ObjectId.isValid(req.body.id)) {
                    console.log(" try to find ");
                    return Collection.findById(req.body.id).then<ICollectionModel>();
                } else {
                    console.log(" try to create ");
                    return Bluebird.resolve().then<ICollectionModel>();
                }
            }).then((collection: ICollectionModel) => {
                if (collection) {
                    console.log(" found ");
                    return Bluebird.resolve(collection);
                } else {
                    console.log(" create ");
                    return this.create(req);
                }
            }).then((collection: ICollectionModel) => {
                if (collection) {
                    console.log(" update ");
                    req.body.id = collection.id;
                    return this.updateCollection(req);
                } else {
                    return Bluebird.reject("collection == null");
                }
            }).then((collection: ICollectionModel) => {
                resolve(collection);
            }).catch((err: any) => {
                reject(err);
            });
        });
    }
    private updateCollection(req: Express.Request) {
        return new Bluebird<ICollectionModel>((resolve, reject) => {
            Collection.findById(req.body.id).then<ICollectionModel>((collection) => {
                if (collection) {
                    collection.name = req.body.name;
                    collection.description = req.body.description;
                    return collection.save();
                } else {
                    return Bluebird.reject("can't find collection id : " + req.body.id);
                }
            }).then((collection) => {
                for (const step of req.body.steps) {
                    step.collectionID = collection.id;
                }
                const csService = new CollectionStepService.Service();
                return csService.updateCollectionSteps(collection, req.body.steps);
            }).then((collection) => {
                resolve(collection);
            }).catch((err) => {
                reject(err);
            });
        });
    }

}
