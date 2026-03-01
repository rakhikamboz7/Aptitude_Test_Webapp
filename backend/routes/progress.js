import express from "express"
import mongoose from "mongoose"
import Assessment from "../models/Assessment.js"
import auth from "../middleware/auth.js"

const router = express.Router()

// GET /api/dashboard/summary — powers ProgressPage
router.get("/summary", auth, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId)

    // Overall stats from completed assessments
    const [aggregated] = await Assessment.aggregate([
      { $match: { userId, status: "completed" } },
      {
        $group: {
          _id: null,
          averageScore:   { $avg: "$score" },
          bestScore:      { $max: "$score" },
          totalTimeSpent: { $sum: "$totalTime" },
        },
      },
    ])

    // Status counts
    const [statusCounts] = await Assessment.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: null,
          total:      { $sum: 1 },
          completed:  { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } },
          inProgress: { $sum: { $cond: [{ $eq: ["$status", "in-progress"] }, 1, 0] } },
          draft:      { $sum: { $cond: [{ $eq: ["$status", "draft"] }, 1, 0] } },
        },
      },
    ])

    // Badge counts
    const badgeAgg = await Assessment.aggregate([
      { $match: { userId, status: "completed" } },
      { $group: { _id: "$badge.level", count: { $sum: 1 } } },
    ])
    const badges = { beginner: 0, intermediate: 0, advanced: 0 }
    badgeAgg.forEach(({ _id, count }) => {
      if (_id && badges[_id] !== undefined) badges[_id] = count
    })

    // Company breakdown
    const companyAgg = await Assessment.aggregate([
      { $match: { userId, status: "completed" } },
      {
        $group: {
          _id:      "$companyName",
          tests:    { $sum: 1 },
          avgScore: { $avg: "$score" },
          bestScore: { $max: "$score" },
        },
      },
      { $sort: { tests: -1 } },
    ])
    const companyStats = {}
    companyAgg.forEach(({ _id, tests, avgScore, bestScore }) => {
      companyStats[_id || "general"] = {
        tests,
        avgScore: Math.round(avgScore),
        bestScore,
      }
    })

    // Topic breakdown across all assessments
    const topicAgg = await Assessment.aggregate([
      { $match: { userId, status: "completed", "feedback.topicBreakdown": { $exists: true } } },
      { $project: { topicBreakdown: { $objectToArray: "$feedback.topicBreakdown" } } },
      { $unwind: "$topicBreakdown" },
      {
        $group: {
          _id:     "$topicBreakdown.k",
          correct: { $sum: "$topicBreakdown.v.correct" },
          total:   { $sum: "$topicBreakdown.v.total" },
        },
      },
    ])
    const topicStats = {}
    topicAgg.forEach(({ _id, correct, total }) => {
      topicStats[_id] = {
        correct,
        total,
        accuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
      }
    })

    // Trend — compare recent 3 vs older 3
    const allCompleted = await Assessment.find({ userId, status: "completed" })
      .select("score createdAt")
      .sort({ createdAt: -1 })

    let trend = "stable"
    if (allCompleted.length >= 3) {
      const recentAvg = allCompleted.slice(0, 3).reduce((s, a) => s + a.score, 0) / 3
      const olderAvg  = allCompleted.slice(-3).reduce((s, a) => s + a.score, 0) / 3
      if (recentAvg > olderAvg + 5)      trend = "improving"
      else if (recentAvg < olderAvg - 5) trend = "declining"
    }

    // Best assessment
    const bestAssessment = await Assessment.findOne({ userId, status: "completed" })
      .sort({ score: -1 })
      .select("score difficulty companyName")

    // Recent history for ProgressPage list + chart
    const recentHistory = await Assessment.find({ userId, status: "completed" })
      .select("score difficulty companyName totalTime badge createdAt")
      .sort({ createdAt: -1 })
      .limit(10)

    // Shape into format ProgressPage expects
    const progressHistory = recentHistory.map((a) => ({
      score:      a.score,
      difficulty: a.difficulty,
      timeSpent:  a.totalTime || 0,
      company:    a.companyName || "general",
      badge:      a.badge || null,
      date:       a.createdAt.toISOString(),
    }))

    res.json({
      success: true,
      summary: {
        totalAssessments: statusCounts?.total      ?? 0,
        completed:        statusCounts?.completed  ?? 0,
        inProgress:       statusCounts?.inProgress ?? 0,
        draft:            statusCounts?.draft      ?? 0,
        averageScore:     aggregated ? Math.round(aggregated.averageScore) : 0,
        bestScore:        aggregated?.bestScore    ?? 0,
        bestDifficulty:   bestAssessment?.difficulty ?? "medium",
        totalTimeSpent:   aggregated?.totalTimeSpent ?? 0,
        trend,
        badges,
        companyStats,
        topicStats,
        progressHistory,
      },
    })
  } catch (error) {
    console.error("Dashboard summary error:", error.message)
    res.status(500).json({ success: false, error: "Failed to fetch dashboard data" })
  }
})

export default router