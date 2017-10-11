import * as React from "react";
import * as ReactDOM from "react-dom";

interface ITaskEditFormProp {
    isShow: boolean;
    data: {
        _id: string;
        name: string;
        description: string;
        type: string;
        taskFile: {
            name: string;
            path: string;
        };
        configFile: {
            name: string;
            path: string;
        };
    };
}

interface ITaskEditFormState {
    isShow: boolean;
    data: {
        _id: string;
        name: string;
        description: string;
        type: string;
        taskFile: {
            name: string;
            path: string;
        };
        configFile: {
            name: string;
            path: string;
        };
    };
}

export class TaskEditForm extends React.Component<ITaskEditFormProp, ITaskEditFormState> {
    constructor(prop: ITaskEditFormProp) {
        super(prop);
        this.refreshState(prop);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.handleCancelClick = this.handleCancelClick.bind(this);
    }
    public componentWillReceiveProps(nextProp: ITaskEditFormProp) {
        this.refreshState(nextProp);
    }
    public render() {
        let displayType = "";
        if (this.state.isShow === false) {
            displayType = "none";
        }
        const cssStyle = {
            display: displayType,
        };
        let taskFileName = "";
        let taskFilePath = "";
        if (this.state.data.taskFile) {
            taskFileName = this.state.data.taskFile.name;
            taskFilePath = this.state.data.taskFile.path.replace("./public", "");
        }
        let configFileName = "";
        let configFilePath = "";
        if (this.state.data.configFile) {
            configFileName = this.state.data.configFile.name;
            configFilePath = this.state.data.configFile.path.replace("./public", "");
        }
        return (<form id={"task-edit"} data-parsley-validate={""} className={"form-horizontal form-label-left"} style={cssStyle} method={"POST"} encType={"multipart/form-data"} action={"/task/update"}>
            <div className={"form-group"}>
                <label className={"control-label col-md-3 col-sm-3 col-xs-12"} htmlFor={"name"}>ID
                </label>
                <div className="col-md-6 col-sm-6 col-xs-12">
                    <input type="text" name="_id" className="form-control col-md-7 col-xs-12" value={this.state.data._id} readOnly={true} />
                </div>
            </div>
            <div className={"form-group"}>
                <label className={"control-label col-md-3 col-sm-3 col-xs-12"} htmlFor={"name"}>Name <span className="required">*</span>
                </label>
                <div className="col-md-6 col-sm-6 col-xs-12">
                    <input type="text" name="name" required={true} className="form-control col-md-7 col-xs-12" value={this.state.data.name} onChange={this.handleNameChange} />
                </div>
            </div>
            <div className={"form-group"}>
                <label className={"control-label col-md-3 col-sm-3 col-xs-12"} htmlFor={"description"}>Description <span className="required">*</span>
                </label>
                <div className="col-md-6 col-sm-6 col-xs-12">
                    <textarea name="description" required={true} className="form-control col-md-7 col-xs-12" value={this.state.data.description} onChange={this.handleDescriptionChange} />
                </div>
            </div>
            <div className={"form-group"}>
                <label className={"control-label col-md-3 col-sm-3 col-xs-12"} style={{ paddingTop: "0px" }} htmlFor={"task-type"}>Type <span className="required">*</span>
                </label>
                <div className="col-md-6 col-sm-6 col-xs-12 taskTypeRadio">
                    <span>
                        <label className="">
                            <div className="iradio_flat-green checked" style={{ position: "relative" }}>
                                <input type={"radio"} className={"flat"} defaultChecked={true} name={"type"} style={{ position: "absolute", opacity: 0 }} value="Newman" />
                                <ins className="iCheck-helper" style={{ position: "absolute", top: "0%", left: "0%", display: "block", width: "100%", height: "100%", margin: "0px", padding: "0px", background: "rgb(255, 255, 255)", border: "0px", opacity: 0 }} />
                            </div> Newman
                        </label>
                    </span>
                    <span style={{ paddingLeft: "15px" }}>
                        <label className="">
                            <div className="iradio_flat-green" style={{ position: "relative" }}>
                                <input type={"radio"} className={"flat"} name={"type"} style={{ position: "absolute", opacity: 0 }} value="Selenium" />
                                <ins className="iCheck-helper" style={{ position: "absolute", top: "0%", left: "0%", display: "block", width: "100%", height: "100%", margin: "0px", padding: "0px", background: "rgb(255, 255, 255)", border: "0px", opacity: 0 }} />
                            </div> Selenium
                        </label>
                    </span>
                </div>
            </div>
            <div className={"form-group"}>
                <label className="control-label col-md-3 col-sm-3 col-xs-12">Current Task File</label>
                <div className="col-md-6 col-sm-6 col-xs-12">
                    <a href={taskFilePath}><button type="button" className="btn btn-success">{taskFileName}</button></a>
                </div>
            </div>
            <div className={"form-group"}>
                <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor={"file"}>Task File
                </label>
                <div className="col-md-6 col-sm-6 col-xs-12">
                    <input type="file" name="taskfile" className="form-control col-md-7 col-xs-12" />
                </div>
            </div>
            <div className={"form-group"}>
                <label className="control-label col-md-3 col-sm-3 col-xs-12">Current Config File</label>
                <div className="col-md-6 col-sm-6 col-xs-12">
                    <a href={configFilePath}><button type="button" className="btn btn-info">{configFileName}</button></a>
                </div>
            </div>
            <div className={"form-group"}>
                <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor={"config-file"}>Config File
                </label>
                <div className="col-md-6 col-sm-6 col-xs-12">
                    <input type="file" name="configfile" required={false} className="form-control col-md-7 col-xs-12" />
                </div>
            </div>
            <div className="ln_solid" />
            <div className="col-md-5 col-sm-5 col-xs-12 form-group pull-right">
                <div className="">
                    <button type="button" className="btn btn-primary" onClick={this.handleCancelClick}>Cancel</button>
                    <button type="submit" className="btn btn-success" style={{ marginLeft: "20px" }}>Save</button>
                </div>
            </div>
        </form>);
    }
    private refreshState(prop: ITaskEditFormProp) {
        if (!prop || !prop.data || !prop.data.name) {
            let sw = false;
            if (prop && prop.isShow) {
                sw = prop.isShow;
            }
            prop = {
                isShow: sw,
                data: {
                    _id: "",
                    name: "",
                    description: "",
                    type: "Newman",
                    taskFile: {
                        name: "",
                        path: "",
                    },
                    configFile: {
                        name: "",
                        path: "",
                    },
                },
            };
        }
        if (this.state) {
            this.setState({ isShow: prop.isShow, data: prop.data });
        } else {
            this.state = {
                isShow: prop.isShow,
                data: prop.data,
            };
        }
        if (prop.data.type === "Selenium") {
            $(() => {
                if ($(".taskTypeRadio ins").length === 2) {
                    $($(".taskTypeRadio ins")[1]).click();
                } else if ($(".taskTypeRadio ins").length === 4) {
                    $($(".taskTypeRadio ins")[3]).click();
                }
            });
        } else {
            $(() => {
                if ($(".taskTypeRadio ins").length === 2) {
                    $($(".taskTypeRadio ins")[0]).click();
                } else if ($(".taskTypeRadio ins").length === 4) {
                    $($(".taskTypeRadio ins")[1]).click();
                }
            });
        }
    }
    private handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
        const nextData = this.state.data;
        nextData.name = e.target.value;
        this.setState({ data: nextData });
    }
    private handleDescriptionChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        const nextData = this.state.data;
        nextData.description = e.target.value;
        this.setState({ data: nextData });
    }
    private handleCancelClick() {
        window.location.href = "/task";
    }
}
