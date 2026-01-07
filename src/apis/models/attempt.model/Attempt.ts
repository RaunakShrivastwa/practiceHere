import {IAttempt} from './AttemptI';
import { Status } from '../../../types/attempt.Option';

export class Attempt {
    // Fields ko initialize karne ka shorthand tarika
    public id: string;
    public userId: string;
    public questionId: string;
    public status: Status;
    public passedTestCases: number;
    public totalTestCases: number;
    public createdAt: Date;
    public updatedAt: Date;

    // Constructor mein pura object pass ho raha hai
    constructor(data: IAttempt) {
        this.id = data.id;
        this.userId = data.userId;
        this.questionId = data.questionId;
        this.status = data.status;
        this.passedTestCases = data.passedTestCases;
        this.totalTestCases = data.totalTestCases;
        this.createdAt = new Date(data.createdAt);
        this.updatedAt = new Date(data.updatedAt);
    }
}