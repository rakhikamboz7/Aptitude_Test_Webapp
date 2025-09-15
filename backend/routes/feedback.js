import express from "express"
const router = express.Router();

// Generate personalized feedback using Gemini API
router.post("/generate", async (req, res) => {
  try {
    const { answers, questions, difficulty, timeSpent } = req.body

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "Gemini API key is missing",
      })
    }

    // Calculate basic metrics
    const totalQuestions = questions.length
    const correctAnswers = answers.filter((answer, index) => answer === questions[index].correctAnswer).length
    const score = Math.round((correctAnswers / totalQuestions) * 100)

    // Prepare detailed analysis for Gemini
    const analysisData = questions.map((question, index) => ({
      question: question.question,
      topic: question.topic,
      correctAnswer: question.correctAnswer,
      userAnswer: answers[index] || "Not answered",
      isCorrect: answers[index] === question.correctAnswer,
      explanation: question.explanation,
    }))

    const prompt = `As an expert aptitude test tutor, analyze this student's performance and provide comprehensive feedback.

Test Details:
- Difficulty Level: ${difficulty}
- Total Questions: ${totalQuestions}
- Correct Answers: ${correctAnswers}
- Score: ${score}%
- Time Spent: ${Math.round(timeSpent / 60)} minutes

Question Analysis:
${analysisData
  .map(
    (item, index) => `
Question ${index + 1} (${item.topic}):
- Question: ${item.question}
- Correct Answer: ${item.correctAnswer}
- Student Answer: ${item.userAnswer}
- Result: ${item.isCorrect ? "Correct" : "Incorrect"}
`,
  )
  .join("")}

Please provide:
1. Overall Performance Summary (2-3 sentences)
2. Strengths (what they did well)
3. Areas for Improvement (specific topics/skills to focus on)
4. Topic-wise breakdown with scores
5. Personalized study recommendations
6. Motivational message and next steps

Format as JSON:
{
  "overallSummary": "Summary text",
  "strengths": ["strength1", "strength2"],
  "improvements": ["area1", "area2"],
  "topicBreakdown": {
    "numerical": { "correct": 0, "total": 0, "percentage": 0 },
    "logical": { "correct": 0, "total": 0, "percentage": 0 },
    "verbal": { "correct": 0, "total": 0, "percentage": 0 }
  },
  "recommendations": ["recommendation1", "recommendation2"],
  "motivationalMessage": "Encouraging message",
  "nextSteps": ["step1", "step2"]
}`

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 25000)

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.4,
              maxOutputTokens: 2048,
              topP: 0.9,
            },
          }),
          signal: controller.signal,
        },
      )

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`Gemini Error ${response.status}: ${JSON.stringify(errorData)}`)
      }

      const data = await response.json()
      const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text || ""

      // Extract JSON from the response
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error("No valid JSON found in Gemini response")
      }

      const feedback = JSON.parse(jsonMatch[0])

      // Calculate topic breakdown from actual answers
      const topicStats = {}
      questions.forEach((question, index) => {
        const topic = question.topic
        if (!topicStats[topic]) {
          topicStats[topic] = { correct: 0, total: 0 }
        }
        topicStats[topic].total++
        if (answers[index] === question.correctAnswer) {
          topicStats[topic].correct++
        }
      })

      // Add percentages to topic breakdown
      Object.keys(topicStats).forEach((topic) => {
        topicStats[topic].percentage = Math.round((topicStats[topic].correct / topicStats[topic].total) * 100)
      })

      const result = {
        success: true,
        data: {
          score,
          correctAnswers,
          totalQuestions,
          timeSpent: Math.round(timeSpent / 60),
          feedback: {
            ...feedback,
            topicBreakdown: topicStats,
          },
          detailedResults: analysisData,
          timestamp: new Date().toISOString(),
        },
      }

      res.json(result)
    } catch (error) {
      clearTimeout(timeoutId)
      if (error.name === "AbortError") {
        throw new Error("Feedback generation timeout - please try again")
      }
      throw error
    }
  } catch (error) {
    console.error("Generate feedback error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to generate feedback",
      error: error.message,
    })
  }
})

export default router;
