import mongoose from "mongoose"
import bcrypt from "bcryptjs"

const assessmentSchema = new mongoose.Schema(
  {
    assessmentId: { type: String, default: () => Date.now().toString() },
    company: { type: String, default: "general" },
    difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "medium" },
    score: { type: Number, required: true },
    correctAnswers: { type: Number, default: 0 },
    totalQuestions: { type: Number, default: 15 },
    timeSpent: { type: Number, default: 0 },
    badge: {
      level: { type: String, default: "Beginner" },
      color: { type: String, default: "gray" },
    },
    topicBreakdown: { type: Map, of: mongoose.Schema.Types.Mixed, default: {} },
    completedAt: { type: Date, default: Date.now },
  },
  { _id: false }
)

const userSchema = new mongoose.Schema(
  {
    // ✅ No manual _id — Mongoose handles this automatically
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Don't return password by default
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    profile: {
      firstName: { type: String, default: "" },
      lastName: { type: String, default: "" },
      dateOfBirth: { type: Date },
      education: { type: String, default: "" },
      occupation: { type: String, default: "" },
      targetCompany: { type: String, default: "general" },
    },
    preferences: {
      preferredDifficulty: { type: String, enum: ["easy", "medium", "hard"], default: "medium" },
    },
    assessmentHistory: [assessmentSchema],
    statistics: {
      totalAssessments: { type: Number, default: 0 },
      averageScore: { type: Number, default: 0 },
      bestScore: { type: Number, default: 0 },
      badgesEarned: {
        beginner: { type: Number, default: 0 },
        intermediate: { type: Number, default: 0 },
        advanced: { type: Number, default: 0 },
      },
      companyStats: { type: Map, of: mongoose.Schema.Types.Mixed, default: {} },
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
)

// ✅ Hash password before saving
userSchema.pre("save", async function (next) {
  // Only hash if password was modified
  if (!this.isModified("password")) return next()
  try {
    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// ✅ Compare password method (used in login route)
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

// ✅ toJSON method — removes sensitive fields from responses
userSchema.methods.toJSON = function () {
  const user = this.toObject()
  delete user.password
  delete user.__v
  return user
}

// ✅ Add assessment and update statistics
userSchema.methods.addAssessment = async function (assessmentData) {
  this.assessmentHistory.unshift(assessmentData)

  // Keep only last 50 assessments
  if (this.assessmentHistory.length > 50) {
    this.assessmentHistory = this.assessmentHistory.slice(0, 50)
  }

  // Recalculate statistics
  const history = this.assessmentHistory
  this.statistics.totalAssessments = history.length
  this.statistics.averageScore = Math.round(
    history.reduce((sum, a) => sum + a.score, 0) / history.length
  )
  this.statistics.bestScore = Math.max(...history.map((a) => a.score))

  // Count badges
  this.statistics.badgesEarned = history.reduce(
    (counts, a) => {
      const level = a.badge?.level?.toLowerCase()
      if (level && counts[level] !== undefined) counts[level]++
      return counts
    },
    { beginner: 0, intermediate: 0, advanced: 0 }
  )

  await this.save()
  return this
}
const User = mongoose.model("User", userSchema)

export default User