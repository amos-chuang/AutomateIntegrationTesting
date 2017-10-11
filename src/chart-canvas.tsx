import * as ChartJs from "chart.js";
import * as React from "react";
import * as ReactDOM from "react-dom";

export interface IChartProps {
    name: string;
    width: number;
    height: number;
    config: ChartJs.ChartConfig;
}

export interface IChartState {
    name: string;
    width: number;
    height: number;
    lineConfig: ChartJs.ChartConfig;
}

export class ChartCanvas extends React.Component<IChartProps, IChartState> {
    constructor(myProps: IChartProps) {
        super(myProps);
        this.state = {
            name: this.props.name,
            width: this.props.width,
            height: this.props.height,
            lineConfig: this.props.config,
        };
    }

    public componentDidMount() {
        const canvas = this.context as HTMLCanvasElement;
        const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
        const myLineChart = new ChartJs.Chart(ctx, this.state.lineConfig);
    }

    public render() {
        const style = {
            width: this.state.width,
            height: this.state.height,
        };
        return (<div style={style}><canvas id={this.state.name} ref={(e) => this.context = e} /></div>);
    }
}
