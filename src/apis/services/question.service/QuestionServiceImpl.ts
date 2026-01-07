import { Question } from "../../models/question.model/Question";
import { QuestionService } from "./questionService";

export class QuestionServiceImpl implements QuestionService {

    createQuestion(data: Question | null): Promise<Question | null> {
        throw new Error("Method not implemented.");
    }

    getQuestion(id: string): Promise<Question | null> {
        throw new Error("Method not implemented.");
    }

    updateQuestion(id: string, data: Partial<Question>): Promise<Question | null> {
        throw new Error("Method not implemented.");
    }

    deleteQuestion(id: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    
    listQuestions(): Promise<Question[]> {
        throw new Error("Method not implemented.");
    }

}