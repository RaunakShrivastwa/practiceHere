import { Request, Response } from "express";
import { ServiceImpl } from "../../Services/ServiceImpl";
import { Question } from "../../models/question.model/Question";
let service: ServiceImpl<Question> = new ServiceImpl<Question>("questions");
class QuestionController {

    async createQuestion(req:Request,res:Response) {
        try{
            const questionData = req.body;
            if(!questionData){
                return res.status(400).json({message: "Invalid question data"});
            }
            const newQuestion = await service.create(questionData);
            return res.status(201).json(newQuestion);
        }catch(err){
            return res.status(500).json({message: `Internal Server Error : ${err}`});
        }
    }

    async getAllQuestions(req:Request,res:Response) {
        try{
            return res.status(200).json(await service.findAll());
        }catch(err){
            return res.status(500).json({message: `Internal Server Error : ${err}`});
        }
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