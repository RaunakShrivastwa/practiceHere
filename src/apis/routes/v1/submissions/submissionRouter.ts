import { Router } from "express";
import submissionController, { SubmissionController } from "../../../controllers/submission.controller/submissionController";

class submissionRouter{
    public router: Router;

    constructor(){
        this.router = Router();
        this.initRoutes();
    }   
    initRoutes() {
        // Define question-related routes here
        this.router.post('/problem/submit', submissionController.handleSubmission);
       
    }
}
export default new submissionRouter().router;