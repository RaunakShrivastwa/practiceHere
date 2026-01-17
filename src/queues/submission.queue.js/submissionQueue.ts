import { Queue } from 'bullmq';

export const submissionQueue = new Queue('submissions', {
    connection: { host: 'localhost', port: 6379 }
});

export const addSubmissionToQueue = async (data: any) => {
    await submissionQueue.add('execute-code', data);
};