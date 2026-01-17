import { Worker } from 'bullmq';
import { JudgeFactory } from '../../judge/Factory/executor.factory';

// Redis connection wahi rakho jo queue mein hai
const worker = new Worker('submissions', async (job) => {
    const { submissionId, language, code, testCases } = job.data;
    
    console.log(`[Worker] Processing Job: ${submissionId}`);

    try {
        const executor = JudgeFactory.getExecutor(language);
        const results = await executor.run(code, testCases);
        console.log(`[Worker] Result for ${submissionId}:`, results);
    } catch (error) {
        console.error(`[Worker] Error in job ${submissionId}:`, error);
    }
}, {
    connection: { host: 'localhost', port: 6379 },
    concurrency: 2
});

console.log("Worker process started... Waiting for code submissions.");