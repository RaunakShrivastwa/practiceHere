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
    }
}

export default new testCaseRouter().router;