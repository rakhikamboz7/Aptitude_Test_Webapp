import express from "express"
const router = express.Router();

// Generate personalized feedback using Gemini API
router.post("/generate", async (req, res) => {
  try {
    const { answers, questions, difficulty, timeSpent, company } = req.body

    // Validate request
    if (!answers || !questions || !Array.isArray(questions)) {
      return res.status(400).json({
        success: false,
        message: "Invalid request: answers and questions are required",
      })
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "Gemini API key is not configured",
      })
    }

    // Calculate basic metrics
    const totalQuestions = questions.length
    const correctAnswers = answers.filter((answer, index) => answer === questions[index].correctAnswer).length
    const score = Math.round((correctAnswers / totalQuestions) * 100)

    // Determine badge level
    let badgeLevel = "beginner"
    let badgeColor = "yellow"
    if (score >= 80) {
      badgeLevel = "advanced"
      badgeColor = "purple"
    } else if (score >= 60) {
      badgeLevel = "intermediate"
      badgeColor = "blue"
    }

    // Prepare detailed analysis for Gemini
    const analysisData = questions.map((question, index) => ({
      question: question.question,
      topic: question.topic,
      correctAnswer: question.correctAnswer,
      userAnswer: answers[index] || "Not answered",
      isCorrect: answers[index] === question.correctAnswer,
      explanation: question.explanation,
    }))

    const companyContext = company && company !== "general" 
      ? `This was a ${company.toUpperCase()} company-specific assessment.` 
      : ""

    const prompt = `As an expert aptitude test tutor, analyze this student's performance and provide comprehensive, encouraging feedback.

Test Details:
- Company Focus: ${company || "General Assessment"}
- Difficulty Level: ${difficulty}
- Total Questions: ${totalQuestions}
- Correct Answers: ${correctAnswers}
- Score: ${score}%
- Time Spent: ${Math.round(timeSpent / 60)} minutes
- Badge Earned: ${badgeLevel.toUpperCase()}

${companyContext}

Question Analysis:
${analysisData
  .map(
    (item, index) => `
Question ${index + 1} (${item.topic}):
- Question: ${item.question}
- Correct Answer: ${item.correctAnswer}
- Student Answer: ${item.userAnswer}
- Result: ${item.isCorrect ? "✓ Correct" : "✗ Incorrect"}
`,
  )
  .join("")}

Please provide detailed, personalized feedback in the following JSON format:
{
  "overallSummary": "2-3 sentence summary of performance with specific mention of their ${badgeLevel} badge achievement",
  "strengths": ["strength1", "strength2", "strength3"],
  "improvements": ["specific area1 with actionable advice", "specific area2 with actionable advice"],
  "recommendations": ["personalized study recommendation1", "personalized study recommendation2", "personalized study recommendation3"],
  "motivationalMessage": "Encouraging message that acknowledges their ${badgeLevel} badge and motivates them to reach the next level",
  "nextSteps": ["concrete next step1", "concrete next step2", "concrete next step3"]
}

Important: Be specific, encouraging, and actionable. Reference their ${badgeLevel} badge achievement positively.`

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [{ 
              parts: [{ text: prompt }] 
            }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 2048,
              topP: 0.9,
              topK: 40,
            },
            safetySettings: [
              {
                category: "HARM_CATEGORY_HARASSMENT",
                threshold: "BLOCK_NONE"
              },
              {
                category: "HARM_CATEGORY_HATE_SPEECH",
                threshold: "BLOCK_NONE"
              },
              {
                category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                threshold: "BLOCK_NONE"
              },
              {
                category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                threshold: "BLOCK_NONE"
              }
            ]
          }),
          signal: controller.signal,
        },
      )

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("Gemini API Error:", errorData)
        throw new Error(`Gemini API returned ${response.status}: ${JSON.stringify(errorData)}`)
      }

      const data = await response.json()
      
      if (!data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error("Invalid response structure from Gemini API")
      }

      const generatedText = data.candidates[0].content.parts[0].text

      // Extract JSON from the response (handle markdown code blocks)
      let jsonText = generatedText
      const jsonMatch = generatedText.match(/```json\s*([\s\S]*?)\s*```/) || generatedText.match(/\{[\s\S]*\}/)
      
      if (jsonMatch) {
        jsonText = jsonMatch[1] || jsonMatch[0]
      }

      let feedback
      try {
        feedback = JSON.parse(jsonText)
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError)
        console.error("Generated text:", generatedText)
        throw new Error("Failed to parse AI feedback as JSON")
      }

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
          badge: {
            level: badgeLevel,
            color: badgeColor,
            message: `You've earned the ${badgeLevel.toUpperCase()} badge!`
          },
          company: company || "general",
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