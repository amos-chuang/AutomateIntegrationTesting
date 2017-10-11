import * as Express from "express";
import * as Bluebird from "bluebird";
import { default as Collection, ICollectionModel } from "../models/collection-model";
import { default as CollectionStep, ICollectionStepModel } from "../models/collection-step-model";
import { ICollectionViewModel } from "../models/view_models/collection-view-model";
import { BaseService } from "../services/base-service";
import * as CollectionService from "../services/collection-service";
import * as CollectionStepService from "../services/collection-step-service";
import * as MissionService from "../services/mission-service";

export class Controller {
    private req: Express.Request;
    private res: Express.Response;
    constructor(req: Express.Request, res: Express.Response) {
        this.req = req;
        this.res = res;
    }
    public query() {
        const collectionService = new CollectionService.Service();
        const collectionStepService = new CollectionStepService.Service();
        const result = [] as ICollectionViewModel[];
        collectionService.query(this.req).then<any>((collections) => {
            function fill(collection: ICollectionModel): Bluebird<void> {
                if (collection) {
                    const data = {} as ICollectionViewModel;
                    data._id = collection.id as string;
                    data.id = collection.id as string;
                    data.name = collection.name;
                    data.description = collection.description;
                    const condition = {} as Express.Request;
                    condition.body = {};
                    condition.body.collectionID = collection.id;
                    return collectionStepService.query(condition).then<void>((steps: ICollectionStepModel[]) => {
                        data.steps = steps;
                        result.push(data);
                        return fill(collections.shift() as ICollectionModel);
                    });
                } else {
                    return Bluebird.resolve().then<void>();
                }
            }
            return fill(collections.shift() as ICollectionModel);
        }).then(() => {
            this.res.json(result);
        }).catch((err: any) => {
            this.res.json(err);
        });
    }
    public create() {

    }
    public index() {
        this.res.render("collection-index");
    }
    public edit() {
        this.res.render("collection-edit");
    }
    public update() {
        const collectionService = new CollectionService.Service();
        collectionService.update(this.req).then((collection) => {
            this.res.json(collection);
        }).catch((err) => {
            this.res.json(err);
        });
    }
    public delete() {

    }
    public history() {

    }
    public createCollectionMission() {
        const missionService = new MissionService.Service();
        missionService.createCollectionMission(this.req.body._id).then((mission) => {
            this.res.json(mission);
        }, (err) => {
            this.res.json({ msg: "error", error: err });
        });
    }
}
