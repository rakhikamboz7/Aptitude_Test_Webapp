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
    const { difficulty = "medium", topics = ["numerical", "logical", "verbal"], company } = req.body

    console.log("Generating questions:", { difficulty, topics, company })

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "Groq API key is missing",
      })
    }

    const companyContext =
      company && company !== "general"
        ? `Focus on ${company.toUpperCase()}-style questions that match their typical assessment patterns.`
        : ""

    const prompt = `Generate exactly 15 aptitude test questions for ${difficulty} difficulty level covering these topics: ${topics.join(", ")}.

${companyContext}

For each question, provide:
1. A clear, concise question
2. Four multiple choice options (A, B, C, D)
3. The correct answer as a single letter (A, B, C, or D)
4. A brief explanation of why the answer is correct
5. The topic category

CRITICAL: Format as a valid JSON array. Use only plain text - NO special characters, NO line breaks inside strings, NO quotes inside quotes.

Return format:
[
  {
    "id": 1,
    "question": "What is 2 plus 2?",
    "options": ["1", "2", "3", "4"],
    "correctAnswer": "D",
    "explanation": "2 plus 2 equals 4",
    "topic": "numerical",
    "difficulty": "${difficulty}"
  }
]

IMPORTANT: 
- Return ONLY the JSON array, no markdown, no code blocks, no extra text
- Keep all text on single lines (no line breaks in strings)
- Do NOT use apostrophes or quotes inside string values
- Ensure all JSON is valid and parseable`

    try {
      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content:
              "You are a question generator that outputs ONLY valid JSON arrays. Never use markdown formatting. Never include line breaks inside string values. Never use apostrophes or quotation marks inside string values - rephrase to avoid them. Always output raw JSON only.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.3,
        max_tokens: 4000,
      })

      const generatedText = completion.choices[0]?.message?.content || ""
      console.log("Generated text length:", generatedText.length)

      // ✅ FIXED: Clean the text safely without breaking JSON structure
      let cleanedText = generatedText.trim()

      // Step 1: Remove markdown code fences
      cleanedText = cleanedText.replace(/```json\s*/gi, "").replace(/```\s*/g, "")

      // Step 2: Extract just the JSON array
      const startIndex = cleanedText.indexOf("[")
      const endIndex = cleanedText.lastIndexOf("]")

      if (startIndex === -1 || endIndex === -1) {
        throw new Error("No valid JSON array found in response")
      }

      cleanedText = cleanedText.substring(startIndex, endIndex + 1)

      // Step 3: Only remove control characters that break JSON - DO NOT touch quotes or backslashes
      cleanedText = cleanedText
        .replace(/\r\n/g, " ")   // Windows line endings → space
        .replace(/\n/g, " ")     // Unix line endings → space
        .replace(/\r/g, " ")     // Old Mac line endings → space
        .replace(/\t/g, " ")     // Tabs → space
        .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "") // Remove other control chars

      console.log("Attempting to parse cleaned JSON...")
      console.log("Sample:", cleanedText.substring(0, 300))

      let questions
      try {
        questions = JSON.parse(cleanedText)
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError.message)
        console.error("Text around error position:", cleanedText.substring(0, 500))

        // Last resort: try to extract individual question objects using a regex-free approach
        // Re-request with stricter prompt if first attempt fails
        throw new Error(`JSON parsing failed: ${parseError.message}`)
      }

      if (!Array.isArray(questions)) {
        throw new Error("Response is not a JSON array")
      }

      if (questions.length < 10) {
        throw new Error(`Too few questions generated: got ${questions.length}, expected 15`)
      }

      // Validate and normalize each question
      const validatedQuestions = questions.slice(0, 15).map((q, index) => {
        const correctAnswer = String(q.correctAnswer || "A").toUpperCase().trim()

        if (!["A", "B", "C", "D"].includes(correctAnswer)) {
          console.warn(`Question ${index + 1} has invalid correctAnswer: ${correctAnswer}, defaulting to A`)
        }

        return {
          id: index + 1,
          question: String(q.question || "").trim(),
          options: Array.isArray(q.options)
            ? q.options.map((opt) => String(opt || "").trim()).slice(0, 4)
            : ["Option A", "Option B", "Option C", "Option D"],
          correctAnswer: ["A", "B", "C", "D"].includes(correctAnswer) ? correctAnswer : "A",
          explanation: String(q.explanation || "").trim(),
          topic: String(q.topic || topics[0]).toLowerCase().trim(),
          difficulty: difficulty,
          sessionId: Date.now().toString(),
          timeGenerated: new Date().toISOString(),
        }
      })

      console.log(`✅ ${validatedQuestions.length} questions validated successfully`)
      console.log("Sample question:", validatedQuestions[0])

      const sessionId = Date.now().toString()

      res.json({
        success: true,
        data: {
          questions: validatedQuestions,
          sessionId,
          difficulty,
          totalQuestions: validatedQuestions.length,
          timeLimit: 25 * 60,
        },
      })
    } catch (error) {
      if (error.name === "AbortError") {
        throw new Error("Question generation timeout - please try again")
      }
      throw error
    }
  } catch (error) {
    console.error("Generate questions error:", error.message)
    res.status(500).json({
      success: false,
      message: "Failed to generate questions",
      error: error.message,
    })
  }
})

export default router