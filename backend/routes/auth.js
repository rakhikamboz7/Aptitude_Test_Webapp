import express from "express"
import jwt from "jsonwebtoken"
import User from "../models/User.js";
import auth from "../middleware/auth.js";

const router = express.Router()

// Register new user
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, firstName, lastName } = req.body

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        error: "Username, email, and password are required",
      })
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: "Password must be at least 6 characters long",
      })
    }

    if (username.length < 3) {
      return res.status(400).json({
        success: false,
        error: "Username must be at least 3 characters long",
      })
    }

    // Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: "Please provide a valid email address",
      })
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username }],
    })

    if (existingUser) {
      if (existingUser.email === email.toLowerCase()) {
        return res.status(400).json({
          success: false,
          error: "An account with this email already exists",
        })
      }
      return res.status(400).json({
        success: false,
        error: "Username is already taken",
      })
    }

    // Create new user
    const user = new User({
      username,
      email: email.toLowerCase(),
      password,
      profile: {
        firstName: firstName || "",
        lastName: lastName || "",
      },
    })

    await user.save()

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "fallback-secret-key-change-in-production",
      { expiresIn: "30d" }
    )

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: user.toJSON(),
    })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({
      success: false,
      error: "Failed to register user. Please try again.",
    })
  }
})

// Login user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required",
      })
    }

    // Find user by email and include password field
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password")
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password",
      })
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        error: "Your account has been deactivated. Please contact support.",
      })
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password",
      })
    }

    // Update last login
    user.lastLogin = new Date()
    await user.save()

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "fallback-secret-key-change-in-production",
      { expiresIn: "30d" }
    )

    // Remove password from response
    const userResponse = user.toJSON()

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: userResponse,
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({
      success: false,
      error: "Failed to login. Please try again.",
    })
  }
})

// Get current user profile
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId)

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      })
    }

    res.json({
      success: true,
      user: user.toJSON(),
    })
  } catch (error) {
    console.error("Profile fetch error:", error)
    res.status(500).json({
      success: false,
      error: "Failed to fetch profile",
    })
  }
})

// Update user profile
router.put("/profile", auth, async (req, res) => {
  try {
    const { firstName, lastName, dateOfBirth, education, occupation, targetCompany, preferredDifficulty } = req.body

    const user = await User.findById(req.userId)
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      })
    }

    // Update profile fields
    if (firstName !== undefined) user.profile.firstName = firstName
    if (lastName !== undefined) user.profile.lastName = lastName
    if (dateOfBirth !== undefined) user.profile.dateOfBirth = dateOfBirth
    if (education !== undefined) user.profile.education = education
    if (occupation !== undefined) user.profile.occupation = occupation
    if (targetCompany !== undefined) user.profile.targetCompany = targetCompany
    if (preferredDifficulty !== undefined) user.preferences.preferredDifficulty = preferredDifficulty

    await user.save()

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: user.toJSON(),
    })
  } catch (error) {
    console.error("Profile update error:", error)
    res.status(500).json({
      success: false,
      error: "Failed to update profile",
    })
  }
})

// Save assessment result
router.post("/save-assessment", auth, async (req, res) => {
  try {
    const { assessmentId, company, difficulty, score, correctAnswers, totalQuestions, timeSpent, badge, topicBreakdown } = req.body

    const user = await User.findById(req.userId)
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      })
    }

    // Add assessment using the model method
    await user.addAssessment({
      assessmentId: assessmentId || Date.now().toString(),
      company: company || "general",
      difficulty,
      score,
      correctAnswers,
      totalQuestions,
      timeSpent,
      badge,
      topicBreakdown,
    })

    res.json({
      success: true,
      message: "Assessment saved successfully",
      user: user.toJSON(),
    })
  } catch (error) {
    console.error("Save assessment error:", error)
    res.status(500).json({
      success: false,
      error: "Failed to save assessment",
    })
  }
})

// Change password
router.put("/change-password", auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: "Current password and new password are required",
      })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: "New password must be at least 6 characters long",
      })
    }

    const user = await User.findById(req.userId).select("+password")
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      })
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword)
    if (!isCurrentPasswordValid) {
      return res.status(401).json({
        success: false,
        error: "Current password is incorrect",
      })
    }

    // Update password
    user.password = newPassword
    await user.save()

    res.json({
      success: true,
      message: "Password changed successfully",
    })
  } catch (error) {
    console.error("Password change error:", error)
    res.status(500).json({
      success: false,
      error: "Failed to change password",
    })
  }
})

// Get user statistics
router.get("/statistics", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      })
    }

    res.json({
      success: true,
      statistics: user.statistics,
      recentAssessments: user.assessmentHistory.slice(0, 10),
    })
  } catch (error) {
    console.error("Statistics fetch error:", error)
    res.status(500).json({
      success: false,
      error: "Failed to fetch statistics",
    })
  }
})

export default router