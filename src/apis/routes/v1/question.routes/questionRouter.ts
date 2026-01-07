import { Router } from "express";
import QuestionController from "../../../controllers/question.controller/QuestionController";

class questionRouter{
    public router: Router;

    constructor(){
        this.router = Router();
        this.initRoutes();
    }   
    initRoutes() {
        // Define question-related routes here
        this.router.post('/create/new/question', QuestionController.createQuestion);
        this.router.get('/list/all/questions', QuestionController.getAllQuestions);
        this.router.put('/update/question/:id', QuestionController.updateQuestion);
        this.router.delete('/delete/question/:id', QuestionController.deleteQuestion);
        this.router.get('/get/question/:id', QuestionController.listQuestions);   
    }
}
export default new questionRouter().router;