import express from "express";
import dotenv from "dotenv";
import { logger } from "./utils/logger/Logger";
import dataBase from "./config/db.config/dataBase";
import { Repositery } from "./apis/repository/Repositery";
import router from "./apis/routes/router";
import { connectDB } from "./config/db.config/mongoDb";
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter'; // Note this path
import { ExpressAdapter } from '@bull-board/express';
import { submissionQueue } from "./queues/submission.queue.js/submissionQueue";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
// frontend  http://localhost:5173'
app.use(cors({
    origin: '*',
    credentials: true,
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
}));
app.use('/api/practice/v1',router);

// for the bull Board
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');
createBullBoard({
  queues: [new BullMQAdapter(submissionQueue)],
  serverAdapter: serverAdapter,
});

app.use('/admin/queues', serverAdapter.getRouter());


app.listen(PORT, (err: any) => {
    if (err) {
        logger.error("Server failed to start: " + err.message);
        process.exit(1);
    }
    startServer();
});

async function startServer() {
    logger.info(`Server is running on port ${PORT}`);
    try {
        await dataBase.connectDatabase();
        await connectDB();
        new Repositery("questions").createQuestionTable();
        new Repositery("users").createUserTable();
        new Repositery("attempts").createAttemptTable();
        new Repositery("auth").createAttemptTable();
    } catch (err) {
        console.log(err);

    }
}