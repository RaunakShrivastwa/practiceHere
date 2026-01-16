import { Request,Response } from "express";
import { Question } from "../../models/question.model/Question";
import { TestCaseModel } from "../../models/testCase/testCase";
import { ServiceImpl } from "../../Services/ServiceImpl";
let service: ServiceImpl<Question> = new ServiceImpl<Question>("questions");
class TestCaseController {
    

    async createTestCase(req:Request,res:Response) {
        if(!req.body || !req.params.questionId){
            return res.status(400).json({message: "Invalid test case data"});
        }

        try{
            let question = await service.findById(req.params.questionId);
            if(!question){
                return res.status(404).json({message: "Question not found"});
            }
            req.body.questionId = req.params.questionId;
            return res.status(201).json(await TestCaseModel.create(req.body));
        }catch(err){
            return res.status(500).json({message: `Internal Server Error : ${err}`});
        }

    }

    async getTestCaseByQuestionId(questionId: string) {

    }

    async getAlltestCases(req:Request,res:Response) {
        try{
            return res.status(200).json(await TestCaseModel.find({}));
        }catch(err){
            return res.status(500).json({message: `Internal Server Error : ${err}`});
        }
    }
}

export default new TestCaseController();