const BACKEND_URL = import.meta.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"

export function AuthProvider({ children }) {
  const fetchUserProfile = async (token) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
    } catch (error) {}
  }

  const login = async (email, password) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })
    } catch (error) {}
  }

  const register = async (userData) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })
    } catch (error) {}
  }
}
