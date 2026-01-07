import { IQuestion } from "./QuestionI";

export class Question {
    // Fields ko initialize karne ka shorthand tarika
    public id: string;
    public description: string;
    public constraint: string;
    public example: string;
    public testCase: string;
    public tag: string[];
    public level: Level;
    public supportedLanguages: string[];
    public createdBy: string;
    public companyTags: string[];

    // Constructor mein pura object pass ho raha hai
    constructor(data: IQuestion) {
        this.id = data.id;
        this.description = data.description;
        this.constraint = data.constraint;
        this.example = data.example;
        this.testCase = data.testCase;
        this.tag = data.tag;
        this.level = data.level;
        this.supportedLanguages = data.supportedLanguages;
        this.createdBy = data.createdBy;
        this.companyTags = data.companyTags;
    }
}