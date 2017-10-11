import * as RST from "../../node_modules/@types/react-sortable-tree/index";

export interface ITreeItem extends RST.TreeItem {
    taskID?: string;
    seq: number;
}

