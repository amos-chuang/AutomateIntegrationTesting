import * as React from "react";
import * as ReactDom from "react-dom";

export interface INotificationProp {
    type?: string;
    msg?: string;
}

export interface INotificationState {
    type?: string;
    msg?: string;
}

export class Notification extends React.Component<INotificationProp, INotificationState> {
    constructor(prop: INotificationProp) {
        super(prop);
        this.state = {
            type: prop.type,
            msg: prop.msg,
        };
    }
    public render() {
        if (this.state.msg && this.state.msg.length > 0) {
            setTimeout(() => {
                this.setState({ msg: "" });
            }, 3000);
            let notifyType = this.state.type;
            if (!notifyType) {
                notifyType = "info";
            }
            const notifyClass = "alert alert-" + notifyType + " alert-dismissible fade in";
            return (
                <div className={notifyClass} role="alert">
                    <button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                    </button>
                    <strong>{this.state.msg}</strong>
                </div>
            );
        } else {
            return (<div />);
        }
    }
    public componentWillReceiveProps(nextProp: INotificationProp) {
        this.setState({ type: nextProp.type, msg: nextProp.msg });
    }
}
