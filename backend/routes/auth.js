import express from "express"
import jwt from "jsonwebtoken"
import User from "../models/User.js"
import auth from "../middleware/auth.js"

const router = express.Router()

const generateToken = (userId) =>
  jwt.sign(
    { userId },
    process.env.JWT_SECRET || "fallback-secret-key-change-in-production",
    { expiresIn: "30d" }
  )

// ─── POST /api/auth/signup ────────────────────────────────────────────────────
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: "Name, email, and password are required" })
    }
    if (name.trim().length < 2) {
      return res.status(400).json({ success: false, error: "Name must be at least 2 characters" })
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, error: "Password must be at least 6 characters" })
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ success: false, error: "Please provide a valid email address" })
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return res.status(409).json({ success: false, error: "An account with this email already exists" })
    }

    const user = new User({
      name: name.trim(),
      email: email.toLowerCase(),
      passwordHash: password, // pre-save hook will hash this
    })

    await user.save()
    const token = generateToken(user._id)

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      user: user.toJSON(),
    })
  } catch (error) {
    console.error("Signup error:", error)
    res.status(500).json({ success: false, error: "Failed to create account. Please try again." })
  }
})

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ success: false, error: "Email and password are required" })
    }

    // ✅ MUST use .select("+passwordHash") since field has select: false
    const user = await User.findOne({ email: email.toLowerCase() }).select("+passwordHash")

    if (!user) {
      return res.status(401).json({ success: false, error: "Invalid email or password" })
    }

    // ✅ comparePassword uses this.passwordHash internally
    const isValid = await user.comparePassword(password)
    if (!isValid) {
      return res.status(401).json({ success: false, error: "Invalid email or password" })
    }

    // ✅ Use updateOne to avoid triggering pre-save bcrypt hook
    await User.updateOne({ _id: user._id }, { lastLogin: new Date() })

    const token = generateToken(user._id)

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: user.toJSON(),
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ success: false, error: "Failed to login. Please try again." })
  }
})

// ─── GET /api/auth/me (protected) ────────────────────────────────────────────
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" })
    }
    res.json({ success: true, user: user.toJSON() })
  } catch (error) {
    console.error("Get me error:", error)
    res.status(500).json({ success: false, error: "Failed to fetch user" })
  }
})

// ─── PUT /api/auth/change-password (protected) ───────────────────────────────
router.put("/change-password", auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, error: "Both passwords are required" })
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, error: "New password must be at least 6 characters" })
    }

    const user = await User.findById(req.userId).select("+passwordHash")
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" })
    }

    const isValid = await user.comparePassword(currentPassword)
    if (!isValid) {
      return res.status(401).json({ success: false, error: "Current password is incorrect" })
    }

    // Setting passwordHash triggers pre-save hook to re-hash — this is intentional
    user.passwordHash = newPassword
    await user.save()

    res.json({ success: true, message: "Password changed successfully" })
  } catch (error) {
    console.error("Change password error:", error)
    res.status(500).json({ success: false, error: "Failed to change password" })
  }
})

export default router