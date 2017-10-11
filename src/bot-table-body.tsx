import * as React from "react";
import * as ReactDOM from "react-dom";

interface IBotTableBodyProp {
    columns: any[];
    data: any[];
    actionColumn: any[];
}

interface IBotTableBodyState {
    columns: any[];
    data: any[];
    actionColumn: any[];
}

export class BotTableBody extends React.Component<IBotTableBodyProp, IBotTableBodyState> {
    constructor(prop: IBotTableBodyProp) {
        super(prop);
        this.state = {
            columns: prop.columns,
            data: prop.data,
            actionColumn: prop.actionColumn,
        };
        this.renderRow = this.renderRow.bind(this);
    }
    public componentWillReceiveProps(nextProps: IBotTableBodyProp) {
        this.setState({ data: nextProps.data });
    }
    public render() {
        let rows: any;
        if (this.state.data && this.state.data.map) {
            rows = this.state.data.map(this.renderRow);
        }
        return (
            <tbody>
                {rows}
            </tbody>
        );
    }
    private renderRow(row: any, index: number) {
        const tds = [] as JSX.Element[];
        this.state.columns.forEach((col: any) => {
            let content = "";
            if (row[col.name]) {
                content = String(row[col.name]);
                try {
                    const temp = new Date(row[col.name] as Date).toLocaleString();
                    if (temp !== "Invalid Date") {
                        content = temp;
                    }
                } catch (ex) { }
                if (content.length > col.maxLength) {
                    content = content.substr(0, col.maxLength);
                }
            }
            tds.push(<td key={col.name + row[col.name]} className=" " style={{ verticalAlign: "middle", wordWrap: "break-word" }}>{content}</td>);
        });
        if (this.state.actionColumn) {
            const actionButtons = [] as JSX.Element[];
            this.state.actionColumn.forEach((ac) => {
                const btnType = "btn btn-" + ac.type;
                actionButtons.push(<button type="button" key={"botTableActionButton" + ac.name + row[0]} className={btnType} onClick={() => this.handelActionButtonClick(row, ac.callback)}>{ac.name}</button>);
            });
            tds.push(
                <td key={"botTableAction" + row[0]} className="last" style={{ verticalAlign: "middle" }}>
                    {actionButtons}
                </td>);
        }
        let trClass = "even pointer";
        if (index % 2 === 0) {
            trClass = "odd pointer";
        }
        return (<tr key={index} className={trClass}>{tds}</tr>);
    }
    private handelActionButtonClick(data: any, callback: (data: any) => void) {
        if (callback) {
            callback(data);
        }
    }
}
