import express from "express";
import dotenv from "dotenv";
import { logger } from "./utils/logger/Logger";
import dataBase from "./config/db.config/dataBase";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


app.listen(PORT, (err : any) => {
    if(err){
    logger.error("Server failed to start: " + err.message);
    process.exit(1);
    }
    startServer();
});

async function startServer(){
    logger.info(`Server is running on port ${PORT}`);
    await dataBase.connectDatabase();
}