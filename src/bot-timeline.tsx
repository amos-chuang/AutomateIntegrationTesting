import * as React from "react";
import * as ReactDOM from "react-dom";

export interface IBotTimelineProp {
    data: {};
}

export interface IBotTimelineState {
    data: {};
}

export class BotTimeline extends React.Component<IBotTimelineProp, IBotTimelineState> {
    constructor(prop: IBotTimelineProp) {
        super(prop);
        this.state = {
            data: prop.data,
        };
    }
    public render() {
        return (
            <div className="col-md-6 col-sm-6 col-xs-12">
                <div className="x_panel">
                    <div className="x_content">
                        <ul className="list-unstyled timeline">
                            <li>
                                <div className="block">
                                    <div className="tags">
                                        <a href="" className="tag">
                                            <span>Entertainment</span>
                                        </a>
                                    </div>
                                    <div className="block_content">
                                        <h2 className="title">
                                            <a>Who Needs Sundance When You’ve Got&nbsp;Crowdfunding?</a>
                                        </h2>
                                        <div className="byline">
                                            <span>13 hours ago</span> by <a>Jane Smith</a>
                                        </div>
                                        <p className="excerpt">Film festivals used to be do-or-die moments for movie makers. They were where you met the producers that could fund your project, and if the buyers liked your flick, they’d pay to Fast-forward and… <a>Read&nbsp;More</a>
                                        </p>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div className="block">
                                    <div className="tags">
                                        <a href="" className="tag">
                                            <span>Entertainment</span>
                                        </a>
                                    </div>
                                    <div className="block_content">
                                        <h2 className="title">
                                            <a>Who Needs Sundance When You’ve Got&nbsp;Crowdfunding?</a>
                                        </h2>
                                        <div className="byline">
                                            <span>13 hours ago</span> by <a>Jane Smith</a>
                                        </div>
                                        <p className="excerpt">Film festivals used to be do-or-die moments for movie makers. They were where you met the producers that could fund your project, and if the buyers liked your flick, they’d pay to Fast-forward and… <a>Read&nbsp;More</a>
                                        </p>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div className="block">
                                    <div className="tags">
                                        <a href="" className="tag">
                                            <span>Entertainment</span>
                                        </a>
                                    </div>
                                    <div className="block_content">
                                        <h2 className="title">
                                            <a>Who Needs Sundance When You’ve Got&nbsp;Crowdfunding?</a>
                                        </h2>
                                        <div className="byline">
                                            <span>13 hours ago</span> by <a>Jane Smith</a>
                                        </div>
                                        <p className="excerpt">Film festivals used to be do-or-die moments for movie makers. They were where you met the producers that could fund your project, and if the buyers liked your flick, they’d pay to Fast-forward and… <a>Read&nbsp;More</a>
                                        </p>
                                    </div>
                                </div>
                            </li>
                        </ul>

                    </div>
                </div>
            </div>
        );
    }
}
