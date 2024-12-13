import connectDB from "./config/db.js";
import dotenv from 'dotenv';

// load the .env file
dotenv.config();

// connect to database
connectDB();