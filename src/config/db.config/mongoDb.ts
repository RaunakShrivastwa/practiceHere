import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { logger } from '../../utils/logger/Logger';

dotenv.config();


export const connectDB = async (): Promise<void> => {
  try {
    logger.info('Connecting to MongoDB...')
    await mongoose.connect(process.env.DB_URL );
    logger.info("MongoDB connected successfully");
  } catch (err) {
    logger.error(`error with mongodb connection ${err}`)
  }
};

// Optionally, listen for any errors or open events for the DB connection
mongoose.connection.on('error', (err) => {
  console.error('Error connecting to DB:', err);
});

mongoose.connection.on('open', () => {
  logger.info('Successfully connected to MongoDB');
});
