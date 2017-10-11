import * as React from "react";
import * as ReactDOM from "react-dom";
import { BotTable } from "./bot-table";
import { CollectionEditForm } from "./collection-edit-form";

interface ICollectionEditorState {
    data: any;
}

class CollectionEditor extends React.Component<any, ICollectionEditorState> {
    constructor(prop: any) {
        super(prop);
        this.state = {
            data: {},
        };
        const idIndex = window.location.href.indexOf("id=");
        if (idIndex >= 0) {
            let collectionID = window.location.href.substr(idIndex + 3);
            const andIndex = collectionID.indexOf("&");
            if (andIndex >= 0) {
                collectionID = collectionID.substr(0, andIndex);
            }
            this.getCollectionData(collectionID);
        }
    }
    public render() {
        return (
            <div>
                <CollectionEditForm isShow={true} data={this.state.data} />
            </div>
        );
    }
    private getCollectionData(collectionID: string) {
        const condition = {
            id: collectionID,
        };
        $.ajax({
            method: "POST",
            url: "/collection/query",
            contentType: "application/json",
            data: JSON.stringify(condition),
            success: (res) => {
                if (res && res.length === 1) {
                    this.setState({ data: res[0] });
                }
            },
        });
    }
    private handlePlusClick() {

    }
}

ReactDOM.render(<CollectionEditor />, document.getElementById("app"));
