"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { TrendingUp, Target, Brain, Lightbulb } from "lucide-react"

export function AdaptiveDifficultySelector({ onDifficultySelect, selectedDifficulty }) {
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
      description: "Perfect for getting started with basic concepts",
      color: "bg-green-100 text-green-800 border-green-200",
      icon: Target,
    },
    {
      level: "medium",
      title: "Intermediate",
      description: "Balanced mix of concepts for steady progress",
      color: "bg-blue-100 text-blue-800 border-blue-200",
      icon: Brain,
    },
    {
      level: "hard",
      title: "Advanced",
      description: "Challenging questions for experienced test-takers",
      color: "bg-purple-100 text-purple-800 border-purple-200",
      icon: TrendingUp,
    },
  ]

  const getTrendIcon = (trend) => {
    switch (trend) {
      case "improving":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "declining":
        return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />
      default:
        return <Target className="h-4 w-4 text-gray-600" />
    }
  }

  const getTrendColor = (trend) => {
    switch (trend) {
      case "improving":
        return "text-green-600"
      case "declining":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="space-y-6">
      {/* AI Recommendation Card */}
      {progressData && showRecommendation && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-primary">
              <Lightbulb className="h-5 w-5" />
              <span>AI Recommendation</span>
            </CardTitle>
            <CardDescription>Based on your recent performance analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">
                    Recommended Level:{" "}
                    <span className="capitalize text-primary">{progressData.recommendedDifficulty}</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Based on your {progressData.averageScore}% average score and {progressData.recentTrend} trend
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onDifficultySelect(progressData.recommendedDifficulty)
                    setShowRecommendation(false)
                  }}
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  Use Recommendation
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-foreground">Performance:</span>
                    <Badge variant="outline" className="text-xs">
                      {progressData.averageScore}% avg
                    </Badge>
                  </div>
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-foreground">Trend:</span>
                    <div className="flex items-center space-x-1">
                      {getTrendIcon(progressData.recentTrend)}
                      <span className={`text-xs capitalize ${getTrendColor(progressData.recentTrend)}`}>
                        {progressData.recentTrend}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-foreground">Strong in:</span>
                    <span className="text-xs text-muted-foreground">
                      {progressData.strongTopics.slice(0, 1).join(", ")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Progress Summary */}
      {progressData && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Progress Summary</CardTitle>
            <CardDescription>Recent performance insights to help you choose the right level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">{progressData.averageScore}%</div>
                <div className="text-sm text-muted-foreground">Recent Average</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-1">
                  {getTrendIcon(progressData.recentTrend)}
                  <span className={`text-lg font-semibold capitalize ${getTrendColor(progressData.recentTrend)}`}>
                    {progressData.recentTrend}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">Performance Trend</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-primary mb-1">
                  {progressData.strongTopics.length > 0 ? progressData.strongTopics[0] : "N/A"}
                </div>
                <div className="text-sm text-muted-foreground">Strongest Topic</div>
              </div>
            </div>

            {progressData.weakTopics.length > 0 && (
              <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Focus Area:</strong> Consider reviewing {progressData.weakTopics.join(" and ")} to improve
                  your overall performance.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Difficulty Selection */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Choose Your Difficulty Level</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {difficultyLevels.map((diff) => {
            const Icon = diff.icon
            const isRecommended = progressData?.recommendedDifficulty === diff.level
            const isSelected = selectedDifficulty === diff.level

            return (
              <Card
                key={diff.level}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  isSelected ? "ring-2 ring-primary shadow-lg" : ""
                } ${isRecommended ? "border-primary/50" : ""}`}
                onClick={() => onDifficultySelect(diff.level)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Icon className="h-5 w-5 text-primary" />
                      <CardTitle className="text-base">{diff.title}</CardTitle>
                    </div>
                    <div className="flex space-x-1">
                      <Badge className={diff.color}>{diff.level}</Badge>
                      {isRecommended && (
                        <Badge variant="outline" className="text-xs border-primary text-primary">
                          Recommended
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">{diff.description}</CardDescription>
                  {isRecommended && (
                    <div className="mt-2 text-xs text-primary font-medium">✨ AI suggests this level for you</div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
