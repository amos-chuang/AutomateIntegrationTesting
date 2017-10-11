import * as React from "react";
import * as ReactDOM from "react-dom";
import { BotTable } from "./bot-table";
import { ICollectionModel } from "../aBotUI/models/collection-model";
import { Notification } from "./notification";

interface ICollectionListProp {
    notifyType?: string;
    notifyMsg?: string;
}

interface ICollectionListState {
    notifyType?: string;
    notifyMsg?: string;
}

class CollectionList extends React.Component<ICollectionListProp, ICollectionListState> {
    private botTable: BotTable;
    constructor(prop: any) {
        super(prop);
        this.state = {
        };
        const notifyMsgColumnName = "notifyMsg=";
        const msgIndex = window.location.href.indexOf(notifyMsgColumnName);
        let msg = "";
        if (msgIndex >= 0) {
            msg = window.location.href.substr(msgIndex + notifyMsgColumnName.length);
            const endIndex = msg.indexOf("&");
            if (endIndex >= 0) {
                msg = msg.substr(0, endIndex);
            }

        }
        const notifyTypeColumnName = "notifyType=";
        const typeIndex = window.location.href.indexOf("notifyType=");
        let type = "";
        if (typeIndex >= 0) {
            type = window.location.href.substr(typeIndex + notifyTypeColumnName.length);
            const endIndex = type.indexOf("&");
            if (endIndex >= 0) {
                type = type.substr(0, endIndex);
            }
        }
        this.state = {
            notifyType: type,
            notifyMsg: msg,
        };
        this.handleEditClick = this.handleEditClick.bind(this);
        this.handleRunClick = this.handleRunClick.bind(this);
        this.handleHistoryClick = this.handleHistoryClick.bind(this);
        this.handleDeleteClick = this.handleDeleteClick.bind(this);
        this.handlePlusClick = this.handlePlusClick.bind(this);
    }
    public render() {
        const columnsConfig = [
            { name: "_id", maxLength: 30 },
            { name: "name", maxLength: 20 },
            { name: "description", maxLength: 30 },
        ];
        const actionColumnConfig = [
            { name: "Edit", type: "primary", callback: this.handleEditClick },
            { name: "History", type: "default", callback: this.handleHistoryClick },
            { name: "Run", type: "warning", callback: this.handleRunClick },
            { name: "Delete", type: "danger", callback: this.handleDeleteClick },
        ];
        const pageSize = 100;
        let targetID = "";
        const idIndex = window.location.href.indexOf("id=");
        if (idIndex >= 0) {
            targetID = window.location.href.substr(idIndex + 3);
            const endIndex = targetID.indexOf("&");
            if (endIndex >= 0) {
                targetID = targetID.substr(0, endIndex);
            }
        }
        return (
            <div>
                <Notification type={this.state.notifyType} msg={this.state.notifyMsg} />
                <BotTable isShow={true} ref={(instance: BotTable) => { this.botTable = instance; }} queryUrl={"/collection/query"} pageSize={pageSize} columns={columnsConfig} actionColumn={actionColumnConfig} onPlusClick={this.handlePlusClick} keyword={targetID} />
            </div>
        );
    }
    private handleEditClick(data: ICollectionModel) {
        window.location.href = "/collection/edit?id=" + data._id;
    }
    private handleRunClick(data: ICollectionModel) {
        const isConfirm = confirm("run : " + data._id);
        console.log("isConfirm : " + isConfirm);
        if (isConfirm) {
            const collectionData = {
                _id: data._id,
            };
            $.ajax({
                method: "POST",
                url: "/collection/createCollectionMission",
                contentType: "application/json",
                data: JSON.stringify(collectionData),
                success: (res) => {
                    window.location.href = "/mission/report?id=" + res._id;
                },
                error: (err) => {
                    this.setState({ notifyType: "danger", notifyMsg: "Error" });
                },
            });
        }
    }
    private handleHistoryClick(data: ICollectionModel) {
        window.location.href = "/mission/index?collectionID=" + data._id;
    }
    private handleDeleteClick(data: ICollectionModel) {
        const isConfirm = confirm("delete : " + data._id);
        console.log("isConfirm : " + isConfirm);
        if (isConfirm) {
            const delData = {
                _id: data._id,
            };
            $.ajax({
                method: "POST",
                url: "/collection/delete",
                contentType: "application/json",
                data: JSON.stringify(delData),
                success: (res) => {
                    console.log(res);
                    if (res && res.msg) {
                        this.setState({ notifyType: "success", notifyMsg: res.msg });
                    }
                    this.botTable.refresh();
                },
                error: (err) => {
                    this.setState({ notifyType: "danger", notifyMsg: "Error" });
                },
            });
        }
    }
    private handlePlusClick() {
        window.location.href = "/collection/edit";
    }
}

ReactDOM.render(<CollectionList />, document.getElementById("app"));
