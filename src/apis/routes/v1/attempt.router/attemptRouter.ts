import { Router } from "express";
import AttemptController from "../../../controllers/attempt.controller/AttemptController";

class AttemptRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.initRoutes();
    }
    initRoutes() {
        // Define user-related routes here
        this.router.post('/create/new/attempt', AttemptController.createAttempt);
        this.router.get('/list/all/attempts', AttemptController.getAllAttempts);
        this.router.put('/update/attempt/:id', AttemptController.updateAttempt);
        this.router.delete('/delete/attempt/:id', AttemptController.deleteAttempt);
        this.router.get('/get/attempt/:id', AttemptController.listAttempts);
    }
}
export default new AttemptRouter().router;