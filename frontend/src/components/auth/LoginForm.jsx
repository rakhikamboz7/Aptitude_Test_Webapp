import React, { useState } from "react"
import { useAuth } from "../../contexts/auth-context"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Alert, AlertDescription } from "../ui/alert"
import { Mail, Lock, Loader2, Sparkles } from "lucide-react"

export const LoginForm = ({ onToggleMode }) => {
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [error, setError]       = useState("")
  const [loading, setLoading]   = useState(false)

  const { login } = useAuth()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (error) setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields")
      return
    }

    setLoading(true)
    const result = await login(formData.email, formData.password)
    if (!result.success) setError(result.error)
    setLoading(false)
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-white/80 backdrop-blur-xl border border-slate-200 shadow-xl shadow-slate-200/50 relative overflow-hidden">
      {/* Decorative top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 to-sky-500" />
      <CardHeader className="text-center space-y-2 pb-6 pt-8">
        <div className="mx-auto w-12 h-12 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center mb-2 shadow-sm">
          <Sparkles className="h-6 w-6 text-blue-600" />
        </div>
        <CardTitle className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500">
          Welcome Back
        </CardTitle>
        <CardDescription className="text-base text-slate-500 font-medium">
          Sign in to your account to continue your learning journey
        </CardDescription>
      </CardHeader>
      <CardContent className="px-8 pb-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <Alert variant="destructive" className="bg-red-50 border border-red-200 text-red-700">
              <AlertDescription className="font-medium">{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-bold text-slate-700 flex items-center">
              <Mail className="h-4 w-4 mr-2 text-blue-500" />
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white transition-all shadow-inner text-sm"
              placeholder="Enter your email"
              autoComplete="email"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-bold text-slate-700 flex items-center">
              <Lock className="h-4 w-4 mr-2 text-blue-500" />
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white transition-all shadow-inner text-sm"
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full py-6 text-base font-bold bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-white rounded-xl shadow-lg shadow-blue-500/20 transition-all mt-4"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        <div className="mt-8 text-center border-t border-slate-100 pt-6">
          <p className="text-sm font-medium text-slate-500">
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={onToggleMode}
              className="text-blue-600 hover:text-blue-700 hover:underline font-bold transition-colors ml-1"
            >
              Sign up now
            </button>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}