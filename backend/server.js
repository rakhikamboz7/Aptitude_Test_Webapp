import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import mongoose from "mongoose"

import authRoutes       from "./routes/auth.js"
import assessmentRoutes from "./routes/assessments.js"
import dashboardRoutes  from "./routes/progress.js"

dotenv.config()

const app  = express()
const PORT = process.env.PORT || 5000


mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message)
    process.exit(1)
  })

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors())
app.use(express.json())

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/auth",        authRoutes)        // signup, login, me, change-password
app.use("/api/assessments", assessmentRoutes)  // start, submit, list, get by id
app.use("/api/dashboard",   dashboardRoutes)   // summary (powers ProgressPage)

// ─── Health check ─────────────────────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    db: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  })
})

// ─── 404 ──────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.path} not found`,
  })
})

// ─── Centralized error handler ────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err)
  res.status(err.status || 500).json({
    success: false,
    error: process.env.NODE_ENV === "development" ? err.message : "Internal server error",
  })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`📊 Health: http://localhost:${PORT}/health`)
})

export default app