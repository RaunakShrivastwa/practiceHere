import ISubmission from "./ISubmission";

class Submission implements ISubmission {
    userId: string;
    problemId: string;
    code: string;
    language: string;
    status: "Pending" | "Accepted" | "Wrong Answer" | "TLE" | "Runtime Error";
    testCasesPassed: number;
    totalTestCases: number;
    runtime: string;
    memory: string;

    constructor(userId: string,problemId: string, code: string,language: string) {
        this.userId = userId;
        this.problemId = problemId;
        this.code = code;
        this.language = language;
        this.status = "Pending";
        this.testCasesPassed = 0;
        this.totalTestCases = 0;
        this.runtime = "0ms";
        this.memory = "0MB";
    }
}

export default Submission;