const express = require("express")
const jwt = require("jsonwebtoken")
const User = require("../models/User")
const auth = require("../middleware/auth")

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

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    })

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "User with this email or username already exists",
      })
    }

    // Create new user
    const user = new User({
      username,
      email,
      password,
      profile: {
        firstName: firstName || "",
        lastName: lastName || "",
      },
    })

    await user.save()

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "fallback-secret-key", { expiresIn: "7d" })

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
      error: "Failed to register user",
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

    // Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password",
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
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "fallback-secret-key", { expiresIn: "7d" })

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: user.toJSON(),
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({
      success: false,
      error: "Failed to login",
    })
  }
})

// Get current user profile
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate({
      path: "testHistory.testId",
      select: "score difficulty createdAt",
    })

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
    const { firstName, lastName, dateOfBirth, education, occupation, preferredDifficulty } = req.body

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

    const user = await User.findById(req.userId)
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

module.exports = router
