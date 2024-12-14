import Quiz, { Answer, Question } from "../Model/QuizModel.js";

// CREATE QUIZ
export const createQuiz = async (req, res) => {
    const { title, questions } = req.body;

    try {
        // create answers first
        const createdQuestions = await Promise.all(questions.map(async (question) => {
            const createdAnswers = await Promise.all(question.answers.map(async (answer) => {
                const newAnswer = new Answer(answer);
                await newAnswer.save();
                return newAnswer._id;
            }));
            
            // create question
            const newQuestion = new Question({
                question: question.question,
                image: question.image,
                answers: createdAnswers,
            });
    
            await newQuestion.save();
            return newQuestion._id;
        }));
        
        // create quiz
        const newQuiz = new Quiz({
            title,
            questions: createdQuestions,
        });

        await newQuiz.save();

        res.status(201).json(newQuiz);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}

// GET ALL QUIZZES
export const getAllQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.find().populate({
            path: 'questions',
            populate: {
                path: 'answers',
            }
        });

        res.status(200).json(quizzes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// GET QUIZ BY ID
export const getQuizById = async (req, res) => {
    const { id } = req.params;

    try {
        const quiz = await Quiz.findById(id).populate({
            path: 'questions',
            populate: {
                path: 'answers',
            }
        });

        if(!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        res.status(200).json(quiz);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// UPDATE QUIZ
export const updateQuiz = async (req, res) => {
    const { id } = req.params;
    const { title, questions } = req.body;

    try {
        const quiz = await Quiz.findById(id);

        if(!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        // Update questions and answers
        const updatedQuestions = await Promise.all(questions.map(async (question) => {
            
            if(question._id) {
                // Update existing question
                const existingQuestion = await Question.findById(question._id);

                if(!existingQuestion) {
                    return res.status(404).json({ message: `Question ${question._id} not found` });
                }

                const updatedAnswers = await Promise.all(question.answers.map(async (answer) => {
                    if(answer._id) {
                        // update existing answer
                        return await Answer.findByIdAndUpdate(answer._id, answer, { new: true });
                    } else {
                        // create new answer
                        const newAnswer = new Answer(answer);
                        await newAnswer.save();
                        return newAnswer._id;
                    }
                }));

                existingQuestion.question = question.question;
                existingQuestion.image = question.image;
                existingQuestion.answers = updatedAnswers;

                await existingQuestion.save();
                return existingQuestion._id;

            } else {
                // create new question
                const createdAnswers = await Promise.all(question.answers.map(async (answer) => {
                    const newAnswer = new Answer(answer);
                    await newAnswer.save();
                    return newAnswer._id;
                }));

                const newQuestion = new Question({
                    question: question.question,
                    image: question.image,
                    answers: createdAnswers,
                });

                await newQuestion.save();
                return newQuestion._id;
            }
        }));

        // update quiz
        quiz.title = title;
        quiz.questions = updatedQuestions;

        await quiz.save();

        res.status(200).json(quiz);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// DELETE QUIZ
export const deleteQuiz = async (req, res) => {
    const { id } = req.params;

    try {
        const quiz = await Quiz.findByIdAndDelete(id);

        if(!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        // delete all questions and answers
        await Promise.all(quiz.questions.map(async (questionId) => {
            const question = await Question.findByIdAndDelete(questionId);

            if(question) {
                await Promise.all(question.answers.map(async (answerId) => {
                    await Answer.findByIdAndDelete(answerId);
                }));
            }
        }));

        res.status(200).json({ message: "Quiz deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}