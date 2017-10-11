import * as React from "react";
import * as ReactDOM from "react-dom";
import { BotCounter } from "./bot-counter";
import { BotSparkline } from "./bot-sparkline";
import { BotHistoryChart } from "./bot-history-chart";
import { IMissionQueueStatusViewModel } from "../aBotUI/models/view_models/mission-queue-status-view-model";
import { IMissionSlotStatusViewModel } from "../aBotUI/models/view_models/mission-slot-status-view-model";

interface IDashboardState {
    missionSlotStatus: IMissionSlotStatusViewModel;
    missionQueueStatus: IMissionQueueStatusViewModel;
}

class Dashboard extends React.Component<any, IDashboardState> {
    constructor(prop: any) {
        super(prop);
        this.state = {
            missionSlotStatus: {
                capacity: 0,
                size: 0,
            } as IMissionSlotStatusViewModel,
            missionQueueStatus: {
                size: 0,
            } as IMissionQueueStatusViewModel,
        };
        this.refresh();
    }
    public render() {
        return (
            <div>
                <div className="row">
                    <BotCounter title={"Mission Slot Size"} subTitle={"capacity : " + this.state.missionSlotStatus.capacity} count={this.state.missionSlotStatus.size} />
                    <BotSparkline id={"missionSlotSizeSparkline"} type={"bar"} data={this.state.missionSlotStatus.delta} />
                    <BotCounter title={"Mission Queue Size"} subTitle={""} count={this.state.missionQueueStatus.size} />
                    <BotSparkline id={"missionQueueSizeSparkline"} type={"line"} data={this.state.missionQueueStatus.delta} />

                </div>
                <div className="col-md-12 col-sm-12 col-xs-12">
                    <BotHistoryChart />
                </div>
            </div>
        );
    }
    private refresh() {
        this.getSlotStatus();
        this.getQueueStatus();
    }
    private getSlotStatus() {
        $.ajax({
            method: "GET",
            url: "/missionSlot/status",
            contentType: "application/json",
            success: (res) => {
                this.setState({ missionSlotStatus: res });
            },
        });
    }
    private getQueueStatus() {
        $.ajax({
            method: "GET",
            url: "/missionQueue/status",
            contentType: "application/json",
            success: (res) => {
                this.setState({ missionQueueStatus: res });
            },
        });
    }
}

ReactDOM.render(<Dashboard />, document.getElementById("app"));
