import { Request, Response } from "express";
import Service from "../../services/question.service/QuestionServiceImpl";
class QuestionController {

    async createQuestion(req:Request,res:Response) {
        try{
            const questionData = req.body;
            const newQuestion = await Service.createQuestion(questionData);
            return res.status(201).json(newQuestion);
        }catch(err){
            return res.status(500).json({message: "Internal Server Error"});
        }
    }

    getQuestion() {
        // Implementation for retrieving a question
        // Call the service method to retrieve a question
    }

    updateQuestion() {
        // Implementation for updating a question
        // Call the service method to update a question
    }

    deleteQuestion() {
        // Implementation for deleting a question
        // Call the service method to delete a question
    }

    listQuestions() {
        // Implementation for listing all questions
        // Call the service method to list all questions
    }

}

export default new QuestionController();