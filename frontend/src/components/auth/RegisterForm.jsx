import React, { useState } from "react"
import { useAuth } from "../../contexts/auth-context"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Alert, AlertDescription } from "../ui/alert"
import { User, Mail, Lock, Loader2, Brain } from "lucide-react"

export const RegisterForm = ({ onToggleMode }) => {
  const [formData, setFormData] = useState({
    name:            "",   // ✅ correct — matches User model
    email:           "",
    password:        "",
    confirmPassword: "",
  })
  const [error, setError]     = useState("")
  const [loading, setLoading] = useState(false)

  const { register } = useAuth()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (error) setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill in all required fields")
      return
    }
    if (formData.name.trim().length < 2) {
      setError("Name must be at least 2 characters")
      return
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)
    const result = await register({
      name:     formData.name.trim(),
      email:    formData.email,
      password: formData.password,
    })
    if (!result.success) setError(result.error)
    setLoading(false)
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-white/80 backdrop-blur-xl border border-slate-200 shadow-xl shadow-slate-200/50 relative overflow-hidden">
      {/* Decorative top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 to-sky-500" />

      <CardHeader className="text-center space-y-2 pb-6 pt-8">
        <div className="mx-auto w-12 h-12 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center mb-2 shadow-sm">
          <Brain className="h-6 w-6 text-blue-600" />
        </div>
        <CardTitle className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500">
          Create Your Account
        </CardTitle>
        <CardDescription className="text-base text-slate-500 font-medium">
          Sign up to start your aptitude test preparation journey
        </CardDescription>
      </CardHeader>

      <CardContent className="px-8 pb-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive" className="bg-red-50 border border-red-200 text-red-700">
              <AlertDescription className="font-medium">{error}</AlertDescription>
            </Alert>
          )}

          {/* Full Name */}
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-bold text-slate-700 flex items-center">
              <User className="h-4 w-4 mr-2 text-blue-500" />
              Full Name <span className="text-blue-500 ml-1">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white transition-all shadow-inner text-sm"
              placeholder="Enter your full name"
              autoComplete="name"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-bold text-slate-700 flex items-center">
              <Mail className="h-4 w-4 mr-2 text-blue-500" />
              Email <span className="text-blue-500 ml-1">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white transition-all shadow-inner text-sm"
              placeholder="your.email@example.com"
              autoComplete="email"
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-bold text-slate-700 flex items-center">
              <Lock className="h-4 w-4 mr-2 text-blue-500" />
              Password <span className="text-blue-500 ml-1">*</span>
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white transition-all shadow-inner text-sm"
              placeholder="At least 6 characters"
              autoComplete="new-password"
            />
            <p className="text-xs text-slate-500 font-medium">Must be at least 6 characters long</p>
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-bold text-slate-700 flex items-center">
              <Lock className="h-4 w-4 mr-2 text-blue-500" />
              Confirm Password <span className="text-blue-500 ml-1">*</span>
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white transition-all shadow-inner text-sm"
              placeholder="Repeat your password"
              autoComplete="new-password"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full py-6 text-base font-bold bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-white rounded-xl shadow-lg shadow-blue-500/20 transition-all mt-6"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>

        <div className="mt-8 text-center border-t border-slate-100 pt-6">
          <p className="text-sm font-medium text-slate-500">
            Already have an account?{" "}
            <button
              type="button"
              onClick={onToggleMode}
              className="text-blue-600 hover:text-blue-700 hover:underline font-bold transition-colors ml-1"
            >
              Sign in
            </button>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}