"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Navigation } from "../components/navigation"
import { AdaptiveDifficultySelector } from "../components/adaptive-difficulty-selector"
import { BookOpen, Brain, Clock, TrendingUp, Users, Award, Sparkles, Target, Zap } from "lucide-react"

export default function HomePage() {
  const navigate = useNavigate()
  const [selectedDifficulty, setSelectedDifficulty] = useState("medium")

  const handleStartTest = () => {
    // Store selected difficulty in localStorage for the quiz
    localStorage.setItem("selectedDifficulty", selectedDifficulty)
    navigate("/quiz")
  }

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Feedback",
      description: "Get personalized explanations and improvement tips after each test",
      color: "text-blue-600",
    },
    {
      icon: TrendingUp,
      title: "Adaptive Difficulty",
      description: "Questions automatically adjust based on your performance",
      color: "text-green-600",
    },
    {
      icon: Clock,
      title: "Timed Practice",
      description: "Simulate real test conditions with optimized time limits",
      color: "text-orange-600",
    },
    {
      icon: BookOpen,
      title: "Comprehensive Topics",
      description: "Cover numerical reasoning, logical thinking, and problem-solving",
      color: "text-purple-600",
    },
    {
      icon: Users,
      title: "Progress Tracking",
      description: "Monitor your improvement over time with detailed analytics",
      color: "text-indigo-600",
    },
    {
      icon: Award,
      title: "Instant Results",
      description: "Get immediate scoring and detailed performance breakdown",
      color: "text-pink-600",
    },
  ]

  const stats = [
    { value: "15+", label: "Question Topics", icon: BookOpen },
    { value: "3", label: "Difficulty Levels", icon: Target },
    { value: "25min", label: "Max Test Duration", icon: Clock },
    { value: "AI", label: "Powered Feedback", icon: Sparkles },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"></div>
        <div className="absolute top-20 right-20 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-secondary/10 rounded-full blur-2xl"></div>

        <div className="relative max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            <span>AI-Powered Learning Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-foreground mb-6 text-balance">
            Master Aptitude Tests with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Smart Practice
            </span>
          </h1>

          <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto text-pretty leading-relaxed">
            Enhance your problem-solving skills with our adaptive testing platform. Get personalized feedback, track
            your progress, and master aptitude tests with confidence using AI-driven insights.
          </p>

          {/* Adaptive Difficulty Selection */}
          <div className="mb-12">
            <AdaptiveDifficultySelector
              selectedDifficulty={selectedDifficulty}
              onDifficultySelect={setSelectedDifficulty}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" onClick={handleStartTest} className="text-lg px-8 py-4 h-auto">
              <Zap className="h-5 w-5 mr-2" />
              Start Practice Test
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate("/progress")}
              className="text-lg px-8 py-4 h-auto bg-transparent"
            >
              <TrendingUp className="h-5 w-5 mr-2" />
              View Progress
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
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
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 text-balance">Why Choose AptitudeAI?</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty">
              Our platform combines cutting-edge AI technology with proven educational methods to help you excel in
              aptitude tests and build lasting problem-solving skills.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="h-full hover:shadow-xl transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-primary/10 rounded-xl">
                      <feature.icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-lg text-balance">{feature.title}</CardTitle>
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

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6 text-balance">
            Ready to Boost Your Test Performance?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 text-pretty">
            Join thousands of students who have improved their aptitude test scores with our AI-powered platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={handleStartTest} className="text-lg px-8 py-4 h-auto">
              <Brain className="h-5 w-5 mr-2" />
              Start Free Practice
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate("/admin")}
              className="text-lg px-8 py-4 h-auto bg-transparent"
            >
              <Award className="h-5 w-5 mr-2" />
              View Analytics
            </Button>
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
                <p className="text-sm text-muted-foreground">Smart practice, better results</p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-muted-foreground text-sm">
                Empowering students with AI-driven aptitude test preparation.
              </p>
              <p className="text-muted-foreground text-xs mt-1">
                Built with React, Next.js, and advanced AI algorithms.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
