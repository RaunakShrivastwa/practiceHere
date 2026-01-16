import { Router } from "express";
import questionRouter from "./question.routes/questionRouter";
import testCaseRouter from "./testCaseRouter/testCaseRouter";

class RouterV1 {
    public router: Router;

    constructor(){
        this.router = Router();
        this.initRoutes();
    }

    initRoutes() {
        // Define your v1 routes here
        this.router.use('/questions', questionRouter);
        this.router.use('/testcases', testCaseRouter);
    }
}

export default new RouterV1().router;