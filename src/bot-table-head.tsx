import * as React from "react";
import * as ReactDOM from "react-dom";

interface IBotTableHeadProp {
    columns: any[];
    hasActionColumn: boolean;
}

interface IBotTableHeadState {
    columns: any[];
    hasActionColumn: boolean;
}

export class BotTableHead extends React.Component<IBotTableHeadProp, IBotTableHeadState> {
    constructor(prop: IBotTableHeadProp) {
        super(prop);
        this.state = {
            columns: prop.columns,
            hasActionColumn: prop.hasActionColumn,
        };
    }
    public render() {
        let actionColumn = {};
        if (this.state.hasActionColumn) {
            actionColumn = <th key={"head-action"} className="column-title">Action</th>;
        }
        return (
            <thead>
                <tr className="headings">
                    {this.state.columns.map(this.renderColumn)}
                    {actionColumn}
                </tr>
            </thead >
        );
    }

    private renderColumn(col: any) {
        return (<th key={"botTableHead" + col.name} className="column-title">{col.name}</th>);
    }
}
