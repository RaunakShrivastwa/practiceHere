import { Request, Response } from "express";
import { ServiceImpl } from "../../Services/ServiceImpl";
import { User } from "../../models/user.model/User";

let service: ServiceImpl<User> = new ServiceImpl<User>("users");

class UserController {
    async createUser(req: Request, res: Response) {
        try {
            const userData = req.body;
            if (!userData) {
                return res.status(400).json({ message: "Invalid User data" });
            }
            const newUser = await service.create(userData);
            return res.status(201).json(newUser);
        } catch (err) {
            return res.status(500).json({ message: `Internal Server Error : ${err}` });
        }
    }

    async getAllUsers(req: Request, res: Response) {}

    updateUser() {
        // Implementation for updating a User
        // Call the service method to update a User
    }

    deleteUser() {
        // Implementation for deleting a User
        // Call the service method to delete a User
    }

    listUsers() {
        // Implementation for listing all Users
        // Call the service method to list all Users
    }
}

export default new UserController();