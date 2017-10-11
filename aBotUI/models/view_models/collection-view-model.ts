export interface ICollectionViewModel {
    _id: string;
    id: string;
    name: string;
    description: string;
    steps: {
        collectionID: string;
        subCollectionID?: string;
        subCollectionName?: string;
        taskID?: string;
        taskName?: string;
        seq: number;
    }[];
}
