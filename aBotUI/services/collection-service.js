"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bluebird = require("bluebird");
const Mongoose = require("mongoose");
const collection_model_1 = require("../models/collection-model");
const CollectionStepService = require("./collection-step-service");
class Service {
    query(req) {
        return new Bluebird((resolve, reject) => {
            let page = 1;
            if (req.body.page) {
                try {
                    page = parseInt(req.body.page, 10);
                }
                catch (ex) {
                    page = 1;
                }
            }
            let pageSize = 100;
            if (req.body.pageSize) {
                try {
                    pageSize = parseInt(req.body.pageSize, 10);
                }
                catch (ex) {
                    pageSize = 100;
                }
            }
            const conditions = { $or: [] };
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
            collection_model_1.default.find(conditions).limit(pageSize).skip(pageSize * (page - 1)).then((collections) => {
                resolve(collections);
            }, (err) => { reject(err); });
        });
    }
    create(req) {
        return new Bluebird((resolve, reject) => {
            console.log(" == add collection == ");
            console.log("name : " + req.body.name);
            console.log("descripton : " + req.body.description);
            console.log("");
            const collection = new collection_model_1.default({
                name: req.body.name,
                description: req.body.description,
            });
            collection.save((err, data) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(data);
                }
            });
        });
    }
    update(req) {
        return new Bluebird((resolve, reject) => {
            Bluebird.try(() => {
                if (Mongoose.Types.ObjectId.isValid(req.body.id)) {
                    console.log(" try to find ");
                    return collection_model_1.default.findById(req.body.id).then();
                }
                else {
                    console.log(" try to create ");
                    return Bluebird.resolve().then();
                }
            }).then((collection) => {
                if (collection) {
                    console.log(" found ");
                    return Bluebird.resolve(collection);
                }
                else {
                    console.log(" create ");
                    return this.create(req);
                }
            }).then((collection) => {
                if (collection) {
                    console.log(" update ");
                    req.body.id = collection.id;
                    return this.updateCollection(req);
                }
                else {
                    return Bluebird.reject("collection == null");
                }
            }).then((collection) => {
                resolve(collection);
            }).catch((err) => {
                reject(err);
            });
        });
    }
    updateCollection(req) {
        return new Bluebird((resolve, reject) => {
            collection_model_1.default.findById(req.body.id).then((collection) => {
                if (collection) {
                    collection.name = req.body.name;
                    collection.description = req.body.description;
                    return collection.save();
                }
                else {
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
exports.Service = Service;
//# sourceMappingURL=collection-service.js.map