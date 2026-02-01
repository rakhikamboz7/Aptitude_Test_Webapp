import express from "express"
import Groq from "groq-sdk"
import dotenv from "dotenv"
dotenv.config()
const router = express.Router()

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
  
})



router.post("/generate", async (req, res) => {
  try {
    const { difficulty = "medium", topics = ["numerical", "logical", "verbal"] } = req.body

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "Groq API key is missing",
      })
    }

    const prompt = `Generate exactly 15 aptitude test questions for ${difficulty} difficulty level covering these topics: ${topics.join(", ")}.

For each question, provide:
1. A clear, concise question
2. Four multiple choice options (A, B, C, D)
3. The correct answer (A, B, C, or D)
4. A brief explanation of why the answer is correct
5. The topic category (numerical, logical, verbal, spatial, or analytical)

Format strictly as JSON array with this structure:
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

Return only valid JSON (no markdown, no extra text).`

    // Call Groq LLM
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile", // or "llama3-70b-8192" for Llama 3
      messages: [
        { role: "system", content: "You are a question generator that only outputs valid JSON." },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
      max_tokens: 3000,
    })

    const generatedText = completion.choices[0]?.message?.content || ""

    // Try parsing JSON
    const jsonMatch = generatedText.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      throw new Error("No valid JSON found in Groq response")
    }

    const questions = JSON.parse(jsonMatch[0])

    if (!Array.isArray(questions) || questions.length !== 15) {
      throw new Error("Invalid number of questions generated")
    }

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
        timeLimit: 25 * 60,
      },
    })
  } catch (error) {
    console.error("Generate questions error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to generate questions",
      error: error.message,
    })
  }
})

export default router
