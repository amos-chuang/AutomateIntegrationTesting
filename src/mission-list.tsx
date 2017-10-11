import * as React from "react";
import * as ReactDOM from "react-dom";
import * as QueryString from "query-string";
import { BotTable } from "./bot-table";

class MissionList extends React.Component<any, any> {
    private botTable: BotTable;
    constructor(prop: any) {
        super(prop);
        this.state = {
            data: [],
        };
        this.handlePlusClick = this.handlePlusClick.bind(this);
        this.handleViewClick = this.handleViewClick.bind(this);
    }
    public render() {
        const columnsConfig = [
            { name: "_id", maxLength: 30 },
            { name: "createdAt", maxLength: 20 },
            { name: "name", maxLength: 30 },
            { name: "collectionID", maxLength: 10 },
            { name: "taskID", maxLength: 10 },
            { name: "Tests", maxLength: 10 },
        ];
        const actionColumnConfig = [
            { name: "View", type: "primary", callback: this.handleViewClick },
        ];
        const pageSize = 100;
        let targetID = "";
        const qs = QueryString.parse(window.location.search);
        if (qs) {
            if (qs.id) {
                targetID = qs.id;
            }
            if (qs.collectionID) {
                targetID = qs.collectionID;
            }
        }
        return (
            <div>
                <BotTable isShow={true} ref={(instance: BotTable) => { this.botTable = instance; }} queryUrl={"/mission/query"} pageSize={pageSize} columns={columnsConfig} actionColumn={actionColumnConfig} onPlusClick={this.handlePlusClick} keyword={targetID} />
            </div>
        );
    }
    private handlePlusClick() {
        window.location.href = "/collection/index";
    }
    private handleViewClick(mission: any) {
        window.location.href = "/mission/report?id=" + mission._id;
    }
}

ReactDOM.render(<MissionList />, document.getElementById("app"));
