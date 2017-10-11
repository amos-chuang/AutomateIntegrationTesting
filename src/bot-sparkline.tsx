import * as React from "react";
import * as ReactDOM from "react-dom";

export interface IBotSparklineProp {
    id: string;
    type: string;
    data: number[];
    height?: number;
    graphHeight?: number;
    graphWidth?: number;
    paddingTop?: number;
}

export interface IBotSparklineState {
    id: string;
    type: string;
    data: number[];
    height?: number;
    graphHeight?: number;
    graphWidth?: number;
    paddingTop?: number;
}

export class BotSparkline extends React.Component<IBotSparklineProp, IBotSparklineState> {
    constructor(prop: IBotSparklineProp) {
        super(prop);
        this.initState(prop);
    }
    public render() {
        console.log(this.state);
        const cssStyle = {
            height: this.state.height + "px",
        };
        const spanStyle = {
            paddingTop: this.state.paddingTop + "px",
            display: "inline-block",
        };
        return (
            <div className="col-md-3 col-sm-3 col-xs-6 tile_stats_count" style={cssStyle}>
                <span id={this.state.id} className="graph" style={spanStyle}>
                    <canvas width="200" height="60" style={{ display: "inline-block", verticalAlign: "top", width: "94px", height: "30px" }} />
                </span>
            </div>
        );
    }
    public componentDidMount() {
        this.drawGraph();
    }
    public componentWillReceiveProps(nextProp: IBotSparklineProp) {
        this.initState(nextProp);
        this.drawGraph();
    }
    private initState(prop: IBotSparklineProp) {
        let heightState = 86;
        if (prop.height) {
            heightState = prop.height as number;
        }
        let paddingTopState = 35;
        if (prop.paddingTop) {
            paddingTopState = prop.paddingTop as number;
        }
        let graphHeightState = 40;
        if (prop.graphHeight) {
            graphHeightState = prop.graphHeight;
        }
        let graphWidthState = 200;
        if (prop.graphWidth) {
            graphWidthState = prop.graphWidth;
        }
        this.state = {
            id: prop.id,
            type: prop.type,
            data: prop.data,
            height: heightState,
            graphHeight: graphHeightState,
            graphWidth: graphWidthState,
            paddingTop: paddingTopState,
        };
    }
    private drawGraph() {
        $(() => {
            $("#" + this.state.id).sparkline(this.state.data, {
                type: this.state.type,
                height: this.state.graphHeight,
                width: this.state.graphWidth,
                barWidth: 8,
                colorMap: {
                    7: "#a1a1a1",
                },
                barSpacing: 2,
                barColor: "#26B99A",
                lineColor: "#26B99A",
                fillColor: "#ffffff",
                lineWidth: 3,
                spotColor: "#34495E",
                minSpotColor: "#34495E",
            });
        });
    }
}
