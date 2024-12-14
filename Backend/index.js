import connectDB from "./config/db.js";
import dotenv from 'dotenv';
import express from 'express';
import quizRouter from "./Routes/QuizRoutes.js";

// load the .env file
dotenv.config();

// connect to database
connectDB();

// create an express app
const app = express();

// middleware
app.use(express.json());

app.listen(process.env.PORT, () => console.log(`Server is running on port ${process.env.PORT}`));

// routes
app.use("/api/quizzes", quizRouter);