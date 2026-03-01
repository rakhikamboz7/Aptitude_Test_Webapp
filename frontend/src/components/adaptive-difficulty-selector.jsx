import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { TrendingUp, Target, Brain, Lightbulb, Zap, Award, CheckCircle2, Compass, Activity,Rocket, ArrowRight } from "lucide-react"

export function AdaptiveDifficultySelector({ onDifficultySelect, selectedDifficulty, onStartTest }) {
  const [progressData, setProgressData] = useState(null)
  const [showRecommendation, setShowRecommendation] = useState(false)

  useEffect(() => {
    const analyzeProgress = () => {
      try {
        const progressHistory = JSON.parse(localStorage.getItem("progressHistory") || "[]")

        if (progressHistory.length === 0) {
          setProgressData(null)
          return
        }

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
          Object.entries(test.breakdown.byTopic).forEach(([topic, data]) => {
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

        // Auto-select recommended difficulty if different from current
        if (recommendedDifficulty !== selectedDifficulty) {
          setShowRecommendation(true)
        }
      } catch (error) {
        console.error("Error analyzing progress:", error)
        setProgressData(null)
      }
    }

    analyzeProgress()
  }, [selectedDifficulty])

  const difficultyLevels = [
    {
      level: "easy",
      title: "Beginner",
      description: "Perfect for getting started with foundational concepts",
      color: "from-emerald-600 to-teal-600",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/30",
      textColor: "text-emerald-400",
      icon: Compass,
      
    },
    {
      level: "medium",
      title: "Intermediate",
      description: "Balanced challenge for steady career advancement",
      color: "from-blue-600 to-sky-600",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/30",
      textColor: "text-blue-400",
      icon: Activity
    },
    {
      level: "hard",
      title: "Advanced",
      description: "Complex scenarios for senior-level preparation",
      color: "from-indigo-600 to-blue-700",
      bgColor: "bg-indigo-500/10",
      borderColor: "border-indigo-500/30",
      textColor: "text-indigo-400",
      icon: Rocket
    },
  ]

  const getTrendIcon = (trend) => {
    switch (trend) {
      case "improving":
        return <TrendingUp className="h-4 w-4 text-emerald-400" />
      case "declining":
        return <TrendingUp className="h-4 w-4 text-red-400 rotate-180" />
      default:
        return <Target className="h-4 w-4 text-slate-400" />
    }
  }

  const getTrendColor = (trend) => {
    switch (trend) {
      case "improving":
        return "text-emerald-400"
      case "declining":
        return "text-red-400"
      default:
        return "text-slate-400"
    }
  }

  return (
    <div className="space-y-6">
      {/* AI Recommendation Card */}
      {progressData && showRecommendation && (
        <Card className="bg-gradient-to-br from-blue-900/20 to-sky-900/20 backdrop-blur-xl border-blue-500/30 shadow-2xl shadow-blue-500/10 overflow-hidden relative group animate-slide-down">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-sky-600/5" />
          
          <CardHeader className="relative z-10">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-br from-blue-600 to-sky-600 rounded-xl shadow-lg">
                  <Lightbulb className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl text-white flex items-center gap-2">
                    AI-Powered Recommendation
                  </CardTitle>
                  <CardDescription className="text-black-400 mt-1">
                    Based on your recent performance analysis
                  </CardDescription>
                </div>
              </div>
              <Badge className="bg-sky-500/20 text-sky-300 border-sky-500/30 px-3 py-1">
                <Zap className="h-3 w-3 mr-1" />
                Smart
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="relative z-10">
            <div className="space-y-4">
              <div className="bg-white-800/50 backdrop-blur-sm rounded-xl p-5 border border-slate-700/50">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-semibold text-white text-lg mb-1">
                      Recommended Level:{" "}
                      <span className="capitalize text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-400">
                        {progressData.recommendedDifficulty}
                      </span>
                    </p>
                    <p className="text-sm text-slate-400">
                      Based on your <span className="text-white font-medium">{progressData.averageScore}%</span> average score and{" "}
                      <span className={`font-medium ${getTrendColor(progressData.recentTrend)}`}>
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
                    className="bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-white shadow-lg shadow-blue-500/30 border-0"
                  >
                    Apply
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white-900/50 rounded-lg p-3 border border-slate-700/30">
                    <div className="flex items-center gap-2 mb-1">
                      <Award className="h-4 w-4 text-sky-400" />
                      <span className="text-xs font-medium text-slate-400">Performance</span>
                    </div>
                    <div className="text-2xl font-bold text-white">{progressData.averageScore}%</div>
                    <div className="text-xs text-slate-500">Recent average</div>
                  </div>

                  <div className="bg-white-900/50 rounded-lg p-3 border border-slate-700/30">
                    <div className="flex items-center gap-2 mb-1">
                      {getTrendIcon(progressData.recentTrend)}
                      <span className="text-xs font-medium text-slate-400">Trend</span>
                    </div>
                    <div className={`text-lg font-bold capitalize ${getTrendColor(progressData.recentTrend)}`}>
                      {progressData.recentTrend}
                    </div>
                    <div className="text-xs text-slate-500">Current trajectory</div>
                  </div>

                  <div className="bg-white-900/50 rounded-lg p-3 border border-slate-700/30">
                    <div className="flex items-center gap-2 mb-1">
                      <Target className="h-4 w-4 text-emerald-400" />
                      <span className="text-xs font-medium text-slate-400">Strong in</span>
                    </div>
                    <div className="text-sm font-bold text-white truncate">
                      {progressData.strongTopics.slice(0, 1).join(", ") || "N/A"}
                    </div>
                    <div className="text-xs text-slate-500">Top skill area</div>
                  </div>
                </div>
              </div>

              {progressData.weakTopics.length > 0 && (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-amber-300 mb-1">Focus Area Suggestion</p>
                      <p className="text-sm text-slate-300">
                        Consider reviewing <span className="font-semibold text-white">{progressData.weakTopics.join(" and ")}</span> to strengthen your overall performance profile.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>

          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
        </Card>
      )}

      {/* Progress Summary */}
      {progressData && (
        <Card className="bg-white-900/50 backdrop-blur-xl border-slate-800/50 shadow-xl overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800/30 to-slate-900/30" />
          
          <CardHeader className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-lg">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg text-white">Performance Analytics</CardTitle>
                <CardDescription className="text-slate-400">
                  Recent insights to optimize your preparation
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center bg-white-800/50 rounded-xl p-5 border border-slate-700/50">
                <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-400 mb-2">
                  {progressData.averageScore}%
                </div>
                <div className="text-sm text-slate-400 font-medium">Recent Average</div>
              </div>

              <div className="text-center bg-white-800/50 rounded-xl p-5 border border-slate-700/50">
                <div className="flex items-center justify-center gap-2 mb-2">
                  {getTrendIcon(progressData.recentTrend)}
                  <span className={`text-2xl font-bold capitalize ${getTrendColor(progressData.recentTrend)}`}>
                    {progressData.recentTrend}
                  </span>
                </div>
                <div className="text-sm text-slate-400 font-medium">Performance Trend</div>
              </div>

              <div className="text-center bg-white-800/50 rounded-xl p-5 border border-slate-700/50">
                <div className="text-xl font-semibold text-white mb-2 truncate">
                  {progressData.strongTopics.length > 0 ? progressData.strongTopics[0] : "N/A"}
                </div>
                <div className="text-sm text-slate-400 font-medium">Strongest Topic</div>
              </div>
            </div>
          </CardContent>

          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
        </Card>
      )}

      {/* Difficulty Selection */}
      <div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {difficultyLevels.map((diff, index) => {
            const Icon = diff.icon
            const isRecommended = progressData?.recommendedDifficulty === diff.level
            const isSelected = selectedDifficulty === diff.level
return (
              <Card
                key={diff.level}
                onClick={() => onDifficultySelect(diff.level)}
                // We force the background to stay slate-900 here
                className={`group relative cursor-pointer flex flex-col h-full transition-all duration-500 overflow-hidden bg-white-900/80 backdrop-blur-xl ${
                  isSelected
                    ? `border-2 ${diff.borderColor} scale-105 shadow-2xl`
                    : "border border-slate-800/50 hover:border-slate-700/50 hover:scale-105"
                }`}
                style={{
                  animation: `slideUp 0.5s ease-out ${index * 0.1}s backwards`,
                }}
              >
                {/* NOTE: The colored 'inset-0' background overlays have been DELETED here 
                  so the card background never changes color! 
                */}

                <CardHeader className="pb-3 relative z-10">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {/* THIS is where the icon background changes color on select */}
                      <div
                        className={`p-3 rounded-xl shadow-lg transform group-hover:scale-110 transition-transform duration-300 ${
                          isSelected ? `bg-gradient-to-br ${diff.color}` : "bg-white-50 border border-slate-700"
                        }`}
                      >
                        <Icon className={`h-7 w-7 ${isSelected ? "text-white" : diff.textColor}`} />
                      </div>
                      <div>
                        <CardTitle className={`text-xl ${isSelected ? "text-purple-500" : "text-gray-600"}`}>
                          {diff.title}
                        </CardTitle>
                        <Badge
                          variant="secondary"
                          className={`mt-1 text-xs ${
                            isSelected
                              ? `${diff.bgColor} ${diff.textColor} ${diff.borderColor}`
                              : "bg-white-800 text-gray-700 border-slate-700"
                          }`}
                        >
                          {diff.level}
                        </Badge>
                      </div>
                    </div>

                    {/* The Tick Mark stays */}
                    {isSelected && (
                      <div className="animate-scale-in">
                        <div className="w-7 h-7 bg-slate-100 rounded-full flex items-center justify-center shadow-lg">
                          <CheckCircle2 className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="relative z-10 flex flex-col flex-grow min-h-[100px]">
                  <CardDescription className={`text-sm leading-relaxed ${isSelected ? "text-gray-600" : "text-black"}`}>
                    {diff.description}
                  </CardDescription>

                  {isRecommended && (
                    <div className="mt-4 flex items-center gap-2 bg-gradient-to-r from-sky-500/20 to-blue-500/20 border border-sky-500/30 rounded-lg px-3 py-2">
                      <Zap className="h-4 w-4 text-sky-400" />
                      <span className="text-xs font-semibold text-sky-300">AI Recommended for You</span>
                    </div>
                  )}

                  {/* Quick Start button with fixed syntax and forced white color */}
                  <div className="mt-auto pt-6">
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); 
                        onDifficultySelect(diff.level);
                        if (onStartTest) onStartTest();
                      }}
                      className="w-fit flex items-center justify-start text-sm font-semibold transition-colors duration-300 text-black hover:text-slate-700"
                    >
                      Quick Start <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                  </div>
                </CardContent>

                {/* Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
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
          animation: slide-down 0.5s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}