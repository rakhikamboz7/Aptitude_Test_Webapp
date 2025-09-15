import express from "express"
const router = express.Router()

// Generate 15 aptitude test questions using Gemini API
router.post("/generate", async (req, res) => {
  try {
    const { difficulty = "medium", topics = ["numerical", "logical", "verbal"] } = req.body

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "Gemini API key is missing",
      })
    }

    const prompt = `Generate exactly 15 aptitude test questions for ${difficulty} difficulty level covering these topics: ${topics.join(", ")}.

For each question, provide:
1. A clear, concise question
2. Four multiple choice options (A, B, C, D)
3. The correct answer (A, B, C, or D)
4. A brief explanation of why the answer is correct
5. The topic category (numerical, logical, verbal, spatial, or analytical)

Format as JSON array with this structure:
[
  {
    "id": 1,
    "question": "Question text here",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "A",
    "explanation": "Explanation here",
    "topic": "numerical",
    "difficulty": "${difficulty}"
  }
]

Make sure questions are varied, engaging, and appropriate for ${difficulty} level. Include a good mix of numerical reasoning, logical puzzles, verbal comprehension, and analytical thinking questions.`

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000)

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.3, // Reduced temperature for faster, more consistent responses
              maxOutputTokens: 3000, // Reduced token limit for faster generation
              topP: 0.9,
              topK: 20, // Reduced topK for faster processing
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
      const jsonMatch = generatedText.match(/\[[\s\S]*\]/)
      if (!jsonMatch) {
        throw new Error("No valid JSON found in Gemini response")
      }

      const questions = JSON.parse(jsonMatch[0])

      // Validate that we have exactly 15 questions
      if (!Array.isArray(questions) || questions.length !== 15) {
        throw new Error("Invalid number of questions generated")
      }

      // Add timestamp and session ID
      const sessionId = Date.now().toString()
      const questionsWithMetadata = questions.map((q, index) => ({
        ...q,
        id: index + 1,
        sessionId,
        timeGenerated: new Date().toISOString(),
      }))

      res.json({
        success: true,
        data: {
          questions: questionsWithMetadata,
          sessionId,
          difficulty,
          totalQuestions: 15,
          timeLimit: 25 * 60, // 25 minutes in seconds
        },
      })
    } catch (error) {
      clearTimeout(timeoutId)
      if (error.name === "AbortError") {
        throw new Error("Request timeout - please try again")
      }
      throw error
    }
  } catch (error) {
    console.error("Generate questions error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to generate questions",
      error: error.message,
    })
  }
})

export default router;
