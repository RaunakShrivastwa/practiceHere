import { Router } from "express";
import UserController from "../../../controllers/user.controller/UserController";
import { authMiddleware } from "../../../middlewares/auth.middleware";

class userRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.initRoutes();
    }
    initRoutes() {
        // Define user-related routes here
        this.router.post('/create/new/user', UserController.createUser);
        this.router.post('/signUp/user', UserController.signUp);
        this.router.post('/login/user', UserController.login);
        this.router.get('/list/all/users', authMiddleware, UserController.getAllUsers);
        this.router.put('/update/user/:id', authMiddleware, UserController.updateUser);
        this.router.delete('/delete/user/:email', authMiddleware, UserController.deleteUser);
        this.router.get('/get/user/:id', authMiddleware, UserController.listUsers);
    }
}
export default new userRouter().router;