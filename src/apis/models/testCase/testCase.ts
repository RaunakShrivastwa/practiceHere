import mongoose, { Schema, Document } from 'mongoose';
import { ITestCasesDocument } from './testCaseI'; 

// Document interface for Mongoose
interface ITestCasesSchema extends ITestCasesDocument, Document {}

const TestCaseSchema: Schema = new Schema({
    questionId: {type: String, required: true,unique: true,index: true},
    testCases: [
        {
            input: { type: String, required: true },
            output: { type: String, required: true },
            isHidden: { type: Boolean, default: false }
        }
    ],
    metadata: {
        memoryLimit: { type: String, default: "256MB" },
        timeLimit: { type: String, default: "1000ms" }
    }
}, { 
    timestamps: true
});

export const TestCaseModel = mongoose.model<ITestCasesSchema>('TestCase', TestCaseSchema);