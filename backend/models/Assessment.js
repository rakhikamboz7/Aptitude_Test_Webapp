import mongoose from "mongoose"

const questionSchema = new mongoose.Schema(
  {
    questionText: { type: String, required: true },
    options: {
      type: [String],
      validate: {
        validator: (arr) => arr.length === 4,
        message: "Each question must have exactly 4 options",
      },
    },
    correctAnswer: { type: String, required: true, enum: ["A", "B", "C", "D"] },
    topic: { type: String, default: "general" },
    explanation: { type: String, default: "" },
  },
  { _id: false }
)

const userAnswerSchema = new mongoose.Schema(
  {
    questionIndex: { type: Number, required: true },
    selectedAnswer: { type: String, enum: ["A", "B", "C", "D", null], default: null },
  },
  { _id: false }
)

const assessmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    companyName: { type: String, default: "general", lowercase: true, trim: true },
    difficulty: { type: String, enum: ["easy", "medium", "hard"], required: true },
    status: { type: String, enum: ["draft", "in-progress", "completed"], default: "in-progress" },
    questions: {
      type: [questionSchema],
      validate: {
        validator: (arr) => arr.length > 0,
        message: "Assessment must have at least one question",
      },
    },
    userAnswers: { type: [userAnswerSchema], default: [] },
    totalQuestions: { type: Number, default: 15 },
    score: { type: Number, default: null, min: 0, max: 100 },
    accuracy: { type: Number, default: null, min: 0, max: 100 },
    correctAnswersCount: { type: Number, default: null },
    startTime: { type: Date, default: Date.now },
    endTime: { type: Date, default: null },
    totalTime: { type: Number, default: null },
    feedback: {
      strengths: { type: [String], default: [] },
      weaknesses: { type: [String], default: [] },
      suggestions: { type: [String], default: [] },
      topicBreakdown: { type: Map, of: mongoose.Schema.Types.Mixed, default: {} },
      generatedAt: { type: Date, default: null },
    },
    badge: {
      level: { type: String, enum: ["beginner", "intermediate", "advanced"], default: null },
      color: { type: String, default: null },
    },
  },
  { timestamps: true }
)

assessmentSchema.index({ userId: 1, createdAt: -1 })
assessmentSchema.index({ userId: 1, status: 1 })

// Returns questions WITHOUT correctAnswer — safe to send to client
assessmentSchema.methods.getSafeQuestions = function () {
  return this.questions.map((q, index) => ({
    index,
    questionText: q.questionText,
    options: q.options,
    topic: q.topic,
  }))
}

// Calculate badge from score
assessmentSchema.methods.calculateBadge = function () {
  if (this.score >= 80) return { level: "advanced", color: "gold" }
  if (this.score >= 60) return { level: "intermediate", color: "silver" }
  return { level: "beginner", color: "bronze" }
}

const Assessment = mongoose.model("Assessment", assessmentSchema)
export default Assessment