import { Router } from "express";
import UserController from "../../controllers/user.controller/UserController";

class userRouter{
    public router: Router;

    constructor(){
        this.router = Router();
        this.initRoutes();
    }   
    initRoutes() {
        // Define user-related routes here
        this.router.post('/create/new/user', UserController.createUser);
        this.router.get('/list/all/users', UserController.getAllUsers);
        this.router.put('/update/user/:id', UserController.updateUser);
        this.router.delete('/delete/user/:id', UserController.deleteUser);
        this.router.get('/get/user/:id', UserController.listUsers);   
    }
}
export default new userRouter().router;