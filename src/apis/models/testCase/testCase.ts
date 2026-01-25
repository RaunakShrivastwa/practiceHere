import mongoose, { Schema, Document } from 'mongoose';

const TestCaseSchema: Schema = new Schema({
    questionId: { type: String, required: true, unique: true, index: true },
    testCases: [
        {
            // Mixed use karne se aap [1,2,3] ya "string" dono bhej sakte ho
            input: { type: Schema.Types.Mixed, required: true }, 
            expected: { type: Schema.Types.Mixed, required: true },
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

export const TestCaseModel = mongoose.model('TestCase', TestCaseSchema);