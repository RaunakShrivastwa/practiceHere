import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { addSubmissionToQueue } from '../../../queues/submission.queue.js/submissionQueue'; // Tumhari file ka path
import { logger } from '../../../utils/logger/Logger';
import { ServiceImpl } from '../../services/ServiceImpl';
import { Question } from '../../models/question.model/Question';
import { TestCaseModel } from '../../models/testCase/testCase';

let service: ServiceImpl<Question> = new ServiceImpl<Question>("questions");

export class SubmissionController {

    public handleSubmission = async (req: Request, res: Response): Promise<any> => {
        try {
            const { language, code, problemId } = req.body;
            if(!problemId){
                return res.status(404).json({Error:`Question does't exits`})
            }
            let question = await service.findById(problemId);
            if(!question){
                return res.status(404).json({Error:`Question does't exits with id ${problemId}`})
            }
            const {testCases} = await TestCaseModel.findOne({ questionId: problemId }).select('-testCases.isHidden');
            console.log(testCases);

            const submissionId = uuidv4();
            await addSubmissionToQueue({
                submissionId,
                language,
                code,
                testCases,
                userId: '123',
                problemId,
            });
            logger.info(`[Controller] Submission ${submissionId} queued.`);

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