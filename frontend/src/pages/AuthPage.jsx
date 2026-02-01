import React, { useState } from "react"
import { LoginForm } from "../components/auth/LoginForm"
import { RegisterForm } from "../components/auth/RegisterForm"
import { Brain, Sparkles, Award, TrendingUp, Building2 } from "lucide-react"

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true)

  const toggleMode = () => {
    setIsLogin(!isLogin)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-48 h-48 bg-secondary/10 rounded-full blur-2xl"></div>

      <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center gap-12 relative z-10">
        {/* Left side - Branding and Info */}
        <div className="flex-1 text-center lg:text-left space-y-6">
          {/* Logo */}
          <div className="flex items-center justify-center lg:justify-start space-x-3">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Brain className="h-10 w-10 text-primary" />
            </div>
            <span className="text-4xl font-bold text-foreground">AptitudeAI</span>
          </div>

          {/* Tagline */}
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Master Your Aptitude Tests with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                AI-Powered Learning
              </span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Prepare for assessments at top companies like TCS, Wipro, Google, Amazon, and more. Get personalized
              feedback, track your progress, and earn achievement badges.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
            <div className="flex items-start space-x-3 p-4 bg-card/50 rounded-lg border border-border">
              <Building2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-1">Company-Specific Tests</h3>
                <p className="text-sm text-muted-foreground">Practice with tailored assessments for 7+ top companies</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-card/50 rounded-lg border border-border">
              <Sparkles className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-1">AI-Powered Feedback</h3>
                <p className="text-sm text-muted-foreground">Get personalized insights and improvement strategies</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-card/50 rounded-lg border border-border">
              <Award className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-1">Achievement Badges</h3>
                <p className="text-sm text-muted-foreground">Earn badges as you progress through skill levels</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-card/50 rounded-lg border border-border">
              <TrendingUp className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-1">Progress Tracking</h3>
                <p className="text-sm text-muted-foreground">Monitor your improvement with detailed analytics</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Auth Form */}
        <div className="w-full lg:w-auto lg:min-w-[450px]">
          {isLogin ? <LoginForm onToggleMode={toggleMode} /> : <RegisterForm onToggleMode={toggleMode} />}
        </div>
      </div>
    </div>
  )
}
export default AuthPage