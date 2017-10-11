import * as React from "react";
import * as ReactDOM from "react-dom";
import { default as SortableTree, TreeItem, ExtendedNodeData } from "react-sortable-tree";
import { BotTable } from "./bot-table";
import { ICollectionStepModel } from "../aBotUI/models/collection-step-model";
import { ITaskModel } from "../aBotUI/models/task-model";
import { ITreeItem } from "./my_types/react-sortable-tree";

interface ICollectionEditFormProp {
    isShow: boolean;
    data: {
        _id: string;
        name: string;
        description: string;
        steps: ICollectionStepModel[];
    };
    treeData?: any[];
}

interface ICollectionEditFormState {
    isShow: boolean;
    data: {
        _id: string;
        name: string;
        description: string;
        steps: ICollectionStepModel[];
    };
    treeData: any[];
}

export class CollectionEditForm extends React.Component<ICollectionEditFormProp, ICollectionEditFormState> {
    private botTable: BotTable;
    constructor(prop: ICollectionEditFormProp) {
        super(prop);
        this.initProp(prop);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.handleTaskPlusClick = this.handleTaskPlusClick.bind(this);
        this.handleChooseClick = this.handleChooseClick.bind(this);
        this.handleSaveClick = this.handleSaveClick.bind(this);
        this.handleTreeDataChange = this.handleTreeDataChange.bind(this);
        this.treeNodeControl = this.treeNodeControl.bind(this);
        this.handleCancelClick = this.handleCancelClick.bind(this);
    }
    public componentWillReceiveProps(nextProp: ICollectionEditFormProp) {
        this.initProp(nextProp);
    }
    public render() {
        console.log("render");
        console.log(this.state);
        const columnsConfig = [
            { name: "name", maxLength: 20 },
            { name: "description", maxLength: 30 },
        ];
        const actionColumnConfig = [
            { name: "Choose", type: "primary", callback: this.handleChooseClick },
        ];
        const pageSize = 100;
        return (<form id={"collection-edit"} data-parsley-validate={""} className={"form-horizontal form-label-left"} method={"POST"} encType={"multipart/form-data"} action={"/collection/update"}>
            <div className={"form-group"}>
                <label className={"control-label col-md-3 col-sm-3 col-xs-12"} htmlFor={"name"}>ID
                </label>
                <div className="col-md-6 col-sm-6 col-xs-12">
                    <input type="text" name="_id" className="form-control col-md-7 col-xs-12" value={this.state.data._id} readOnly={true} />
                </div>
            </div>
            <div className={"form-group"}>
                <label className={"control-label col-md-3 col-sm-3 col-xs-12"} htmlFor={"name"}>Name <span className="required">*</span>
                </label>
                <div className="col-md-6 col-sm-6 col-xs-12">
                    <input type="text" name="name" required={true} className="form-control col-md-7 col-xs-12" value={this.state.data.name} onChange={this.handleNameChange} />
                </div>
            </div>
            <div className={"form-group"}>
                <label className={"control-label col-md-3 col-sm-3 col-xs-12"} htmlFor={"description"}>Description <span className="required">*</span>
                </label>
                <div className="col-md-6 col-sm-6 col-xs-12">
                    <textarea name="description" required={true} className="form-control col-md-7 col-xs-12" value={this.state.data.description} onChange={this.handleDescriptionChange} />
                </div>
            </div>
            <div className="ln_solid" />
            <div className="col-md-6 col-sm-12 col-xs-12 form-group pull-left" style={{ height: "500px", overflowY: "scroll", overflowX: "scroll" }} >
                <BotTable isShow={true} ref={(instance: BotTable) => { this.botTable = instance; }} queryUrl={"/task/query"} pageSize={pageSize} columns={columnsConfig} actionColumn={actionColumnConfig} onPlusClick={this.handleTaskPlusClick} />
            </div>
            <div className="col-md-6 col-sm-12 col-xs-12 form-group pull-right" style={{ height: "500px", overflowY: "scroll", overflowX: "scroll" }} >
                <SortableTree maxDepth={1} treeData={this.state.treeData} onChange={this.handleTreeDataChange} generateNodeProps={this.treeNodeControl} />
            </div>
            <div className="col-md-5 col-sm-5 col-xs-12 form-group pull-right">
                <div className="">
                    <button type="button" className="btn btn-primary" onClick={this.handleCancelClick}>Cancel</button>
                    <button type="button" className="btn btn-success" style={{ marginLeft: "20px" }} onClick={this.handleSaveClick}>Save</button>
                </div>
            </div>
        </form>);
    }
    private initProp(prop: ICollectionEditFormProp) {
        if (!prop || !prop.data || !prop.data._id) {
            let sw = false;
            if (prop && prop.isShow) {
                sw = prop.isShow;
            }
            prop = {
                isShow: sw,
                data: {
                    _id: "",
                    name: "",
                    description: "",
                    steps: [],
                },
                treeData: [],
            };
        }
        let nextTreeData = [] as ITreeItem[];
        if (prop && prop.data && prop.data.steps) {
            nextTreeData = this.convertToTreeData(prop.data.steps);
        }
        this.state = {
            isShow: prop.isShow,
            data: prop.data,
            treeData: nextTreeData as ITreeItem[],
        };
    }
    private treeNodeControl(rowInfo: ExtendedNodeData) {
        return {
            buttons: [
                <div key={rowInfo.treeIndex}>
                    <button type="button" onClick={(event) => this.removeNode(rowInfo)}>X</button>
                </div>,
            ],
            style: {
                height: "50px",
            },
        };
    }
    private removeNode(rowInfo: ExtendedNodeData) {
        const targetSeq = rowInfo.node.seq;
        const treeData = this.state.treeData;
        const nextTreeData = [];
        for (const node of treeData) {
            if (node.seq !== targetSeq) {
                nextTreeData.push(node);
            }
        }
        const nextSteps = this.convertTreeDataToSteps(nextTreeData);
        const nextData = this.state.data;
        nextData.steps = nextSteps;
        this.setState({ data: nextData, treeData: nextTreeData });
    }
    private convertToTreeData(steps: ICollectionStepModel[]) {
        const result = [] as ITreeItem[];
        steps.forEach((step) => {
            const item = {} as ITreeItem;
            item.title = step.taskName;
            item.taskID = step.taskID;
            item.seq = step.seq;
            result.push(item);
        });
        return result;
    }
    private handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
        const nextData = this.state.data;
        nextData.name = e.target.value;
        this.setState({ data: nextData });
    }
    private handleDescriptionChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        const nextData = this.state.data;
        nextData.description = e.target.value;
        this.setState({ data: nextData });
    }
    private handleTreeDataChange(nextTreeData: TreeItem[]) {
        const nextSteps = this.convertTreeDataToSteps(nextTreeData);
        const nextData = this.state.data;
        nextData.steps = nextSteps;
        this.setState({ data: nextData, treeData: nextTreeData });
    }
    private convertTreeDataToSteps(treeData: TreeItem[]) {
        const result = [] as ICollectionStepModel[];
        treeData.forEach((item: ITreeItem, i) => {
            const step = {} as ICollectionStepModel;
            step.collectionID = this.state.data._id;
            step.taskID = item.taskID;
            step.taskName = item.title;
            step.seq = i + 1;
            result.push(step);
        });
        return result;
    }
    private handleTaskPlusClick() {
        window.location.href = "/task/edit?mode=add";
    }
    private handleChooseClick(task: ITaskModel) {
        this.addTaskIntoStep(task);
    }
    private addTaskIntoStep(task: ITaskModel) {
        const steps = this.state.data.steps;
        const step = {} as ICollectionStepModel;
        step.collectionID = this.state.data._id;
        step.taskID = task._id;
        step.taskName = task.name;
        step.seq = steps.length + 1;
        steps.push(step);
        const nextData = this.state.data;
        nextData.steps = steps;
        const nextTreeData = this.convertToTreeData(steps);
        this.setState({ data: nextData, treeData: nextTreeData });
    }
    private handleCancelClick() {
        window.location.href = "/collection";
    }
    private handleSaveClick() {
        const data = {
            id: this.state.data._id,
            name: this.state.data.name,
            description: this.state.data.description,
            steps: this.state.data.steps,
        };
        console.log(data);
        $.ajax({
            method: "POST",
            url: "/collection/update",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: (res) => {
                window.location.href = "/collection/index?id=" + res._id;
            },
        });
    }
}
