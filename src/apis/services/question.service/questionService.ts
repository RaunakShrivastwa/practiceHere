import { Question } from "../../models/question.model/Question";

export interface QuestionService {
    createQuestion(data: Question | null): Promise<Question | null>;
    getQuestion(id: string): Promise<Question | null>;
    updateQuestion(id: string, data: Partial<Question>): Promise<Question | null>;
    deleteQuestion(id: string): Promise<boolean>;
    listQuestions(): Promise<Question[]>;
    
}