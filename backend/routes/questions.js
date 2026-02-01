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

    const companyContext = company && company !== "general" 
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
- Use simple quotes or escape quotes properly
- Ensure all JSON is valid and parseable`

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000)

    try {
      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { 
            role: "system", 
            content: "You are a question generator that outputs ONLY valid JSON arrays. Never use markdown formatting. Never include line breaks in strings. Always escape special characters properly." 
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.3,
        max_tokens: 4000,
      })

      clearTimeout(timeoutId)

      const generatedText = completion.choices[0]?.message?.content || ""
      console.log("Generated text length:", generatedText.length)

      // Clean the text before parsing
      let cleanedText = generatedText.trim()
      
      // Remove markdown code blocks if present
      cleanedText = cleanedText.replace(/```json\s*/g, "").replace(/```\s*/g, "")
      
      // Remove any text before the first [ and after the last ]
      const startIndex = cleanedText.indexOf("[")
      const endIndex = cleanedText.lastIndexOf("]")
      
      if (startIndex === -1 || endIndex === -1) {
        throw new Error("No valid JSON array found in response")
      }
      
      cleanedText = cleanedText.substring(startIndex, endIndex + 1)
      
      // Fix common JSON issues
      cleanedText = cleanedText
        .replace(/\n/g, " ")           // Replace newlines with spaces
        .replace(/\r/g, "")            // Remove carriage returns
        .replace(/\t/g, " ")           // Replace tabs with spaces
        .replace(/\\/g, "\\\\")        // Escape backslashes (but not already escaped)
        .replace(/\\\\"/g, '\\"')      // Fix over-escaped quotes
        .replace(/([^\\])"/g, '$1\\"') // Escape unescaped quotes in strings (simple approach)
      
      console.log("Attempting to parse cleaned JSON...")

      let questions
      try {
        questions = JSON.parse(cleanedText)
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError.message)
        console.error("Cleaned text sample:", cleanedText.substring(0, 500))
        
        // Try a more aggressive cleaning approach
        console.log("Trying aggressive cleaning...")
        
        // Try to fix control characters
        cleanedText = cleanedText.replace(/[\x00-\x1F\x7F-\x9F]/g, "")
        
        questions = JSON.parse(cleanedText)
      }

      if (!Array.isArray(questions) || questions.length !== 15) {
        throw new Error(`Expected 15 questions, got ${questions?.length || 0}`)
      }

      // Validate and normalize each question
      const validatedQuestions = questions.map((q, index) => {
        // Ensure correctAnswer is uppercase and a single letter
        const correctAnswer = String(q.correctAnswer || "A").toUpperCase().trim()
        
        if (!["A", "B", "C", "D"].includes(correctAnswer)) {
          console.warn(`Question ${index + 1} has invalid correctAnswer: ${correctAnswer}, defaulting to A`)
        }

        return {
          id: index + 1,
          question: String(q.question || "").trim(),
          options: Array.isArray(q.options) 
            ? q.options.map(opt => String(opt || "").trim()).slice(0, 4)
            : ["Option A", "Option B", "Option C", "Option D"],
          correctAnswer: ["A", "B", "C", "D"].includes(correctAnswer) ? correctAnswer : "A",
          explanation: String(q.explanation || "").trim(),
          topic: String(q.topic || topics[0]).toLowerCase().trim(),
          difficulty: difficulty,
          sessionId: Date.now().toString(),
          timeGenerated: new Date().toISOString(),
        }
      })

      console.log("Questions validated successfully")
      console.log("Sample question:", validatedQuestions[0])

      const sessionId = Date.now().toString()

      res.json({
        success: true,
        data: {
          questions: validatedQuestions,
          sessionId,
          difficulty,
          totalQuestions: 15,
          timeLimit: 25 * 60, // 25 minutes in seconds
        },
      })
    } catch (error) {
      clearTimeout(timeoutId)
      if (error.name === "AbortError") {
        throw new Error("Question generation timeout - please try again")
      }
      throw error
    }
  } catch (error) {
    console.error("Generate questions error:", error.message)
    console.error("Error stack:", error.stack)
    res.status(500).json({
      success: false,
      message: "Failed to generate questions",
      error: error.message,
    })
  }
})

export default router