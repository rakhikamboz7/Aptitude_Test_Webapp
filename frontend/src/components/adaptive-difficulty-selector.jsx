import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { TrendingUp, Target, Brain, Lightbulb, Zap, Award, CheckCircle2, Compass, Activity, Rocket, ArrowRight } from "lucide-react"
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"
export function AdaptiveDifficultySelector({ onDifficultySelect, selectedDifficulty, onStartTest, isAuthenticated }) {
  const [progressData, setProgressData] = useState(null)
  const [showRecommendation, setShowRecommendation] = useState(false)

  useEffect(() => {
    const analyzeProgress = async () => {
      try {
        let progressHistory = []

        // 2. If logged in, fetch from database!
        if (isAuthenticated) {
          const token = localStorage.getItem("token")
          const res = await fetch(`${API_URL}/api/dashboard/summary`, {
              headers: { Authorization: `Bearer ${token}` }
            })
          const data = await res.json()
          if (data.success && data.summary) {
            progressHistory = data.summary.progressHistory || []
            // Sync it back to local storage just in case
            localStorage.setItem("progressHistory", JSON.stringify(progressHistory))
          }
        } else {
          // Fallback if not logged in
          progressHistory = JSON.parse(localStorage.getItem("progressHistory") || "[]")
        }

        if (progressHistory.length === 0) {
          setProgressData({ isEmpty: true })
          // Removed the early return so the rest of the component still renders!
        } else {
          // Wrap the rest of the calculations inside this 'else' block
          // Calculate average score from recent tests (last 3)
          const recentTests = progressHistory.slice(0, 3)
          const averageScore = Math.round(recentTests.reduce((sum, test) => sum + test.score, 0) / recentTests.length)

          // Determine trend
          let recentTrend = "stable"
          if (progressHistory.length >= 3) {
            const lastScore = progressHistory[0].score
            const thirdLastScore = progressHistory[2].score
            if (lastScore > thirdLastScore + 10) recentTrend = "improving"
            else if (lastScore < thirdLastScore - 10) recentTrend = "declining"
          }

          // Analyze topic performance
          const topicStats = {}
          recentTests.forEach((test) => {
            Object.entries(test.breakdown?.byTopic || {}).forEach(([topic, data]) => {
              if (!topicStats[topic]) {
                topicStats[topic] = { correct: 0, total: 0, accuracy: 0 }
              }
              topicStats[topic].correct += data.correct
              topicStats[topic].total += data.total
            })
          })

          // Calculate accuracy for each topic
          Object.keys(topicStats).forEach((topic) => {
            topicStats[topic].accuracy = Math.round((topicStats[topic].correct / topicStats[topic].total) * 100)
          })

          const sortedTopics = Object.entries(topicStats).sort(([, a], [, b]) => b.accuracy - a.accuracy)
          const strongTopics = sortedTopics.slice(0, 2).map(([topic]) => topic)
          const weakTopics = sortedTopics.slice(-2).map(([topic]) => topic)

          // Recommend difficulty based on performance
          let recommendedDifficulty = "medium"
          const lastTest = progressHistory[0]

          if (averageScore >= 75 && recentTrend !== "declining") {
            if (lastTest.difficulty === "easy") recommendedDifficulty = "medium"
            else if (lastTest.difficulty === "medium") recommendedDifficulty = "hard"
            else recommendedDifficulty = "hard"
          } else if (averageScore < 40 || recentTrend === "declining") {
            if (lastTest.difficulty === "hard") recommendedDifficulty = "medium"
            else if (lastTest.difficulty === "medium") recommendedDifficulty = "easy"
            else recommendedDifficulty = "easy"
          } else {
            recommendedDifficulty = lastTest.difficulty || "medium"
          }

          setProgressData({
            averageScore,
            recentTrend,
            strongTopics,
            weakTopics,
            recommendedDifficulty,
          })

          setShowRecommendation(true)
        } // End of the 'else' block
      } catch (error) {
        console.error("Error analyzing progress:", error)
        setProgressData(null)
      }
    }

    analyzeProgress()
  }, [selectedDifficulty, isAuthenticated]) // Ensure isAuthenticated is in the dependency array!
  const difficultyLevels = [
    {
      level: "easy",
      title: "Beginner",
      description: "Perfect for getting started with foundational concepts",
      color: "from-emerald-500 to-teal-500",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      textColor: "text-emerald-600",
      icon: Compass,
      
    },
    {
      level: "medium",
      title: "Intermediate",
      description: "Balanced challenge for steady career advancement",
      color: "from-blue-500 to-sky-500",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-600",
      icon: Activity
    },
    {
      level: "hard",
      title: "Advanced",
      description: "Complex scenarios for senior-level preparation",
      color: "from-indigo-500 to-blue-600",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200",
      textColor: "text-indigo-600",
      icon: Rocket
    },
  ]

  const getTrendIcon = (trend) => {
    switch (trend) {
      case "improving":
        return <TrendingUp className="h-4 w-4 text-emerald-500" />
      case "declining":
        return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />
      default:
        return <Target className="h-4 w-4 text-slate-500" />
    }
  }

  const getTrendColor = (trend) => {
    switch (trend) {
      case "improving":
        return "text-emerald-600"
      case "declining":
        return "text-red-600"
      default:
        return "text-slate-500"
    }
  }

  return (
    <div className="space-y-6">
      {/* AI Recommendation Card */}
      {/* AI Locked State (Shows when user has 0 tests) */}
      {isAuthenticated && progressData?.isEmpty && (
        <Card className="bg-slate-50 border-slate-200 border-dashed shadow-sm overflow-hidden rounded-2xl mb-6">
          <CardContent className="p-8 text-center">
            <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="h-6 w-6 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">AI Insights Locked</h3>
            <p className="text-sm text-slate-500 font-medium">Complete your first assessment to unlock personalized Gemini recommendations.</p>
          </CardContent>
        </Card>
      )}

      {/* AI Recommendation Card (Shows when user has test history) */}
      {isAuthenticated && progressData && !progressData.isEmpty && showRecommendation && (
        <Card className="bg-blue-50/80 border-blue-100 shadow-sm overflow-hidden relative group animate-slide-down rounded-2xl">
          <CardHeader className="relative z-10 pb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-600 rounded-xl shadow-sm">
                  <Lightbulb className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl text-slate-900 flex items-center gap-2">
                    AI-Powered Recommendation
                  </CardTitle>
                  <CardDescription className="text-slate-500 mt-0.5 font-medium">
                    Based on your recent performance analysis
                  </CardDescription>
                </div>
              </div>
              <Badge className="bg-blue-100 text-blue-700 border-blue-200 px-3 py-1 shadow-sm">
                <Zap className="h-3 w-3 mr-1" />
                Smart
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="relative z-10">
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-5 border border-blue-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-bold text-slate-900 text-lg mb-1">
                      Recommended Level:{" "}
                      <span className="capitalize text-blue-600">
                        {progressData.recommendedDifficulty}
                      </span>
                    </p>
                    <p className="text-sm text-slate-500 font-medium">
                      Based on your <span className="text-slate-900 font-bold">{progressData.averageScore}%</span> average score and{" "}
                      <span className={`font-bold ${getTrendColor(progressData.recentTrend)}`}>
                        {progressData.recentTrend}
                      </span>{" "}
                      trend
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => {
                      onDifficultySelect(progressData.recommendedDifficulty)
                      setShowRecommendation(false)
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20"
                  >
                    Apply
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                    <div className="flex items-center gap-2 mb-1">
                      <Award className="h-4 w-4 text-blue-500" />
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Performance</span>
                    </div>
                    <div className="text-2xl font-bold text-slate-900">{progressData.averageScore}%</div>
                    <div className="text-xs text-slate-500 font-medium">Recent average</div>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                    <div className="flex items-center gap-2 mb-1">
                      {getTrendIcon(progressData.recentTrend)}
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Trend</span>
                    </div>
                    <div className={`text-lg font-bold capitalize ${getTrendColor(progressData.recentTrend)}`}>
                      {progressData.recentTrend}
                    </div>
                    <div className="text-xs text-slate-500 font-medium">Current trajectory</div>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                    <div className="flex items-center gap-2 mb-1">
                      <Target className="h-4 w-4 text-emerald-500" />
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Strong in</span>
                    </div>
                    <div className="text-sm font-bold text-slate-900 truncate">
                      {progressData.strongTopics.slice(0, 1).join(", ") || "N/A"}
                    </div>
                    <div className="text-xs text-slate-500 font-medium">Top skill area</div>
                  </div>
                </div>
              </div>

              {progressData.weakTopics.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-amber-800 mb-1">Focus Area Suggestion</p>
                      <p className="text-sm text-amber-700 font-medium">
                        Consider reviewing <span className="font-bold text-amber-900">{progressData.weakTopics.join(" and ")}</span> to strengthen your overall performance profile.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Progress Summary */}
      {isAuthenticated && progressData && !progressData.isEmpty && (
        <Card className="bg-slate-100 border border-slate-200 shadow-sm overflow-hidden relative group rounded-2xl">
          <CardHeader className="relative z-10 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-600 rounded-xl shadow-sm">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg text-slate-900">Performance Analytics</CardTitle>
                <CardDescription className="text-slate-500 font-medium">
                  Recent insights to optimize your preparation
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {progressData.averageScore}%
                </div>
                <div className="text-sm text-slate-500 font-bold uppercase tracking-wider">Recent Average</div>
              </div>

              <div className="text-center bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-center gap-2 mb-2">
                  {getTrendIcon(progressData.recentTrend)}
                  <span className={`text-2xl font-bold capitalize ${getTrendColor(progressData.recentTrend)}`}>
                    {progressData.recentTrend}
                  </span>
                </div>
                <div className="text-sm text-slate-500 font-bold uppercase tracking-wider">Performance Trend</div>
              </div>

              <div className="text-center bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                <div className="text-xl font-bold text-slate-900 mb-2 truncate">
                  {progressData.strongTopics.length > 0 ? progressData.strongTopics[0] : "N/A"}
                </div>
                <div className="text-sm text-slate-500 font-bold uppercase tracking-wider">Strongest Topic</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Difficulty Selection */}
      <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {difficultyLevels.map((diff, index) => {
            const Icon = diff.icon
            const isRecommended = progressData?.recommendedDifficulty === diff.level
            const isSelected = selectedDifficulty === diff.level
            
            return (
              <Card
                key={diff.level}
                onClick={() => onDifficultySelect(diff.level)}
                className={`group relative cursor-pointer flex flex-col h-full transition-all duration-300 overflow-hidden bg-white rounded-2xl ${
                  isSelected
                    ? `border-2 ${diff.borderColor} scale-105 shadow-xl`
                    : "border border-slate-200 hover:border-blue-300 hover:shadow-md"
                }`}
                style={{
                  animation: `slideUp 0.3s ease-out ${index * 0.1}s backwards`,
                }}
              >
                {/* Subtle colored background gradient for selected card */}
                {isSelected && (
                  <div className={`absolute inset-0 bg-gradient-to-br ${diff.bgColor} opacity-50 pointer-events-none`} />
                )}

                <CardHeader className="pb-3 relative z-10">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {/* Icon Container */}
                      <div
                        className={`p-3 rounded-xl shadow-sm transition-transform duration-300 ${
                          isSelected ? `bg-gradient-to-br ${diff.color}` : "bg-slate-50 border border-slate-100 group-hover:scale-110"
                        }`}
                      >
                        <Icon className={`h-7 w-7 ${isSelected ? "text-white" : diff.textColor}`} />
                      </div>
                      <div>
                        <CardTitle className={`text-xl font-bold ${isSelected ? diff.textColor : "text-slate-800"}`}>
                          {diff.title}
                        </CardTitle>
                        <Badge
                          variant="secondary"
                          className={`mt-1 text-xs font-bold uppercase tracking-wider ${
                            isSelected
                              ? `bg-white ${diff.textColor} ${diff.borderColor}`
                              : "bg-slate-100 text-slate-600 border-slate-200"
                          }`}
                        >
                          {diff.level}
                        </Badge>
                      </div>
                    </div>

                    {/* Tick Mark */}
                    {isSelected && (
                      <div className="animate-scale-in">
                        <div className="w-7 h-7 bg-white border border-slate-100 rounded-full flex items-center justify-center shadow-sm">
                          <CheckCircle2 className={`h-5 w-5 ${diff.textColor}`} />
                        </div>
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="relative z-10 flex flex-col flex-grow min-h-[100px]">
                  <CardDescription className={`text-sm font-medium leading-relaxed ${isSelected ? "text-slate-700" : "text-slate-500"}`}>
                    {diff.description}
                  </CardDescription>

                  {isRecommended && (
                    <div className="mt-4 flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
                      <Zap className="h-4 w-4 text-blue-500" />
                      <span className="text-xs font-bold text-blue-700">AI Recommended</span>
                    </div>
                  )}

                  {/* Quick Start button */}
                  <div className="mt-auto pt-6">
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); 
                        onDifficultySelect(diff.level);
                        if (onStartTest) onStartTest();
                      }}
                      className="w-fit flex items-center justify-start text-sm font-bold transition-colors duration-300 text-blue-600 hover:text-blue-800"
                    >
                      Quick Start <ArrowRight className="ml-1 h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scale-in {
          from { transform: scale(0); }
          to { transform: scale(1); }
        }
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-down {
          animation: slide-down 0.4s ease-out forwards;
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  )
}