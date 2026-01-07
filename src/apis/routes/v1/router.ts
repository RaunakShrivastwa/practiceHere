import { Router } from "express";
import questionRouter from "./question.routes/questionRouter";

class RouterV1 {
    public router: Router;

    constructor(){
        this.router = Router();
        this.initRoutes();
    }

    initRoutes() {
        // Define your v1 routes here
        this.router.use('/questions', questionRouter);
    }
}

export default new RouterV1().router;