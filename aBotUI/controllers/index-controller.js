"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Controller {
    constructor(req, res) {
        this.req = req;
        this.res = res;
    }
    index() {
        this.res.render("index", { title: "IndexController" });
    }
    dashboard() {
        this.res.render("dashboard");
    }
    chartDemo() {
        this.res.render("chart-demo", { title: "Chart Demo" });
    }
}
exports.Controller = Controller;
//# sourceMappingURL=index-controller.js.map