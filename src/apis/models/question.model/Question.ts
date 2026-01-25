import mongoose from "mongoose";
import { IQuestion } from "./QuestionI";


export class Question implements IQuestion {
    public description: string;
    public constraints: string;
    public example: string;
    public testcase: string;
    public tag: string;
    public level: Level;
    public supportedlanguages?: string[]; // Lowercase + Array type match
    public createdby: string; // Lowercase
    public companytags: string; // Lowercase

    constructor(data: IQuestion) {
        this.description = data.description;
        this.constraints = data.constraints;
        this.example = data.example;
        this.testcase = data.testcase;
        this.tag = data.tag;
        this.level = data.level;
        this.supportedlanguages = data.supportedlanguages;
        this.createdby = data.createdby;
        this.companytags = data.companytags;
    }
}