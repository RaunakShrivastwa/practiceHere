import { Request, Response } from "express";
import { ServiceImpl } from "../../Services/ServiceImpl";
import { User } from "../../models/user.model/User";
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import {
    generateAccessToken,
    generateRefreshToken
} from "../../../utils/jwt.util";
import {
    AccessTokenPayload,
    RefreshTokenPayload
} from '../../../types/auth.types';

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

    async signUp(req: Request, res: Response) {
        try {
            const userData = req.body;

            if (!userData.username || !userData.email || !userData.password || !userData.name || !userData.country) {
                return res.status(400).json({
                    message: 'Required fields missing'
                });
            }

            userData.id = uuidv4();

            // 🔐 Hash password
            userData.password = await bcrypt.hash(userData.password, 10);

            userData.role = userData.role || 'student';
            userData.status = 'active';

            // stats (default values)
            userData.totalquestionssolved = 0;
            userData.easyquestionssolved = 0;
            userData.mediumquestionssolved = 0;
            userData.hardquestionssolved = 0;
            userData.totalsubmissions = 0;
            userData.correctsubmissions = 0;

            const newUserData = await service.create(userData);
            return res.status(201).json(newUserData);
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    async login(req: Request, res: Response) {
        try {
            const { username, email, password } = req.body;

            if ((!username || !email) && !password) {
                return res.status(400).json({
                    message: 'Invalid Crediential'
                });
            }

            const getUser = await service.findByEmailOrUserName(email, username);
            const isMatch = await bcrypt.compare(
                password,
                getUser.password
            );

            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }


            const accessPayload: AccessTokenPayload = {
                userId: getUser.id,
                role: getUser.role
            };

            const refreshPayload: RefreshTokenPayload = {
                userId: getUser.id
            };

            const accessToken = generateAccessToken(accessPayload);
            const refreshToken = generateRefreshToken(refreshPayload);


            let id = uuidv4();

            delete getUser.password;

            return res.json({
                accessToken,
                refreshToken,
                getUser
            });
        } catch (error) {
            return res.status(500).json(`error - ${error}`);
        }
    }

    async getAllUsers(req: Request, res: Response) {
        try {
            const allUser = await service.findAll();
            allUser.forEach(element => {
                delete element.password;
            });
            return res.status(200).json(allUser);
        } catch (error) {
            return res.status(500).json(`error - ${error}`);
        }
    }

    async updateUser() {
        // Implementation for updating a User
        // Call the service method to update a User
    }

    async deleteUser(req: Request, res: Response) {
        try {
            const { role, email } = req.user;
            const targetEmail = req.params.email;

            if (role !== "admin" && targetEmail !== email) {
                return res.status(403).json({
                    message: "You do not have permission to delete this user."
                });
            }

            const deletedUser = await service.deleteByEmail(targetEmail);

            return res.status(200).json({
                message: "User deleted successfully.",
                data: deletedUser
            });

        } catch (error) {
            return res.status(500).json({
                message: "An unexpected error occurred while deleting the user.",
                error: error instanceof Error ? error.message : error
            });
        }
    }

    async listUsers() {
        // Implementation for listing all Users
        // Call the service method to list all Users
    }
}

export default new UserController();