import mongoose from "mongoose"
const { ObjectId } = mongoose.Schema.Types

const User = new mongoose.Schema(
{
  _id: ObjectId,
  username: String,
  email: String,
  profile: {
    firstName: String,
    lastName: String,
    targetCompany: String,
    // ... other fields
  },
  assessmentHistory: [
    {
      assessmentId: String,
      company: String,
      difficulty: String,
      score: Number,
      badge: {
        level: String,
        color: String
      },
      topicBreakdown: Map,
      completedAt: Date
    }
  ],
  statistics: {
    totalAssessments: Number,
    averageScore: Number,
    bestScore: Number,
    badgesEarned: {
      beginner: Number,
      intermediate: Number,
      advanced: Number
    },
    companyStats: Map
  },
  createdAt: Date,
  updatedAt: Date
},
  {
    timestamps: true,
  },
)


export default User;