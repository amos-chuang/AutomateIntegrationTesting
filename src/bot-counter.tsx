import * as React from "react";
import * as ReactDOM from "react-dom";

export interface IBotCounterProp {
    title: string;
    subTitle: string;
    count: number;
}

export interface IBotCounterState {
    title: string;
    subTitle: string;
    count: number;
}

export class BotCounter extends React.Component<IBotCounterProp, IBotCounterState> {
    constructor(prop: IBotCounterProp) {
        super(prop);
        this.initState(prop);
    }
    public render() {
        return (
            <div className="col-md-3 col-sm-3 col-xs-6 tile_stats_count">
                <span className="count_top"><i className="fa fa-clock-o" /> {this.state.title}</span>
                <div className="count green" style={{ textAlign: "center" }}>{this.state.count}</div>
                <div style={{ textAlign: "right" }}><span className="count_bottom"> {this.state.subTitle}</span></div>
            </div>
        );
    }
    public componentWillReceiveProps(nextProp: IBotCounterProp) {
        this.initState(nextProp);
    }
    private initState(prop: IBotCounterProp) {
        let nextSubTitle = ".";
        if (prop.subTitle && prop.subTitle.length > 0) {
            nextSubTitle = prop.subTitle;
        }
        this.state = {
            title: prop.title,
            subTitle: nextSubTitle,
            count: prop.count,
        };
    }
}
