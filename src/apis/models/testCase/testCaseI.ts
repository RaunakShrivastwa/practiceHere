export interface ITestCaseItem {
    input: string;
    output: string;
    isHidden: boolean;
}

export interface ITestCasesDocument {
    questionId: string;
    testCases: ITestCaseItem[];
    metadata: {
        memoryLimit: string;
        timeLimit: string;
    };
}