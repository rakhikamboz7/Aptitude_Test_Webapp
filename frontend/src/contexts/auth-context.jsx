import React, { createContext, useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

const AuthContext = createContext(null)

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null)
  const [token, setToken]     = useState(localStorage.getItem("token"))
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // ─── Fetch current user ───────────────────────────────────────────────────
  const fetchUserProfile = async (authToken) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      })
      const data = await response.json()
      if (data.success) {
        setUser(data.user)
        return data.user
      } else {
        throw new Error(data.error || "Failed to fetch user")
      }
    } catch (error) {
      console.error("Profile fetch error:", error)
      logout()
      return null
    }
  }

  // ─── Login ────────────────────────────────────────────────────────────────
  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await response.json()
      if (data.success) {
        localStorage.setItem("token", data.token)
        setToken(data.token)
        setUser(data.user)
        navigate("/")
        return { success: true }
      } else {
        return { success: false, error: data.error || "Login failed" }
      }
    } catch (error) {
      console.error("Login error:", error)
      return { success: false, error: "Network error. Please try again." }
    }
  }

  // ─── Signup ───────────────────────────────────────────────────────────────
  // userData = { name, email, password }
  const register = async (userData) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name:     userData.name,
          email:    userData.email,
          password: userData.password,
        }),
      })
      const data = await response.json()
      if (data.success) {
        localStorage.setItem("token", data.token)
        setToken(data.token)
        setUser(data.user)
        navigate("/")
        return { success: true }
      } else {
        return { success: false, error: data.error || "Registration failed" }
      }
    } catch (error) {
      console.error("Registration error:", error)
      return { success: false, error: "Network error. Please try again." }
    }
  }

  // ─── Logout ───────────────────────────────────────────────────────────────
  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("progressHistory") // CLEAR GHOST DATA
    localStorage.removeItem("quizResults")     // CLEAR GHOST DATA
    setToken(null)
    setUser(null)
    navigate("/auth")
  }

  // ─── Change password ──────────────────────────────────────────────────────
  const changePassword = async (currentPassword, newPassword) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/change-password`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      const data = await response.json()
      if (data.success) {
        return { success: true }
      } else {
        return { success: false, error: data.error || "Password change failed" }
      }
    } catch (error) {
      console.error("Change password error:", error)
      return { success: false, error: "Network error. Please try again." }
    }
  }

  // ─── Start assessment ─────────────────────────────────────────────────────
  const startAssessment = async ({ companyName, difficulty }) => {
    try {
      const response = await fetch(`${API_URL}/api/assessments/start`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ companyName, difficulty }),
      })
      const data = await response.json()
      if (data.success) {
        return { success: true, data }
      } else {
        return { success: false, error: data.error || "Failed to start assessment" }
      }
    } catch (error) {
      console.error("Start assessment error:", error)
      return { success: false, error: "Network error. Please try again." }
    }
  }

  // ─── Submit assessment ────────────────────────────────────────────────────
  const submitAssessment = async (assessmentId, answers) => {
    try {
      const response = await fetch(`${API_URL}/api/assessments/${assessmentId}/submit`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answers }),
      })
      const data = await response.json()
      if (data.success) {
        return { success: true, result: data.result }
      } else {
        return { success: false, error: data.error || "Failed to submit assessment" }
      }
    } catch (error) {
      console.error("Submit assessment error:", error)
      return { success: false, error: "Network error. Please try again." }
    }
  }

  // ─── Check auth on app mount ──────────────────────────────────────────────
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("token")
      if (storedToken) {
        setToken(storedToken)
        await fetchUserProfile(storedToken)
      }
      setLoading(false)
    }
    initAuth()
  }, [])

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    changePassword,
    startAssessment,
    submitAssessment,
    isAuthenticated: !!token,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within an AuthProvider")
  return context
}