export interface IMissionReportViewModel {
    mission: {
        _id: string;
        name?: string;
        collectionID?: string;
        taskID?: string;
        queueDate?: Date;
        completeDate?: Date;
        errorMsg?: string;
        errorDate?: Date;
        createdAt?: Date;
        updatedAt?: Date;
    };
    data: any[];
}
