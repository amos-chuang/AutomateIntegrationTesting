import * as React from "react";
import * as ReactDOM from "react-dom";
import { BotTable } from "./bot-table";
import { TaskEditForm } from "./task-edit-form";

interface ITaskEditorState {
    isAddMode: boolean;
    isEditMode: boolean;
    isShowTaskList: boolean;
    isShowEditForm: boolean;
    data: any;
}

class TaskEditor extends React.Component<any, ITaskEditorState> {
    constructor(prop: any) {
        super(prop);
        const checkIsAddMode = window.location.href.indexOf("mode=add") >= 0;
        const checkIsEditMode = window.location.href.indexOf("id=") >= 0;
        if (checkIsAddMode || checkIsEditMode) {
            this.state = {
                isAddMode: checkIsAddMode,
                isEditMode: checkIsEditMode,
                isShowTaskList: false,
                isShowEditForm: true,
                data: {},
            };
        } else {
            this.state = {
                isAddMode: checkIsAddMode,
                isEditMode: checkIsEditMode,
                isShowTaskList: true,
                isShowEditForm: false,
                data: {},
            };
        }
        this.handleEditClick = this.handleEditClick.bind(this);
        this.handleListChange = this.handleListChange.bind(this);
    }
    public render() {
        const columnsConfig = [
            { name: "_id", maxLength: 30 },
            { name: "name", maxLength: 20 },
            { name: "description", maxLength: 30 },
        ];
        const actionColumnConfig = [
            { name: "Edit", type: "primary", callback: this.handleEditClick },
        ];
        const pageSize = 3;
        let keyword = "";
        const idIndex = window.location.href.indexOf("id=");
        if (idIndex >= 0) {
            const paramlength = window.location.href.length - idIndex;
            keyword = window.location.href.substr(idIndex, paramlength);
        }
        return (
            <div>
                <BotTable isShow={this.state.isShowTaskList} queryUrl={"/task/query"} pageSize={pageSize} keyword={keyword} columns={columnsConfig} actionColumn={actionColumnConfig} onListChange={this.handleListChange} onPlusClick={this.handlePlusClick} />
                <hr />
                <TaskEditForm isShow={this.state.isShowEditForm} data={this.state.data} />
            </div>
        );
    }
    private handleEditClick(data: any) {
        window.location.href = "/task/edit?id=" + data._id;
    }
    private handleListChange(list: any[]) {
        if (list && list.length === 1 && this.state.isEditMode) {
            this.setState({ data: list[0] });
        }
    }
    private handlePlusClick() {
        window.location.href = "/task/edit?mode=add";
    }
}

ReactDOM.render(<TaskEditor />, document.getElementById("app"));
