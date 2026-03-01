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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Light Theme Gradient Orbs (Matching HomePage) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-300/30 to-cyan-300/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-sky-300/30 to-blue-400/30 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center gap-12 relative z-10 py-10">
        
        {/* Left side - Branding and Info */}
        <div className="flex-1 text-center lg:text-left space-y-8">
          
          {/* Logo */}
          <div className="flex items-center justify-center lg:justify-start space-x-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-sky-400 rounded-2xl blur-lg opacity-40"></div>
              <div className="relative p-3 bg-gradient-to-br from-blue-600 to-sky-500 rounded-2xl shadow-md">
                <Brain className="h-10 w-10 text-white" />
              </div>
            </div>
            <span className="text-4xl font-bold text-slate-900">
              Aptitude<span className="text-sky-500">AI</span>
            </span>
          </div>

          {/* Tagline */}
          <div className="max-w-xl mx-auto lg:mx-0">
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight">
              Master Your Aptitude Tests with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500">
                AI-Powered Learning
              </span>
            </h1>
            <p className="text-lg text-slate-600 font-medium leading-relaxed">
              Prepare for assessments at top companies like TCS, Wipro, Google, Amazon, and more. Get personalized
              feedback, track your progress, and earn achievement badges.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4">
            
            <div className="flex items-start space-x-4 p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 group">
              <div className="p-2.5 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">Company-Specific Tests</h3>
                <p className="text-sm text-slate-500 font-medium">Practice with tailored assessments for 7+ top companies</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 group">
              <div className="p-2.5 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
                <Sparkles className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">AI-Powered Feedback</h3>
                <p className="text-sm text-slate-500 font-medium">Get personalized insights and improvement strategies</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 group">
              <div className="p-2.5 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
                <Award className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">Achievement Badges</h3>
                <p className="text-sm text-slate-500 font-medium">Earn badges as you progress through skill levels</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 group">
              <div className="p-2.5 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">Progress Tracking</h3>
                <p className="text-sm text-slate-500 font-medium">Monitor your improvement with detailed analytics</p>
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