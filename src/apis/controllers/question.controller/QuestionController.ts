import { Request, Response } from "express";
import { ServiceImpl } from "../../services/ServiceImpl";
import { Question } from "../../models/question.model/Question";
import { v4 as uuidv4 } from 'uuid';

let service: ServiceImpl<Question> = new ServiceImpl<Question>("questions");

class QuestionController {

    async createMultipleQuestions(req: Request, res: Response) {
        try {
            const body = req.body;

            if (!Array.isArray(body)) {
                return res.status(400).json({
                    message: "Request body must be an array"
                });
            }

            // Add system fields safely
            const payload = body.map(item => ({
                ...item,
                id: uuidv4(),
                createdby: req.user.userId,
                created_at: new Date(),
                updated_at: new Date()
            }));

            const result = await service.createMany(payload);

            return res.status(201).json({
                message: "Bulk question insert successful",
                count: result.length,
                data: result
            });

        } catch (error) {
            return res.status(500).json({
                error: error
            });
        }
    }

    async createQuestion(req: Request, res: Response) {
        try{
            if(!req.body){
                return res.status(400).json({message:`Bad Request, Question data is required`});
            }
            let question = await service.create(req.body);
            return res.status(201).json({message:`Question created successfully`,data:question});
        }catch(err){
            return res.status(500).json({message:`Internal Server Error : ${err}`});
        }
    }
       
    async getAllQuestions(req: Request, res: Response) {
        try {
            return res.status(200).json(await service.findAll());
        } catch (err) {
            return res.status(500).json({ message: `Internal Server Error : ${err}` });
        }
    }

    async updateQuestion(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const { role, userId } = req.user;

            // 1️⃣ Validate id
            if (!id) {
                return res.status(400).json({
                    error: "Question id is required"
                });
            }

            // 2️⃣ Fetch existing question
            const existingQuestion = await service.findById(id);

            if (!existingQuestion) {
                return res.status(404).json({
                    error: "Question not found"
                });
            }

            console.log(`existingQuestion.createdby - ${existingQuestion.createdby} and userId - ${userId}`);
            
            // 3️⃣ Authorization check
            if (role !== "admin" && userId != existingQuestion.createdby) {
                return res.status(403).json({
                    error: "Unauthorized to update this question"
                });
            }

            // 4️⃣ Remove non-updatable fields
            delete updateData.id;
            delete updateData.createdby;
            delete updateData.created_at;
            delete updateData.updated_at;

            // 5️⃣ Update question
            const updatedQuestion = await service.updateById(id, updateData);

            if (!updatedQuestion) {
                return res.status(500).json({
                    error: "Failed to update question"
                });
            }

            return res.status(200).json({
                message: "Question updated successfully",
                data: updatedQuestion
            });

        } catch (error) {
            console.error("updateQuestion error:", error);
            return res.status(500).json({
                error: error
            });
        }
    }

    async deleteQuestion(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { role, userId } = req.user;

            if (!id) {
                return res.status(400).json({
                    error: "Question id is required"
                });
            }

            // 1️⃣ Check if question exists
            const fetchQuestion = await service.findById(id);

            if (!fetchQuestion) {
                return res.status(404).json({
                    error: "Question not found"
                });
            }

            // 2️⃣ Authorization check
            if (role !== "admin" && userId !== fetchQuestion.createdby) {
                return res.status(403).json({
                    error: "Unauthorized to delete this question"
                });
            }

            // 3️⃣ Delete
            const isDeleted = await service.deleteById(id);

            if (!isDeleted) {
                return res.status(500).json({
                    error: "Failed to delete question"
                });
            }

            return res.status(200).json({
                message: "Question deleted successfully"
            });

        } catch (error) {
            console.error("Delete Question Error:", error);

            return res.status(500).json({
                error: error
            });
        }
    }

    async getQuestionById(req: Request, res: Response) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({
                    error: "Question id is required"
                });
            }

            // 1️⃣ Check if question exists for id
            const fetchQuestion = await service.findById(id);

            if (!fetchQuestion) {
                return res.status(404).json({
                    error: `Question not found for this ID - ${id}`
                });
            }

            return res.status(200).json({
                message: "Question fetched successfully",
                data: fetchQuestion
            });

        } catch (error) {
            return res.status(500).json({
                error: error
            });
        }
    }

}

export default new QuestionController();