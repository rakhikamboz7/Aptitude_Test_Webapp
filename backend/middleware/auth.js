import jwt from "jsonwebtoken"

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header("Authorization")
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: "No authentication token provided",
      })
    }

    // Extract token
    const token = authHeader.replace("Bearer ", "")

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret-key-change-in-production")

    // Add user ID to request
    req.userId = decoded.userId

    next()
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        error: "Invalid authentication token",
      })
    }
    
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        error: "Authentication token has expired",
      })
    }

    console.error("Auth middleware error:", error)
    res.status(401).json({
      success: false,
      error: "Authentication failed",
    })
  }
}

export default auth;