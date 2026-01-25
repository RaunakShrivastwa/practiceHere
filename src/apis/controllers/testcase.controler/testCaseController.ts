import { Request, Response } from "express";
import { Question } from "../../models/question.model/Question";
import { TestCaseModel } from "../../models/testCase/testCase";
import { ServiceImpl } from "../../services/ServiceImpl";
let service: ServiceImpl<Question> = new ServiceImpl<Question>("questions");
class TestCaseController {

    async createTestCase(req: Request, res: Response) {

        if (!req.body || !req.params.questionId) {
            return res.status(400).json({ message: "Invalid test case data" });
        }

        try {
            let question:any = await service.findById(req.params.questionId);
            if (!question) {
                return res.status(404).json({ message: "Question not found" });
            }
            req.body.questionId = req.params.questionId;
            let testCase = await TestCaseModel.create(req.body);
            await service.updateById(question.id, { testcase: testCase._id.toString() });
            return res.status(201).json({ "testCases added": testCase});
        } catch (err) {
            return res.status(500).json({ message: `Internal Server Error : ${err}` });
        }

    }

    async getTestCaseByQuestionId(req: Request, res: Response) {
        try {
            let testCase = await TestCaseModel.find({ questionId: req.params.id });
            console.log("testcase", testCase.length < 0);
            if (testCase.length == 0) return res.status(404).json({ Message: `Invalide or does't exit testCases of id ${req.params.id}` })
            return res.status(200).json({ "testCase": testCase });
        } catch (err) {
            return res.status(500).json(err);
        }
    }

    async getAlltestCases(req: Request, res: Response) {
        try {
            return res.status(200).json(await TestCaseModel.find({}));
        } catch (err) {
            return res.status(500).json({ message: `Internal Server Error : ${err}` });
        }
    }

     async updateTestcase(req: Request, res: Response) {
        try {
            const { questionId } = req.params;
            const { testCases, metadata } = req.body;
            const { role } = req.user;

            if (role !== "admin") {
                return res.status(403).json({
                    error: "Unauthorized"
                });
            }

            if (!questionId || !Array.isArray(testCases)) {
                return res.status(400).json({
                    error: "Invalid payload"
                });
            }

            // 🔁 UPSERT test cases (NO DELETE)
            for (const tc of testCases) {
                await this.service.upsertTestCase({
                    questionId,
                    input: tc.input,
                    expectedOutput: tc.output,
                    isHidden: tc.isHidden ?? false,
                    weight: tc.isHidden ? 2 : 1
                });
            }

            // Optional metadata update
            if (metadata) {
                await this.service.updateMetadata(questionId, metadata);
            }

            return res.status(200).json({
                message: "Test cases updated successfully"
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                error: "Internal server error"
            });
        }
    }

}

export default new TestCaseController();