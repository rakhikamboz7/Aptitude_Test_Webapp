const mongoose = require("mongoose")

const testResultSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // Make optional if user is not logged in
    },
    sessionId: {
      type: String,
      required: true,
      unique: true,
    },
    company: {
      type: String,
      default: "general",
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },
    answers: {
      type: Map,
      of: String, // Store as "A", "B", "C", "D"
      required: true,
    },
    questions: [
      {
        id: Number,
        question: String,
        options: [String],
        correctAnswer: String,
        topic: String,
        difficulty: String,
        explanation: String,
      },
    ],
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    correctAnswers: {
      type: Number,
      required: true,
      min: 0,
    },
    totalQuestions: {
      type: Number,
      required: true,
      min: 1,
    },
    timeSpent: {
      type: Number, // in seconds
      required: true,
      min: 0,
    },
    badge: {
      level: {
        type: String,
        enum: ["beginner", "intermediate", "advanced"],
      },
      color: String,
      message: String,
    },
    topicBreakdown: {
      type: Map,
      of: {
        correct: Number,
        total: Number,
        percentage: Number,
      },
    },
    feedback: {
      overallSummary: String,
      strengths: [String],
      improvements: [String],
      recommendations: [String],
      motivationalMessage: String,
      nextSteps: [String],
    },
  },
  {
    timestamps: true,
  }
)

// Index for faster queries
testResultSchema.index({ userId: 1, createdAt: -1 })
testResultSchema.index({ sessionId: 1 })

module.exports = mongoose.model("TestResult", testResultSchema)