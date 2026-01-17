import { Router } from "express";
import testCaseController from "../../../controllers/testcase.controler/testCaseController";

class testCaseRouter{
    public router: Router;

    constructor(){
        this.router = Router();
        this.initRoutes();
    }

    initRoutes(){
        this.router.post('/create/testCases/:questionId', testCaseController.createTestCase);
        this.router.get('/all', testCaseController.getAlltestCases);
        this.router.get('/by/question/id/:id',testCaseController.getTestCaseByQuestionId);
    }
}

export default new testCaseRouter().router;