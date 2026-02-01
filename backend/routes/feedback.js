import express from "express"
const router = express.Router()

// Generate personalized feedback using Gemini API
router.post("/generate", async (req, res) => {
  try {
    const { answers, questions, difficulty, timeSpent, company } = req.body

    console.log("=== FEEDBACK REQUEST DEBUG ===")
    console.log("Answers received:", answers)
    console.log("Questions count:", questions?.length)
    if (questions && questions.length > 0) {
      console.log("First question correctAnswer:", questions[0].correctAnswer)
      console.log("First answer:", answers[0])
      console.log("Comparison:", answers[0] === questions[0].correctAnswer)
    }
    console.log("=== END DEBUG ===")

    // Validate request
    if (!answers || !questions || !Array.isArray(questions)) {
      return res.status(400).json({
        success: false,
        message: "Invalid request: answers and questions are required",
      })
    }

    if (!process.env.GEMINI_API_KEY) {
      console.error("Gemini API key is missing")
      return res.status(500).json({
        success: false,
        message: "Gemini API key is not configured",
      })
    }

    // Calculate basic metrics
    const totalQuestions = questions.length
    
    // Count correct answers - handle both string and case variations
    const correctAnswers = answers.filter((answer, index) => {
      if (!answer) return false
      const userAnswer = String(answer).toUpperCase().trim()
      const correctAnswer = String(questions[index].correctAnswer).toUpperCase().trim()
      return userAnswer === correctAnswer
    }).length
    
    const score = Math.round((correctAnswers / totalQuestions) * 100)

    console.log("Score calculation details:")
    console.log("- Correct answers:", correctAnswers)
    console.log("- Total questions:", totalQuestions)
    console.log("- Score:", score)

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
    const analysisData = questions.map((question, index) => {
      const userAnswer = String(answers[index] || "Not answered").toUpperCase().trim()
      const correctAnswer = String(question.correctAnswer).toUpperCase().trim()
      
      return {
        question: question.question,
        topic: question.topic,
        correctAnswer: correctAnswer,
        userAnswer: userAnswer,
        isCorrect: userAnswer === correctAnswer,
        explanation: question.explanation,
      }
    })

    const companyContext =
      company && company !== "general" ? `This was a ${company.toUpperCase()} company-specific assessment.` : ""

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

Important: Return ONLY valid JSON without any markdown formatting or code blocks.`

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000)

    try {
      console.log("Calling Gemini API...")
      
      // Use stable Gemini model instead of experimental
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: prompt }],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 2048,
              topP: 0.95,
            },
          }),
          signal: controller.signal,
        }
      )

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("Gemini API Error Response:", errorData)
        
        // Use fallback feedback if Gemini fails
        console.log("Using fallback feedback due to Gemini error")
        const fallbackFeedback = generateFallbackFeedback(score, badgeLevel, correctAnswers, totalQuestions, difficulty)
        
        const result = buildResult(score, correctAnswers, totalQuestions, timeSpent, badgeLevel, badgeColor, company, fallbackFeedback, analysisData, questions, answers)
        return res.json(result)
      }

      const data = await response.json()
      console.log("Gemini API response received")

      if (!data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        console.error("Invalid Gemini response structure")
        const fallbackFeedback = generateFallbackFeedback(score, badgeLevel, correctAnswers, totalQuestions, difficulty)
        const result = buildResult(score, correctAnswers, totalQuestions, timeSpent, badgeLevel, badgeColor, company, fallbackFeedback, analysisData, questions, answers)
        return res.json(result)
      }

      const generatedText = data.candidates[0].content.parts[0].text
      console.log("Generated text received, length:", generatedText.length)

      // Extract JSON from the response
      let jsonText = generatedText
      const jsonMatch = generatedText.match(/```json\s*([\s\S]*?)\s*```/) || generatedText.match(/\{[\s\S]*\}/)

      if (jsonMatch) {
        jsonText = jsonMatch[1] || jsonMatch[0]
      }

      let feedback
      try {
        feedback = JSON.parse(jsonText)
        console.log("Feedback parsed successfully")
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError.message)
        console.log("Using fallback feedback")
        feedback = generateFallbackFeedback(score, badgeLevel, correctAnswers, totalQuestions, difficulty)
      }

      const result = buildResult(score, correctAnswers, totalQuestions, timeSpent, badgeLevel, badgeColor, company, feedback, analysisData, questions, answers)
      
      console.log("Feedback generated successfully")
      res.json(result)
      
    } catch (error) {
      clearTimeout(timeoutId)
      if (error.name === "AbortError") {
        console.error("Gemini API timeout")
      }
      
      // Use fallback on any error
      console.log("Using fallback feedback due to error:", error.message)
      const fallbackFeedback = generateFallbackFeedback(score, badgeLevel, correctAnswers, totalQuestions, difficulty)
      const result = buildResult(score, correctAnswers, totalQuestions, timeSpent, badgeLevel, badgeColor, company, fallbackFeedback, analysisData, questions, answers)
      res.json(result)
    }
  } catch (error) {
    console.error("Generate feedback error:", error.message)
    console.error("Error stack:", error.stack)
    res.status(500).json({
      success: false,
      message: "Failed to generate feedback",
      error: error.message,
    })
  }
})

// Helper function to generate fallback feedback
function generateFallbackFeedback(score, badgeLevel, correctAnswers, totalQuestions, difficulty) {
  const percentage = Math.round((correctAnswers / totalQuestions) * 100)
  
  let strengths = []
  let improvements = []
  let recommendations = []
  
  if (score >= 80) {
    strengths = [
      "Excellent understanding of core concepts across multiple topics",
      "Strong analytical and problem-solving abilities demonstrated",
      "Consistent accuracy in answering questions correctly"
    ]
    improvements = [
      "Focus on mastering the few questions you missed to achieve perfection",
      "Challenge yourself with harder difficulty levels to continue growing",
      "Review explanations for missed questions to understand alternative approaches"
    ]
  } else if (score >= 60) {
    strengths = [
      "Good grasp of fundamental concepts in most topic areas",
      "Demonstrated solid problem-solving approach on several questions",
      "Making steady progress in your learning journey"
    ]
    improvements = [
      "Review topics where you had incorrect answers to strengthen understanding",
      "Practice more questions in your weaker areas to build confidence",
      "Take time to read questions carefully before selecting answers"
    ]
  } else {
    strengths = [
      "Completed the assessment and showed determination to learn",
      "Identified areas where focused study will help most",
      "Taking the first important step in your improvement journey"
    ]
    improvements = [
      "Focus on understanding core concepts before attempting complex problems",
      "Review the explanations for all questions to learn the correct approach",
      "Consider starting with easier difficulty levels to build confidence"
    ]
  }
  
  recommendations = [
    `Review the detailed explanations for all ${totalQuestions - correctAnswers} incorrect answers`,
    "Practice regularly with similar questions to reinforce your learning",
    "Focus on your weaker topic areas identified in the breakdown below",
    "Take notes on common patterns and problem-solving strategies"
  ]

  return {
    overallSummary: `You scored ${score}% on this ${difficulty} difficulty assessment, earning a ${badgeLevel.toUpperCase()} badge. You answered ${correctAnswers} out of ${totalQuestions} questions correctly. ${score >= 60 ? "Great job! Keep up the good work." : "Keep practicing to improve your score."}`,
    strengths,
    improvements,
    recommendations,
    motivationalMessage: `Congratulations on earning your ${badgeLevel.toUpperCase()} badge! ${score >= 80 ? "You're performing at an excellent level. Continue challenging yourself to maintain this momentum." : score >= 60 ? "You're making solid progress. With focused practice on your weak areas, you'll reach the advanced level soon." : "Every expert was once a beginner. Use this assessment to guide your study plan and you'll see improvement with each test."}`,
    nextSteps: [
      "Review all question explanations to understand the correct reasoning",
      "Identify your top 2-3 weak topics and focus study time there",
      "Take another practice test in a few days to track your improvement"
    ]
  }
}

// Helper function to build the result object
function buildResult(score, correctAnswers, totalQuestions, timeSpent, badgeLevel, badgeColor, company, feedback, analysisData, questions, answers) {
  // Calculate topic breakdown
  const topicStats = {}
  questions.forEach((question, index) => {
    const topic = question.topic
    if (!topicStats[topic]) {
      topicStats[topic] = { correct: 0, total: 0 }
    }
    topicStats[topic].total++
    
    const userAnswer = String(answers[index] || "").toUpperCase().trim()
    const correctAnswer = String(question.correctAnswer).toUpperCase().trim()
    
    if (userAnswer === correctAnswer) {
      topicStats[topic].correct++
    }
  })

  // Add percentages
  Object.keys(topicStats).forEach((topic) => {
    topicStats[topic].percentage = Math.round((topicStats[topic].correct / topicStats[topic].total) * 100)
  })

  return {
    success: true,
    data: {
      score,
      correctAnswers,
      totalQuestions,
      timeSpent: Math.round(timeSpent / 60),
      badge: {
        level: badgeLevel,
        color: badgeColor,
        message: `You've earned the ${badgeLevel.toUpperCase()} badge!`,
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
}

export default router