import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/auth-context"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { AdaptiveDifficultySelector } from "../components/adaptive-difficulty-selector"
import {
  Brain,
  Building2,
  CheckCircle2,
  TrendingUp,
  Award,
  Sparkles,
  Target,
  Zap,
  Clock,
  BookOpen,
  LogOut,
  User,
} from "lucide-react"

export default function HomePage() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [selectedDifficulty, setSelectedDifficulty] = useState(user?.preferences?.preferredDifficulty || "medium")
  const [selectedCompany, setSelectedCompany] = useState(null)

  const companies = [
    { id: "tcs", name: "TCS", color: "bg-blue-600", description: "Technical & Analytical" },
    { id: "wipro", name: "Wipro", color: "bg-orange-600", description: "Problem Solving" },
    { id: "google", name: "Google", color: "bg-red-600", description: "Advanced Algorithms" },
    { id: "amazon", name: "Amazon", color: "bg-yellow-600", description: "Leadership" },
    { id: "infosys", name: "Infosys", color: "bg-blue-500", description: "Aptitude" },
    { id: "accenture", name: "Accenture", color: "bg-purple-600", description: "Cognitive" },
    { id: "deloitte", name: "Deloitte", color: "bg-green-600", description: "Analytics" },
  ]

  const handleStartTest = () => {
    localStorage.setItem("selectedDifficulty", selectedDifficulty)
    localStorage.setItem("selectedCompany", selectedCompany || "general")
    navigate("/quiz")
  }

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Feedback",
      description: "Get personalized explanations and improvement tips powered by advanced AI",
      color: "text-blue-600",
    },
    {
      icon: TrendingUp,
      title: "Adaptive Difficulty",
      description: "Questions automatically adjust based on your performance level",
      color: "text-green-600",
    },
    {
      icon: Clock,
      title: "Timed Practice",
      description: "Simulate real test conditions with optimized time management",
      color: "text-orange-600",
    },
    {
      icon: BookOpen,
      title: "Comprehensive Topics",
      description: "Cover numerical, logical, verbal, and analytical reasoning",
      color: "text-purple-600",
    },
    {
      icon: Award,
      title: "Achievement Badges",
      description: "Earn Beginner, Intermediate, and Advanced badges based on performance",
      color: "text-pink-600",
    },
    {
      icon: Building2,
      title: "Company-Specific Tests",
      description: "Practice with questions tailored to top tech company assessments",
      color: "text-indigo-600",
    },
  ]

  const stats = [
    { value: "7", label: "Top Companies", icon: Building2 },
    { value: "3", label: "Badge Levels", icon: Award },
    { value: "15", label: "Questions/Test", icon: Target },
    { value: "AI", label: "Powered", icon: Sparkles },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header Navigation */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <span className="text-xl font-bold text-foreground">AptitudeAI</span>
            </div>

            <nav className="hidden md:flex items-center space-x-6">
              <button
                onClick={() => navigate("/")}
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => navigate("/assessments")}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                Assessments
              </button>
              <button
                onClick={() => navigate("/progress")}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                Progress
              </button>
              <button
                onClick={() => navigate("/employability")}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                Employability Test
              </button>
            </nav>

            <div className="flex items-center space-x-4">
              {user && (
                <div className="flex items-center space-x-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-foreground">
                      {user.profile?.firstName || user.username}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user.statistics?.totalAssessments || 0} tests taken
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => navigate("/profile")}>
                    <User className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={logout}>
                    <LogOut className="h-5 w-5" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"></div>
        <div className="absolute top-20 right-20 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-secondary/10 rounded-full blur-2xl"></div>

        <div className="relative max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            <span>Welcome back, {user?.profile?.firstName || user?.username}!</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Crack Your Dream Job with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Smart Practice
            </span>
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Prepare for assessments at top companies with AI-driven insights, personalized feedback, and comprehensive
            progress tracking. Start your journey to success today.
          </p>

          {/* Company Selection */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-foreground mb-4">Select Your Target Company</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 max-w-5xl mx-auto">
              {companies.map((company) => (
                <button
                  key={company.id}
                  onClick={() => setSelectedCompany(company.id)}
                  className={`relative p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                    selectedCompany === company.id
                      ? `${company.color} text-white border-transparent shadow-lg`
                      : "border-border bg-card hover:border-primary/30"
                  }`}
                >
                  <div className="text-center">
                    <Building2
                      className={`h-6 w-6 mx-auto mb-2 ${selectedCompany === company.id ? "text-white" : "text-primary"}`}
                    />
                    <div
                      className={`font-bold text-sm mb-1 ${selectedCompany === company.id ? "text-white" : "text-foreground"}`}
                    >
                      {company.name}
                    </div>
                    <div
                      className={`text-xs ${selectedCompany === company.id ? "text-white/90" : "text-muted-foreground"}`}
                    >
                      {company.description}
                    </div>
                  </div>
                  {selectedCompany === company.id && (
                    <CheckCircle2 className="h-4 w-4 absolute top-2 right-2 text-white" />
                  )}
                </button>
              ))}
            </div>
            {!selectedCompany && <p className="text-sm text-muted-foreground mt-3">Or skip to take a general assessment</p>}
          </div>

          {/* Difficulty Selection */}
          <div className="mb-10">
            <AdaptiveDifficultySelector
              selectedDifficulty={selectedDifficulty}
              onDifficultySelect={setSelectedDifficulty}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              onClick={handleStartTest}
              className="text-lg px-8 py-6 h-auto shadow-xl hover:shadow-2xl transition-all"
            >
              <Zap className="h-5 w-5 mr-2" />
              Start Assessment Now
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate("/progress")}
              className="text-lg px-8 py-6 h-auto bg-transparent"
            >
              <TrendingUp className="h-5 w-5 mr-2" />
              View My Progress
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center mb-4">
                    <div className="p-3 bg-primary/10 rounded-xl">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Why Choose AptitudeAI?
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Our platform combines cutting-edge AI technology with proven educational methods to help you excel.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="h-full hover:shadow-xl transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm hover:scale-105"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-primary/10 rounded-xl">
                      <feature.icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4 sm:px-6 lg:px-8 bg-muted/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <div>
                <span className="text-xl font-bold text-foreground">AptitudeAI</span>
                <p className="text-sm text-muted-foreground">Your path to success</p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-muted-foreground text-sm">Empowering students with AI-driven preparation.</p>
              <p className="text-muted-foreground text-xs mt-1">Built with React and advanced AI algorithms.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}