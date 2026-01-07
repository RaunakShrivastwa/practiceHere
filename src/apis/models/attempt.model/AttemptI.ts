import { Status } from "../../../types/attempt.Option";
export interface IAttempt {
    id: string;
    userId: string;
    questionId: string;
    status: Status;
    passedTestCases: number;
    totalTestCases: number;
    createdAt: Date;
    updatedAt: Date;
}