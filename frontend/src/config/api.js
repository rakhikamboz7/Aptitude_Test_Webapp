const API_BASE_URL =  "http://localhost:5000"

export const API_ENDPOINTS = {
  GENERATE_QUESTIONS: `${API_BASE_URL}/api/questions/generate`,
  GENERATE_FEEDBACK: `${API_BASE_URL}/api/feedback/generate`,
  HEALTH_CHECK: `${API_BASE_URL}/health`,
}

export default API_BASE_URL