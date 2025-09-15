import { API_ENDPOINTS } from "../config/api"

export const generateQuestions = async (difficulty = "medium", topics = ["numerical", "logical", "verbal"]) => {
  try {
    const response = await fetch(API_ENDPOINTS.GENERATE_QUESTIONS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ difficulty, topics }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Failed to generate questions")
    }

    return data
  } catch (error) {
    console.error("Generate questions error:", error)
    throw error
  }
}

export const generateFeedback = async (answers, questions, difficulty, timeSpent) => {
  try {
    const response = await fetch(API_ENDPOINTS.GENERATE_FEEDBACK, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        answers,
        questions,
        difficulty,
        timeSpent,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Failed to generate feedback")
    }

    return data
  } catch (error) {
    console.error("Generate feedback error:", error)
    throw error
  }
}

export const checkBackendHealth = async () => {
  try {
    const response = await fetch(API_ENDPOINTS.HEALTH_CHECK)
    const data = await response.json()
    return data
  } catch (error) {
    console.error("Backend health check failed:", error)
    throw error
  }
}
