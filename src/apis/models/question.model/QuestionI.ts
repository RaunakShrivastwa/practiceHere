import mongoose from "mongoose";

export interface IQuestion {
    id: string;
    description: string;
    constraints: string;
    example: string;
    testcase?:mongoose.Schema.Types.ObjectId;
    tag: string;
    level: Level;
    supportedlanguages?: string[]; // 'supportedLanguages' se 'supportedlanguages'
    createdby: string; // 'createdBy' se 'createdby'
    companytags: string; // 'companyTags' se 'companytags'
}