import { Router } from "express";
import questionRouter from "./question.router/questionRouter";
import userRouter from "./user.router/userRouter";

class RouterV1 {
    public router: Router;

    constructor(){
        this.router = Router();
        this.initRoutes();
    }

    initRoutes() {
        // Define your v1 routes here
        this.router.use('/questions', questionRouter);
        this.router.use('/users', userRouter);
    }
}

export default new RouterV1().router;