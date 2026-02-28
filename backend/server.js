import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import questionsRoute from "./routes/questions.js"
import feedbackRoute from "./routes/feedback.js"
import authRoutes from "./routes/auth.js"
import mongoose from "mongoose"
dotenv.config()


mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err))

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use("/api/questions",  questionsRoute)
app.use ("/api/auth",  authRoutes)
app.use("/api/feedback", feedbackRoute)

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Aptitude Test API Server is running" })
})
console.log("Groq key:", process.env.GROQ_API_KEY?.slice(0,10));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server Error:", err)
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : "Something went wrong",
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).send("Route not found");
});

app.listen(PORT, () => {
  console.log(`Aptitude Test API Server running on port ${PORT}`)
  console.log(`Health check: http://localhost:${PORT}/health`)
})

export default app;