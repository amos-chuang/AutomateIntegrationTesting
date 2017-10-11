"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Service {
    constructor() {
        this.schedule = [];
    }
    start() {
        setInterval(() => { this.run(); }, 1000);
    }
    run() {
        const currentDate = new Date();
        this.schedule.forEach((job) => {
            if (job) {
                if (job.lastExecuteDate) {
                    const tempCurrentDate = currentDate;
                    const tempLastExecuteDate = job.lastExecuteDate;
                    const diffSec = (tempCurrentDate - tempLastExecuteDate) / 1000;
                    if (diffSec > job.intervalSec) {
                        console.log("[JOB] fn : " + job.fn.name + " DiffSec : " + diffSec + " LastExecuteDate : " + job.lastExecuteDate + " Now : " + new Date());
                        job.lastExecuteDate = new Date();
                        job.fn();
                    }
                }
                else {
                    job.lastExecuteDate = new Date();
                }
            }
        });
    }
}
exports.Service = Service;
//# sourceMappingURL=job-scheduler-service.js.map