import { Router } from "express";
import questionRouter from "./v1/question.router/questionRouter";
import userRouter from "./v1/user.router/userRouter";
import testCaseRouter from "./v1/testCaseRouter/testCaseRouter";
import attemptRouter from "./v1/attempt.router/attemptRouter";
import submissionRouter from "./v1/submissions/submissionRouter";
import { authMiddleware } from "../middlewares/auth.middleware";

class RouterV1 {
    public router: Router;

    constructor() {
        this.router = Router();
        this.initRoutes();
    }

    initRoutes() {
        // Define your v1 routes here
        this.router.use('/questions', questionRouter);
        this.router.use('/users', userRouter);
        this.router.use('/attempts', attemptRouter);
        this.router.use('/testcases', testCaseRouter);
        this.router.use('/submission', submissionRouter);
    }
}

export default new RouterV1().router;