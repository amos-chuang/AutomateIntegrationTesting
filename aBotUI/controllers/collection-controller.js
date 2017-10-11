"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bluebird = require("bluebird");
const CollectionService = require("../services/collection-service");
const CollectionStepService = require("../services/collection-step-service");
const MissionService = require("../services/mission-service");
class Controller {
    constructor(req, res) {
        this.req = req;
        this.res = res;
    }
    query() {
        const collectionService = new CollectionService.Service();
        const collectionStepService = new CollectionStepService.Service();
        const result = [];
        collectionService.query(this.req).then((collections) => {
            function fill(collection) {
                if (collection) {
                    const data = {};
                    data._id = collection.id;
                    data.id = collection.id;
                    data.name = collection.name;
                    data.description = collection.description;
                    const condition = {};
                    condition.body = {};
                    condition.body.collectionID = collection.id;
                    return collectionStepService.query(condition).then((steps) => {
                        data.steps = steps;
                        result.push(data);
                        return fill(collections.shift());
                    });
                }
                else {
                    return Bluebird.resolve().then();
                }
            }
            return fill(collections.shift());
        }).then(() => {
            this.res.json(result);
        }).catch((err) => {
            this.res.json(err);
        });
    }
    create() {
    }
    index() {
        this.res.render("collection-index");
    }
    edit() {
        this.res.render("collection-edit");
    }
    update() {
        const collectionService = new CollectionService.Service();
        collectionService.update(this.req).then((collection) => {
            this.res.json(collection);
        }).catch((err) => {
            this.res.json(err);
        });
    }
    delete() {
    }
    history() {
    }
    createCollectionMission() {
        const missionService = new MissionService.Service();
        missionService.createCollectionMission(this.req.body._id).then((mission) => {
            this.res.json(mission);
        }, (err) => {
            this.res.json({ msg: "error", error: err });
        });
    }
}
exports.Controller = Controller;
//# sourceMappingURL=collection-controller.js.map