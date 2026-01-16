import express from "express";
import dotenv from "dotenv";
import { logger } from "./utils/logger/Logger";
import dataBase from "./config/db.config/dataBase";
import { Repositery } from "./apis/repository/Repositery";
import router from "./apis/routes/v1/router";
import { connectDB } from "./config/db.config/mongoDb";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use('/api/practice/v1',router);


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
    await connectDB();
    new Repositery("questions").createQuestionTable();    
}