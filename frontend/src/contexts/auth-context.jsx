import React, { createContext, useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

const AuthContext = createContext(null)

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem("token"))
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // Fetch user profile
  const fetchUserProfile = async (authToken) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/profile`, {
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
        throw new Error(data.error || "Failed to fetch profile")
      }
    } catch (error) {
      console.error("Profile fetch error:", error)
      logout()
      return null
    }
  }

  // Login function
  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (data.success) {
        const authToken = data.token
        localStorage.setItem("token", authToken)
        setToken(authToken)
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

  // Register function
  const register = async (userData) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (data.success) {
        const authToken = data.token
        localStorage.setItem("token", authToken)
        setToken(authToken)
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

  // Logout function
  const logout = () => {
    localStorage.removeItem("token")
    setToken(null)
    setUser(null)
    navigate("/auth")
  }

  // Update profile function
  const updateProfile = async (profileData) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      })

      const data = await response.json()

      if (data.success) {
        setUser(data.user)
        return { success: true }
      } else {
        return { success: false, error: data.error || "Update failed" }
      }
    } catch (error) {
      console.error("Profile update error:", error)
      return { success: false, error: "Network error. Please try again." }
    }
  }

  // Save assessment result
  const saveAssessment = async (assessmentData) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/save-assessment`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(assessmentData),
      })

      const data = await response.json()

      if (data.success) {
        setUser(data.user)
        return { success: true }
      } else {
        return { success: false, error: data.error }
      }
    } catch (error) {
      console.error("Save assessment error:", error)
      return { success: false, error: "Failed to save assessment" }
    }
  }

  // Check authentication on mount
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
    updateProfile,
    saveAssessment,
    isAuthenticated: !!token,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
