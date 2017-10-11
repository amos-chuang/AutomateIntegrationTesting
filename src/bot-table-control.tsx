import * as React from "react";
import * as ReactDOM from "react-dom";

interface IBotTableControlProp {
    queryUrl: string;
    page?: number;
    keyword?: string;
    onKeywordChange?: (keyword: string) => void;
    onSearchClick?: (keyword: string) => void;
    onPageChange?: (page: number) => void;
    onPlusClick?: () => void;
}

interface IBotTableControlState {
    keyword?: string;
    queryUrl: string;
    page?: number;
    onKeywordChange?: (keyword: string) => void;
    onSearchClick?: (keyword?: string) => void;
    onPageChange?: (page: number) => void;
    onPlusClick?: () => void;
}

export class BotTableControl extends React.Component<IBotTableControlProp, IBotTableControlState> {
    constructor(prop: IBotTableControlProp) {
        super(prop);
        this.state = {
            keyword: prop.keyword,
            page: 1,
            queryUrl: prop.queryUrl,
            onKeywordChange: prop.onKeywordChange,
            onSearchClick: prop.onSearchClick,
            onPageChange: prop.onPageChange,
            onPlusClick: prop.onPlusClick,
        };
        this.keywordChange = this.keywordChange.bind(this);
        this.handleResetKeywordClick = this.handleResetKeywordClick.bind(this);
        this.handleSearchClick = this.handleSearchClick.bind(this);
        this.handlePageIncrease = this.handlePageIncrease.bind(this);
        this.handlePageDecrease = this.handlePageDecrease.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.handlePlusClick = this.handlePlusClick.bind(this);
    }

    public render() {
        return (
            <div className="row">
                <div className="col-md-5 col-sm-5 col-xs-12 form-group pull-left top_search">
                    <div className="input-group">
                        <input type="text" className="form-control" placeholder="Search ..." value={this.state.keyword} onChange={this.keywordChange} />
                        <span className="input-group-btn">
                            <button className="btn btn-default" type="button" onClick={this.handleResetKeywordClick}>X</button>
                            <button className="btn btn-default" type="button" onClick={this.handleSearchClick}>Go</button>
                        </span>
                    </div>
                </div>
                <div className="col-md-6 col-sm-6 col-xs-12 pull-right" style={{ padding: "0px 0px 0px 0px" }}>
                    <div className="row">
                        <div className="col-md-3 col-sm-3 col-xs-12 form-group">
                            <button type="button" className="btn btn-default form-control" onClick={this.handlePageDecrease}><i className="fa fa-backward" /></button>
                        </div>
                        <div className="col-md-3 col-sm-3 col-xs-12 form-group">
                            <input type="text" placeholder="#" className="form-control" value={this.state.page} onChange={this.handlePageChange} />
                        </div>
                        <div className="col-md-3 col-sm-3 col-xs-12 form-group">
                            <button type="button" className="btn btn-default form-control" onClick={this.handlePageIncrease}><i className="fa fa-forward" /></button>
                        </div>
                        <div className="col-md-3 col-sm-3 col-xs-12 form-group">
                            <button type="button" className="btn btn-info form-control" onClick={this.handlePlusClick}><i className="fa fa-plus" /></button>
                        </div>
                    </div>
                </div>
                <div className="clearfix" />
            </div>
        );
    }

    public componentWillReceiveProps(prop: IBotTableControlProp) {

    }

    private handlePageChange(e: any) {
        let currentPage = parseInt(e.target.value, 10);
        if (!currentPage || currentPage <= 0) {
            currentPage = 1;
        }
        if (currentPage !== this.state.page) {
            this.setState({ page: currentPage });
            if (this.state.onPageChange) {
                this.state.onPageChange(currentPage);
            }
        }
    }

    private handlePageIncrease() {
        let currentPage = 0;
        if (this.state.page) {
            currentPage = this.state.page;
        }
        currentPage = currentPage + 1;
        if (currentPage !== this.state.page) {
            this.setState({ page: currentPage });
            if (this.state.onPageChange) {
                this.state.onPageChange(currentPage);
            }
        }
    }

    private handlePageDecrease() {
        let currentPage = 0;
        if (this.state.page) {
            currentPage = this.state.page;
        }
        currentPage = currentPage - 1;
        if (currentPage <= 0) {
            currentPage = 1;
        }
        if (currentPage !== this.state.page) {
            this.setState({ page: currentPage });
            if (this.state.onPageChange) {
                this.state.onPageChange(currentPage);
            }
        }
    }

    private keywordChange(e: any) {
        this.setState({ keyword: e.target.value });
        if (this.state.onKeywordChange) {
            this.state.onKeywordChange(e.target.value);
        }
    }

    private handleSearchClick() {
        if (this.state.onSearchClick) {
            this.state.onSearchClick(this.state.keyword);
        }
    }

    private handleResetKeywordClick() {
        this.keywordChange({ target: { value: "" } });
    }

    private handlePlusClick() {
        if (this.state.onPlusClick) {
            this.state.onPlusClick();
        }
    }
}
