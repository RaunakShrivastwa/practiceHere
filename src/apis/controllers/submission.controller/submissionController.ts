import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { addSubmissionToQueue } from '../../../queues/submission.queue.js/submissionQueue'; // Tumhari file ka path
import { logger } from '../../../utils/logger/Logger';

export class SubmissionController {
    private dummyTestCases: Record<string, any[]> = {
        "1": [
            { input: [1, 2, 3, 4], expected: 10 },
            { input: [10, 20, 30], expected: 60 }
        ]
    };

    public handleSubmission = async (req: Request, res: Response): Promise<void> => {
        try {
            const { language, code, problemId } = req.body;
            const testCases = this.dummyTestCases[problemId] || this.dummyTestCases["1"];
            const submissionId = uuidv4();
            await addSubmissionToQueue({
                submissionId,
                language,
                code,
                testCases,
                userId: "user_123"
            });
            logger.info(`[Controller] Submission ${submissionId} queued.`)

            // 3. User ko turant "Pending" status bhej do
            res.json({ 
                success: true, 
                submissionId,
                status: "Pending",
                message: "Code in Progress...."
            });

        } catch (err: any) {
            res.status(500).json({ success: false, error: err.message });
        }
    }
}

export default new SubmissionController();