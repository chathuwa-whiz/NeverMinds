import { createQuiz, getAllQuizzes, getQuizById, updateQuiz, deleteQuiz } from "../Controllers/QuizController";
import express from "express";

const quizRouter = express.Router();

quizRouter.post("/", createQuiz);
quizRouter.get("/", getAllQuizzes);
quizRouter.get("/:id", getQuizById);
quizRouter.put("/:id", updateQuiz);
quizRouter.delete("/:id", deleteQuiz);

export default quizRouter;