import express from "express"
import Groq from "groq-sdk"
import Assessment from "../models/Assessment.js"
import auth from "../middleware/auth.js"

import dotenv from "dotenv"
dotenv.config()
const router = express.Router()
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

// ─── Parse AI JSON response ───────────────────────────────────────────────────
const parseQuestionsFromAI = (rawText) => {
  let cleaned = rawText.trim()
  cleaned = cleaned.replace(/```json\s*/gi, "").replace(/```\s*/g, "")
  const start = cleaned.indexOf("[")
  const end = cleaned.lastIndexOf("]")
  if (start === -1 || end === -1) throw new Error("No JSON array found in AI response")
  cleaned = cleaned.substring(start, end + 1)
    .replace(/\r\n/g, " ").replace(/\n/g, " ").replace(/\r/g, " ")
    .replace(/\t/g, " ").replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
  const parsed = JSON.parse(cleaned)
  if (!Array.isArray(parsed) || parsed.length < 10) {
    throw new Error(`Expected at least 10 questions, got ${parsed?.length ?? 0}`)
  }
  return parsed
}

// ─── Generate questions via Groq ──────────────────────────────────────────────
const generateQuestionsFromGroq = async (difficulty, companyName) => {
  const companyContext = companyName && companyName !== "general"
    ? `Focus on ${companyName.toUpperCase()}-style aptitude questions.` : ""

  const prompt = `Generate exactly 15 aptitude test questions for ${difficulty} difficulty.
${companyContext}

Return ONLY a valid JSON array. No markdown, no explanation.
Format:
[
  {
    "questionText": "What is 15% of 200?",
    "options": ["20", "25", "30", "35"],
    "correctAnswer": "C",
    "topic": "numerical",
    "explanation": "15% of 200 = 0.15 x 200 = 30"
  }
]

Rules:
- correctAnswer must be A, B, C or D
- options array must have exactly 4 items
- No apostrophes or quotes inside string values
- Return raw JSON only`

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: "Output ONLY valid JSON arrays. No markdown. No line breaks inside strings." },
      { role: "user", content: prompt },
    ],
    temperature: 0.3,
    max_tokens: 4000,
  })

  return parseQuestionsFromAI(completion.choices[0]?.message?.content || "")
}

// ─── Generate AI feedback ─────────────────────────────────────────────────────
const generateFeedbackFromGroq = async (questions, userAnswers, score) => {
  const summary = questions.map((q, i) => {
    const answer = userAnswers.find((a) => a.questionIndex === i)
    return {
      topic: q.topic,
      correct: answer?.selectedAnswer === q.correctAnswer,
      userAnswer: answer?.selectedAnswer ?? "unanswered",
      correctAnswer: q.correctAnswer,
    }
  })

  const prompt = `A student scored ${score}% on an aptitude test.
Results: ${JSON.stringify(summary)}

Return ONLY a JSON object (no markdown):
{
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"],
  "suggestions": ["suggestion1", "suggestion2", "suggestion3"]
}`

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: "Output ONLY valid JSON. No markdown." },
      { role: "user", content: prompt },
    ],
    temperature: 0.4,
    max_tokens: 1000,
  })

  let raw = (completion.choices[0]?.message?.content || "{}").trim()
    .replace(/```json\s*/gi, "").replace(/```\s*/g, "")
  const s = raw.indexOf("{"), e = raw.lastIndexOf("}")
  if (s !== -1 && e !== -1) raw = raw.substring(s, e + 1)
  try { return JSON.parse(raw) }
  catch { return { strengths: [], weaknesses: [], suggestions: [] } }
}

// ─── POST /api/assessments/start ─────────────────────────────────────────────
router.post("/start", auth, async (req, res) => {
  try {
    const { companyName = "general", difficulty = "medium" } = req.body

    if (!["easy", "medium", "hard"].includes(difficulty)) {
      return res.status(400).json({ success: false, error: "difficulty must be easy, medium, or hard" })
    }

    // ✅ Delete stale in-progress assessments before creating new one
    await Assessment.deleteMany({ userId: req.userId, status: "in-progress" })

    console.log(`Generating questions — difficulty: ${difficulty}, company: ${companyName}`)
    const rawQuestions = await generateQuestionsFromGroq(difficulty, companyName)

    const questions = rawQuestions.slice(0, 15).map((q) => ({
      questionText: String(q.questionText || "").trim(),
      options: Array.isArray(q.options)
        ? q.options.map((o) => String(o).trim()).slice(0, 4)
        : ["Option A", "Option B", "Option C", "Option D"],
      correctAnswer: ["A", "B", "C", "D"].includes(String(q.correctAnswer).toUpperCase())
        ? String(q.correctAnswer).toUpperCase() : "A",
      topic: String(q.topic || "general").toLowerCase().trim(),
      explanation: String(q.explanation || "").trim(),
    }))

    const assessment = new Assessment({
      userId: req.userId,
      companyName: companyName.toLowerCase(),
      difficulty,
      status: "in-progress",
      questions,
      totalQuestions: questions.length,
      startTime: new Date(),
    })

    await assessment.save()

    res.status(201).json({
      success: true,
      assessmentId: assessment._id,
      questions: assessment.getSafeQuestions(), // no correctAnswer sent to client
      totalQuestions: questions.length,
      timeLimit: 25 * 60,
      difficulty,
      companyName,
    })
  } catch (error) {
    console.error("Start assessment error:", error.message)
    res.status(500).json({ success: false, error: "Failed to start assessment. Please try again." })
  }
})

// ─── POST /api/assessments/:id/submit ────────────────────────────────────────
router.post("/:id/submit", auth, async (req, res) => {
  try {
    const { answers } = req.body
    // answers: [{ questionIndex: 0, selectedAnswer: "B" }, ...]

    if (!Array.isArray(answers)) {
      return res.status(400).json({ success: false, error: "answers must be an array" })
    }

    const assessment = await Assessment.findById(req.params.id)
    if (!assessment) {
      return res.status(404).json({ success: false, error: "Assessment not found" })
    }
    if (assessment.userId.toString() !== req.userId) {
      return res.status(403).json({ success: false, error: "Access denied" })
    }
    if (assessment.status === "completed") {
      return res.status(409).json({ success: false, error: "Assessment already submitted" })
    }

    // ── Server-side scoring ───────────────────────────────────────────────────
    const userAnswers = answers.map((a) => ({
      questionIndex: a.questionIndex,
      selectedAnswer: ["A", "B", "C", "D"].includes(a.selectedAnswer) ? a.selectedAnswer : null,
    }))

    let correctCount = 0
    const topicBreakdown = {}

    assessment.questions.forEach((q, i) => {
      const topic = q.topic || "general"
      if (!topicBreakdown[topic]) topicBreakdown[topic] = { correct: 0, total: 0, percentage: 0 }
      topicBreakdown[topic].total++
      const userAnswer = userAnswers.find((a) => a.questionIndex === i)
      if (userAnswer?.selectedAnswer === q.correctAnswer) {
        correctCount++
        topicBreakdown[topic].correct++
      }
    })

    Object.keys(topicBreakdown).forEach((topic) => {
      const t = topicBreakdown[topic]
      t.percentage = Math.round((t.correct / t.total) * 100)
    })

    const totalQ   = assessment.questions.length
    const score    = Math.round((correctCount / totalQ) * 100)
    const endTime  = new Date()
    const totalTime = Math.round((endTime - assessment.startTime) / 1000)

    // ── AI feedback ───────────────────────────────────────────────────────────
    let feedbackData = { strengths: [], weaknesses: [], suggestions: [] }
    try {
      feedbackData = await generateFeedbackFromGroq(assessment.questions, userAnswers, score)
    } catch (fbErr) {
      console.warn("Feedback generation failed (non-blocking):", fbErr.message)
    }

    // ── Update and save ───────────────────────────────────────────────────────
    assessment.status             = "completed"
    assessment.userAnswers        = userAnswers
    assessment.score              = score
    assessment.accuracy           = score
    assessment.correctAnswersCount = correctCount
    assessment.endTime            = endTime
    assessment.totalTime          = totalTime
    assessment.badge              = assessment.calculateBadge()
    assessment.feedback = {
      ...feedbackData,
      topicBreakdown,
      generatedAt: new Date(),
    }

    await assessment.save()

    res.json({
      success: true,
      result: {
        assessmentId: assessment._id,
        score,
        accuracy: score,
        correctAnswers: correctCount,
        totalQuestions: totalQ,
        totalTime,
        badge: assessment.badge,
        feedback: assessment.feedback,
      },
    })
  } catch (error) {
    console.error("Submit assessment error:", error.message)
    res.status(500).json({ success: false, error: "Failed to submit assessment. Please try again." })
  }
})

// ─── GET /api/assessments ─────────────────────────────────────────────────────
router.get("/", auth, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query
    const filter = { userId: req.userId }
    if (status && ["draft", "in-progress", "completed"].includes(status)) {
      filter.status = status
    }

    const skip = (parseInt(page) - 1) * parseInt(limit)
    const [assessments, total] = await Promise.all([
      Assessment.find(filter)
        .select("-questions.correctAnswer -questions.explanation")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Assessment.countDocuments(filter),
    ])

    res.json({
      success: true,
      assessments,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    })
  } catch (error) {
    console.error("List assessments error:", error.message)
    res.status(500).json({ success: false, error: "Failed to fetch assessments" })
  }
})

// ─── GET /api/assessments/:id ─────────────────────────────────────────────────
router.get("/:id", auth, async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id)
    if (!assessment) {
      return res.status(404).json({ success: false, error: "Assessment not found" })
    }
    if (assessment.userId.toString() !== req.userId) {
      return res.status(403).json({ success: false, error: "Access denied" })
    }

    const data = assessment.toObject()
    if (assessment.status !== "completed") {
      data.questions = data.questions.map(({ correctAnswer, explanation, ...safe }) => safe)
    }

    res.json({ success: true, assessment: data })
  } catch (error) {
    console.error("Get assessment error:", error.message)
    res.status(500).json({ success: false, error: "Failed to fetch assessment" })
  }
})

export default router