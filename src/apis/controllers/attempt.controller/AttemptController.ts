import { Request, Response } from "express";
import { ServiceImpl } from "../../Services/ServiceImpl";
import { User } from "../../models/user.model/User";

let service: ServiceImpl<User> = new ServiceImpl<User>("users");

class Attemps {
    async createAttempt(req: Request, res: Response) {
        try {
            const attemptData = req.body;
            if (!attemptData) {
                return res.status(400).json({ message: "Invalid attempt data" });
            }
            const newAttempt = await service.create(attemptData);
            return res.status(201).json(newAttempt);
        } catch (err) {
            return res.status(500).json({ message: `Internal Server Error : ${err}` });
        }
    }

    async getAllAttempts(req: Request, res: Response) {}

    updateAttempt() {
        // Implementation for updating a Attempt
        // Call the service method to update a Attempt
    }

    deleteAttempt() {
        // Implementation for deleting a Attempt
        // Call the service method to delete a Attempt
    }

    listAttempts() {
        // Implementation for listing all Attempts
        // Call the service method to list all Attempts
    }
}

export default new Attemps();