import * as React from "react";
import * as ReactDOM from "react-dom";
import jquery from "jquery";
import { BotTableHead } from "./bot-table-head";
import { BotTableBody } from "./bot-table-body";
import { BotTableControl } from "./bot-table-control";

export interface IBotTableColumnConfig {
    name: string;
    maxLength: number;
}

export interface IBotTableActionColumnConfig {
    name: string;
    type: string;
    callback: (data: any) => void;
}

export interface IBotTableProp {
    isShow: boolean;
    columns: IBotTableColumnConfig[];
    keyword?: string;
    queryUrl: string;
    pageSize: number;
    actionColumn: IBotTableActionColumnConfig[];
    onListChange?: (data: any[]) => void;
    onPlusClick?: () => void;
}

export interface IBotTableState {
    isShow: boolean;
    data: any[];
    columns: IBotTableColumnConfig[];
    queryUrl: string;
    pageSize: number;
    keyword?: string;
    page: number;
    actionColumn: IBotTableActionColumnConfig[];
    onListChange?: (data: any[]) => void;
    onPlusClick?: () => void;
}
export class BotTable extends React.Component<IBotTableProp, IBotTableState> {
    constructor(prop: IBotTableProp) {
        super(prop);
        this.state = {
            isShow: prop.isShow,
            data: [],
            keyword: prop.keyword,
            page: 1,
            pageSize: prop.pageSize,
            actionColumn: prop.actionColumn,
            columns: prop.columns,
            queryUrl: prop.queryUrl,
            onListChange: prop.onListChange,
            onPlusClick: prop.onPlusClick,
        };
        this.handleKeywordChange = this.handleKeywordChange.bind(this);
        this.handleSearchBarClick = this.handleSearchBarClick.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.handlePlusClick = this.handlePlusClick.bind(this);
    }
    public componentDidMount() {
        $(document).ready(() => {
            this.queryData();
        });
    }
    public render() {
        let displayType = "";
        if (this.state.isShow === false) {
            displayType = "none";
        }
        const cssStyle = {
            display: displayType,
        };
        let hasActionColumn = false;
        if (this.state.actionColumn && this.state.actionColumn.length > 0) {
            hasActionColumn = true;
        }
        return (
            <div style={cssStyle}>
                <BotTableControl queryUrl={this.state.queryUrl} keyword={this.state.keyword} onKeywordChange={this.handleKeywordChange} onSearchClick={this.handleSearchBarClick} onPageChange={this.handlePageChange} onPlusClick={this.handlePlusClick} />
                <div className="table-responsive">
                    <table className="table table-striped jambo_table bulk_action">
                        <BotTableHead columns={this.state.columns} hasActionColumn={hasActionColumn} />
                        <BotTableBody columns={this.state.columns} actionColumn={this.state.actionColumn} data={this.state.data} />
                    </table>
                </div>
            </div>
        );
    }
    public refresh() {
        console.log("bot table refresh");
        console.log(this);
        this.queryData();
    }
    private handleKeywordChange(value: string) {
        this.setState({ keyword: value }, () => {
            setTimeout(() => {
                if (this.state.keyword === value) {
                    this.queryData();
                }
            }, 500);
        });
    }
    private handleSearchBarClick(value: string) {
        this.setState({ keyword: value }, () => {
            this.queryData();
        });
    }
    private handlePageChange(value: number) {
        this.setState({ page: value }, () => {
            this.queryData();
        });
    }
    private queryData() {
        let keyword = this.state.keyword;
        if (!keyword || keyword === "") {
            keyword = ".*";
        }
        let currentPage = 0;
        if (this.state.page > 0) {
            currentPage = this.state.page;
        }
        let data = {};
        if (keyword.indexOf("id=") >= 0) {
            data = {
                id: keyword.replace("id=", ""),
                page: currentPage,
                pageSize: this.state.pageSize,
            };
        } else {
            data = {
                searchKeyword: keyword,
                page: currentPage,
                pageSize: this.state.pageSize,
            };
        }
        $.ajax({
            method: "POST",
            url: this.state.queryUrl,
            contentType: "application/json",
            data: JSON.stringify(data),
            success: (res) => {
                this.setState({ data: res });
                if (this.state.onListChange) {
                    this.state.onListChange(res);
                }
            },
        });
    }
    private handlePlusClick() {
        if (this.state.onPlusClick) {
            this.state.onPlusClick();
        }
    }
}
