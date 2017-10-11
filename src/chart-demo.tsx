import { ChartCanvas } from "chart-canvas";
import * as ChartJs from "chart.js";
import * as React from "react";
import * as ReactDOM from "react-dom";

/*const App = () => {
  return (
    <div>
      <p>Hello world...!!</p>
      <LineChart name="abc" width={500} height={500} />
    </div>
  )
}*/

export class ChartDemo extends React.Component<any, any> {
    constructor() {
        super();
        this.state = { userInput: 0 };
        this.handleInputChange = this.handleInputChange.bind(this);
    }
    public handleInputChange(e: any) {
        this.state = { userInput: e.target.value };
        this.setState({ userInput: this.state.userInput });
    }
    public render() {
        // line
        const lineDatasets: ChartJs.ChartDataSet[] = new Array();
        lineDatasets.push({
            label: "My First Dataset",
            data: [55, 49, 70, 71, 46, 45, 30],
            fill: "false",
            borderColor: ["rgb(75, 192, 192)"],
            lineTension: 0.2,
        });
        lineDatasets.push({
            label: "My First Dataset",
            data: [65, 59, 80, 81, 56, 55, 40],
            fill: "false",
            borderColor: ["rgb(65, 180, 192)"],
            lineTension: 0.2,
        });
        const lineData: ChartJs.ChartData = {
            labels: ["January", "February", "March", "April", "May", "June", "July"],
            datasets: lineDatasets,
        };
        const lineConfig: ChartJs.ChartConfig = {
            type: "line",
            data: lineData,
        };
        // bar
        const barDatasets: ChartJs.ChartDataSet[] = new Array();
        barDatasets.push({
            label: "A Bar",
            data: [55],
            backgroundColor: ["rgb(150, 75, 75)"],
        });
        barDatasets.push({
            label: "B Bar",
            data: [65],
            fill: "true",
            backgroundColor: ["rgb(60, 120, 180)"],
        });
        barDatasets.push({
            label: "C Bar",
            data: [75],
            backgroundColor: ["rgb(65, 180, 100)"],
        });
        const barData: ChartJs.ChartData = {
            labels: ["Bar Test"],
            datasets: barDatasets,
        };
        const barConfig: ChartJs.ChartConfig = {
            type: "bar",
            data: barData,
        };
        // radar
        const radarDatasets: ChartJs.ChartDataSet[] = new Array();
        radarDatasets.push({
            label: "Zero",
            data: [0],
        });
        radarDatasets.push({
            label: "Radar",
            data: [6, 8, 7, 8, 6, 5],
            backgroundColor: ["rgba(180, 65, 65, 0.5)"],
        });
        const radarData: ChartJs.ChartData = {
            labels: ["A", "B", "C", "D", "E", "F"],
            datasets: radarDatasets,
        };
        const radarOption: ChartJs.ChartOptions = {
            Scale: {
                display: false,
            },
        };
        const radarConfig: ChartJs.ChartConfig = {
            type: "radar",
            data: radarData,
            options: radarOption,
        };
        // pie
        const pieDatasets: ChartJs.ChartDataSet[] = new Array();
        pieDatasets.push({
            data: [6, 8, 5],
            backgroundColor: ["rgba(180, 65, 65, 0.6)", "rgba(65, 180, 65, 0.6)", "rgba(65, 65, 180, 0.6)"],
        });
        const pieData: ChartJs.ChartData = {
            labels: ["A", "B", "C"],
            datasets: pieDatasets,
        };
        const pieConfig: ChartJs.ChartConfig = {
            type: "pie",
            data: pieData,
        };
        // doughnut
        const doughnutDatasets: ChartJs.ChartDataSet[] = new Array();
        doughnutDatasets.push({
            data: [6, 8, 5],
            backgroundColor: ["rgba(180, 65, 65, 0.6)", "rgba(65, 180, 65, 0.6)", "rgba(65, 65, 180, 0.6)"],
        });
        const doughnutData: ChartJs.ChartData = {
            labels: ["A", "B", "C"],
            datasets: doughnutDatasets,
        };
        const doughnutConfig: ChartJs.ChartConfig = {
            type: "doughnut",
            data: doughnutData,
        };
        // mixed
        const mixDatasets: ChartJs.ChartDataSet[] = new Array();
        mixDatasets.push({
            label: "Mixed Line",
            type: "line",
            data: [55, 49, 70, 71, 46, 45, 30],
            fill: "false",
            borderColor: ["rgb(75, 192, 192)"],
            lineTension: 0.2,
        });
        mixDatasets.push({
            label: "Mixed Bar",
            data: [65, 59, 80, 81, 56, 55, 40],
            fill: "false",
            backgroundColor: "rgba(244, 191, 66, 0.8)",
            lineTension: 0.2,
        });
        const mixData: ChartJs.ChartData = {
            labels: ["January", "February", "March", "April", "May", "June", "July"],
            datasets: mixDatasets,
        };
        const mixConfig: ChartJs.ChartConfig = {
            type: "bar",
            data: mixData,
        };
        return (
            <div>
                <input type="text" onChange={this.handleInputChange} />
                <span>{this.state.userInput}</span>
                <hr />
                <ChartCanvas name="firstLineChart" width={600} height={300} config={lineConfig} />
                <hr />
                <ChartCanvas name="firstBarChart" width={500} height={250} config={barConfig} />
                <hr />
                <ChartCanvas name="firstRadarChart" width={250} height={250} config={radarConfig} />
                <hr />
                <ChartCanvas name="firstPieChart" width={250} height={250} config={pieConfig} />
                <hr />
                <ChartCanvas name="firstDoughnutChart" width={250} height={250} config={doughnutConfig} />
                <hr />
                <ChartCanvas name="firstMixedChart" width={500} height={250} config={mixConfig} />
            </div>
        );
    }
}

ReactDOM.render(<ChartDemo />, document.getElementById("app"));
