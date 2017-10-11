import * as React from "react";
import * as ReactDOM from "react-dom";
import * as QueryString from "query-string";

import { IMissionReportViewModel } from "../aBotUI/models/view_models/mission-report-view-model";

interface IMissionReportState {
    reportData: IMissionReportViewModel;
}

class MissionReport extends React.Component<any, IMissionReportState> {
    constructor(prop: any) {
        super(prop);
        this.state = {
            reportData: {
                mission: {} as any,
                data: [],
            },
        };
        const qs = QueryString.parse(window.location.search);
        let missionID = "";
        if (qs) {
            if (qs.id) {
                missionID = qs.id;
            }
        }
        this.getMissionReport(missionID);
    }
    public render() {
        console.log("render");
        console.log(this.state.reportData.data);
        let panels = [] as any[];
        if (this.state.reportData && this.state.reportData.data && this.state.reportData.data.map) {
            panels = this.state.reportData.data.map((rowData) => {
                switch (rowData.type.toLowerCase()) {
                    case "newman":
                        return this.generateNewmanPanel(this.state.reportData.mission, rowData);
                    case "selenium":
                        return this.generateSeleniumPanel(this.state.reportData.mission, rowData);
                }
            });
        }
        let hideError = true;
        if (this.state.reportData.mission.errorMsg) {
            hideError = false;
        }
        let isLoading = true;
        if (hideError === false || this.state.reportData.mission.completeDate) {
            isLoading = false;
        }
        return (
            <div className="panel">
                <div className="col-md-3 col-sm-3 col-xs-12 pull-right" hidden={isLoading === false}><img style={{ width: "100%", height: "auto" }} src="/images/loading02.gif" /></div>
                <h3><strong>{this.state.reportData.mission.name}</strong></h3>
                <br />
                <span className="panel-heading">Collection ID : {this.state.reportData.mission.collectionID}</span>
                <br />
                <span className="panel-heading">Task ID : {this.state.reportData.mission.taskID}</span>
                <br />
                <span className="panel-heading">Create : {new Date(this.state.reportData.mission.createdAt as Date).toLocaleString()}</span>
                <br />
                <span className="panel-heading">Queue : {new Date(this.state.reportData.mission.queueDate as Date).toLocaleString()}</span>
                <br />
                <span className="panel-heading" hidden={this.state.reportData.mission.completeDate === undefined}>End : {new Date(this.state.reportData.mission.completeDate as Date).toLocaleString()}</span>
                <br />
                <span className="panel-heading" style={{ color: "red" }} hidden={hideError}>Error : {this.state.reportData.mission.errorMsg}</span>
                <br />
                <span className="panel-heading" style={{ color: "red" }} hidden={hideError}>Error Date : {new Date(this.state.reportData.mission.errorDate as Date).toLocaleString()}</span>
                <hr />
                {panels}
            </div>);
    }
    private generateNewmanPanel(mission: any, rowData: any) {
        const items = rowData.data.map((item: any, i: number) => {
            let assertions = "";
            if (item.assertions) {
                assertions = item.assertions.map((assertion: any, assertionIndex: number) => {
                    return (
                        <tr key={rowData.id + "_assertion_" + assertionIndex}>
                            <td>_</td>
                            <td>_</td>
                            <td>Assertion</td>
                            <td>{assertion.assertion}</td>
                        </tr>
                    );
                });
            }
            return (
                <tbody key={rowData.id + "_" + i}>
                    <tr>
                        <td>_</td>
                        <td>_</td>
                        <td>Name</td>
                        <td>{item.name}</td>
                    </tr>
                    <tr>
                        <td>_</td>
                        <td>_</td>
                        <td>HTTP Method</td>
                        <td>{item.urlMethod}</td>
                    </tr>
                    <tr>
                        <td>_</td>
                        <td>_</td>
                        <td>URL</td>
                        <td>{item.url}</td>
                    </tr>
                    <tr>
                        <td>_</td>
                        <td>_</td>
                        <td>Response Status</td>
                        <td>{item.responseStatus}</td>
                    </tr>
                    <tr>
                        <td>_</td>
                        <td>_</td>
                        <td>Response Code</td>
                        <td>{item.responseCode}</td>
                    </tr>
                    <tr>
                        <td>_</td>
                        <td>_</td>
                        <td>Response Time</td>
                        <td>{item.responseTime} ms</td>
                    </tr>
                    <tr>
                        <td>_</td>
                        <td>_</td>
                        <td>Response Size</td>
                        <td>{item.responseSize} ch</td>
                    </tr>
                    <tr>
                        <td>_</td>
                        <td>_</td>
                        <td>Response Data</td>
                        <td>{item.responseData}</td>
                    </tr>
                    {assertions}
                </tbody>);
        });
        const passedCountStyle = {} as any;
        const failedCountStyle = {} as any;
        if (rowData.failed > 0) {
            failedCountStyle.backgroundColor = "red";
            failedCountStyle.color = "white";
        } else {
            passedCountStyle.backgroundColor = "green";
            passedCountStyle.color = "white";
        }
        return (
            <div className="panel" key={rowData.id}>
                <h4 className="panel-heading"><strong>Newman _ {rowData.name}</strong></h4>
                <div className="panel-body">
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Key</th>
                                <th>Value</th>
                                <th>Test Key</th>
                                <th>Test Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Name</td>
                                <td>{rowData.name}</td>
                                <td>_</td>
                                <td>_</td>
                            </tr>
                            <tr>
                                <td>Passed</td>
                                <td style={passedCountStyle}>{rowData.passed}</td>
                                <td>_</td>
                                <td>_</td>
                            </tr>
                            <tr>
                                <td>Failed</td>
                                <td style={failedCountStyle}>{rowData.failed}</td>
                                <td>_</td>
                                <td>_</td>
                            </tr>
                        </tbody>
                        {items}
                    </table>
                </div>
            </div >);
    }
    private generateSeleniumPanel(mission: any, rowData: any) {
        const suites = rowData.data.map((item: any, i: number) => {
            if (item.tests && item.tests.length > 0) {
                const result = item.tests.map((test: any, testIndex: number) => {
                    const stateStyle = {} as any;
                    if (test.state === "pass") {
                        stateStyle.backgroundColor = "green";
                        stateStyle.color = "white";
                    } else {
                        stateStyle.backgroundColor = "red";
                        stateStyle.color = "white";
                    }
                    return (<tbody key={rowData.id + "_" + i}>
                        <tr>
                            <td>Name</td>
                            <td>{item.name}</td>
                            <td>_</td>
                            <td>_</td>
                        </tr>
                        <tr>
                            <td>Duration</td>
                            <td>{item.duration}</td>
                            <td>_</td>
                            <td>_</td>
                        </tr>
                        <tr>
                            <td>Start</td>
                            <td>{item.start}</td>
                            <td>_</td>
                            <td>_</td>
                        </tr>
                        <tr>
                            <td>End</td>
                            <td>{item.end}</td>
                            <td>_</td>
                            <td>_</td>
                        </tr>
                        <tr >
                            <td>State</td>
                            <td style={stateStyle}>{test.state}</td>
                            <td>_</td>
                            <td>_</td>
                        </tr>
                        <tr >
                            <td>_</td>
                            <td>_</td>
                            <td>Name</td>
                            <td>{test.name}</td>
                        </tr>
                        <tr >
                            <td>_</td>
                            <td>_</td>
                            <td>Duration</td>
                            <td>{test.duration}</td>
                        </tr>
                        <tr >
                            <td>_</td>
                            <td>_</td>
                            <td>Start</td>
                            <td>{test.start}</td>
                        </tr>
                        <tr >
                            <td>_</td>
                            <td>_</td>
                            <td>End</td>
                            <td>{test.end}</td>
                        </tr>
                        <tr hidden={test.error === undefined}>
                            <td>_</td>
                            <td>_</td>
                            <td>Error</td>
                            <td>{test.error}</td>
                        </tr>
                        <tr hidden={test.standardError === undefined}>
                            <td>_</td>
                            <td>_</td>
                            <td>Standard Error</td>
                            <td>{test.standardError}</td>
                        </tr>
                    </tbody>);
                });
                return (result);
            } else {
                return;
            }
        });
        let screenshots = "";
        if (rowData.images && rowData.images.screenshots) {
            screenshots = rowData.images.screenshots.map((imgSrc: string, i: number) =>
                <a href={imgSrc} target="_blank" key={imgSrc}>
                    <hr />
                    <img src={imgSrc} style={{ width: "90%", height: "auto" }} />
                    <hr />
                </a>);
        }
        return (
            <div className="panel" key={rowData.id}>
                <h4 className="panel-heading"><strong>Selenium _ {rowData.name}</strong></h4>
                <div className="panel-body">
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Key</th>
                                <th>Value</th>
                                <th>Test Key</th>
                                <th>Test Value</th>
                            </tr>
                        </thead>
                        {suites}
                    </table>
                    <span className="panel-heading">Screenshot</span>
                    {screenshots}
                </div>
            </div >);
    }
    private getMissionReport(missionID: string) {
        const queryData = {
            id: missionID,
        };
        $.ajax({
            method: "POST",
            url: "/mission/getReport",
            contentType: "application/json",
            data: JSON.stringify(queryData),
            success: (res) => {
                console.log(res);
                this.parseReportData(res);
            },
        });
    }
    private parseReportData(res: any) {
        if (res && res.mission && res.data) {
            const nextReportData = {} as IMissionReportViewModel;
            nextReportData.mission = res.mission;
            nextReportData.data = res.data;
            if (!nextReportData.mission.completeDate && !nextReportData.mission.errorMsg) {
                console.log("refresh after 5 sec");
                setTimeout(() => {
                    this.getMissionReport(nextReportData.mission._id);
                }, 5000);
            }
            this.setState({ reportData: nextReportData });
        }
    }
}

ReactDOM.render(<MissionReport />, document.getElementById("app"));
