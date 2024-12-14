import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
    answer: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    },
    answerType: {
        type: String,
        enum: ['text', 'image', 'number'],
        required: true,
    },
    isCorrect: {
        type: Boolean,
        required: true,
    },
});

export const Answer = mongoose.model('Answer', answerSchema);


const questionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: false,
    },
    answers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Answer",
    }],
});

export const Question = mongoose.model('Question', questionSchema);


const quizSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    questions: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
    }],
});

const Quiz = mongoose.model('Quiz', quizSchema);

export default Quiz;