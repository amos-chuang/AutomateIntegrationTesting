import * as MissionRunnerService from "./mission-runner-service";
import * as StatisticsService from "./statistics-service";

interface ISchedule {
    intervalSec: number;
    fn: () => any;
    lastExecuteDate?: Date;
}

export class Service {
    private schedule: ISchedule[] = [
        /*{
            intervalSec: 10,
            fn: new MissionRunnerService.Service().run,
        },
        {
            intervalSec: 10,
            fn: new StatisticsService.Service().recordMissionSlotStatus,
        },
        {
            intervalSec: 10,
            fn: new StatisticsService.Service().recordMissionQueueStatus,
        },
        {
            intervalSec: 12 * 60 * 60,
            fn: new StatisticsService.Service().rotateRecord,
        }*/];
    public start() {
        setInterval(() => { this.run(); }, 1000);
    }
    private run() {
        const currentDate = new Date();
        this.schedule.forEach((job) => {
            if (job) {
                if (job.lastExecuteDate) {
                    const tempCurrentDate = currentDate as any;
                    const tempLastExecuteDate = job.lastExecuteDate as any;
                    const diffSec = (tempCurrentDate - tempLastExecuteDate) / 1000;
                    if (diffSec > job.intervalSec) {
                        console.log("[JOB] fn : " + job.fn.name + " DiffSec : " + diffSec + " LastExecuteDate : " + job.lastExecuteDate + " Now : " + new Date());
                        job.lastExecuteDate = new Date();
                        job.fn();
                    }
                } else {
                    job.lastExecuteDate = new Date();
                }
            }
        });
    }
}
