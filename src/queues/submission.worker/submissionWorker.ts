import Submission from "../../apis/models/submission/submission";
import { JudgeFactory } from "../../judge/Factory/executor.factory";
import { ServiceImpl } from "../../apis/services/ServiceImpl";
import { Worker } from 'bullmq';

let Service: ServiceImpl<Submission> = new ServiceImpl<Submission>('submissions');

const worker = new Worker('submissions', async (job) => {
    const { submissionId, userId, problemId, language, code, testCases } = job.data;
    console.log(`[Worker] Processing Job: ${submissionId}`);

    try {
        const executor = JudgeFactory.getExecutor(language);
        const results = await executor.run(code, testCases);

        // 1. Final Results Calculate Karo
        const totalTestCases = results.length;
        const passedCount = results.filter((r: any) => r.passed).length;
        
        // Priority Based Status Selection
        let finalStatus: "Accepted" | "Wrong Answer" | "Runtime Error" | "TLE" = "Accepted";
        
        // Check for specific errors in results array
        const hasTLE = results.some((r: any) => r.status === "TLE");
        const hasRE = results.some((r: any) => r.status === "Runtime Error");

        if (hasTLE) {
            finalStatus = "TLE";
        } else if (hasRE) {
            finalStatus = "Runtime Error";
        } else if (passedCount < totalTestCases) {
            finalStatus = "Wrong Answer";
        }

        // Calculate Average Runtime
        const avgRuntime = (results.reduce((acc: number, r: any) => acc + parseFloat(r.runtime), 0) / totalTestCases).toFixed(2);

        // 2. Submission Instance create karke properties set karo
        const finalSubmissionData = new Submission(
            userId,
            problemId,
            code,
            language
        );

        finalSubmissionData.status = finalStatus;
        finalSubmissionData.testCasesPassed = passedCount;
        finalSubmissionData.totalTestCases = totalTestCases;
        finalSubmissionData.runtime = `${avgRuntime}ms`;
        finalSubmissionData.memory = "12MB"; 

        // 3. Database mein Save (SQL Insert)
        await Service.create(finalSubmissionData);
        
        console.log(`[Worker] Submission ${submissionId} completed: ${passedCount}/${totalTestCases} passed. Status: ${finalStatus}`);

    } catch (error: any) {
        console.error(`[Worker] Critical Error in job ${submissionId}:`, error);
        
        const errorSubmission = new Submission(userId, problemId, code, language);
        errorSubmission.status = "Runtime Error";
        await Service.create(errorSubmission);
    }
}, {
    // Configuration Object yahan aayega (Bracket Fix)
    connection: { 
        host: 'localhost', 
        port: 6379 
    },
    concurrency: 2
});

console.log("Worker process is active and listening for jobs...");