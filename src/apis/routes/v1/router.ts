import { Router } from "express";

class RouterV1 {
    public router: Router;

    constructor(){
        this.router = Router();
        this.initRoutes();
    }

    initRoutes() {
        // Define your v1 routes here
    }
}

export default new RouterV1().router;