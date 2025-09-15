"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Progress } from "../components/ui/progress"
import { Navigation } from "../components/navigation"
import {
  TrendingUp,
  TrendingDown,
  Clock,
  BookOpen,
  Calendar,
  BarChart3,
  Trophy,
  Minus,
  Target,
  Brain,
  Sparkles,
} from "lucide-react"

export default function ProgressPage() {
  const navigate = useNavigate()
  const [progressData, setProgressData] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProgressData = () => {
      try {
        let history = JSON.parse(localStorage.getItem("progressHistory") || "[]")

        // If no history exists, create some sample data to showcase features
        if (history.length === 0) {
          history = [
            {
              score: 85,
              difficulty: "medium",
              timeSpent: 1140,
              breakdown: {
                byTopic: {
                  "Speed & Distance": { correct: 3, total: 4 },
                  "Number Series": { correct: 4, total: 5 },
                  "Logical Reasoning": { correct: 2, total: 3 },
                  "Profit & Loss": { correct: 2, total: 3 },
                },
                byDifficulty: {
                  easy: { correct: 5, total: 6 },
                  medium: { correct: 6, total: 9 },
                },
              },
              date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
              score: 72,
              difficulty: "easy",
              timeSpent: 780,
              breakdown: {
                byTopic: {
                  "Speed & Distance": { correct: 2, total: 3 },
                  "Number Series": { correct: 3, total: 4 },
                  Percentage: { correct: 2, total: 3 },
                },
                byDifficulty: {
                  easy: { correct: 7, total: 10 },
                },
              },
              date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
              score: 91,
              difficulty: "hard",
              timeSpent: 1380,
              breakdown: {
                byTopic: {
                  "Logical Reasoning": { correct: 5, total: 6 },
                  "Coding-Decoding": { correct: 3, total: 4 },
                  "Number Series": { correct: 4, total: 5 },
                  Geometry: { correct: 3, total: 5 },
                },
                byDifficulty: {
                  easy: { correct: 3, total: 4 },
                  medium: { correct: 6, total: 8 },
                  hard: { correct: 6, total: 8 },
                },
              },
              date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
              score: 68,
              difficulty: "medium",
              timeSpent: 1200,
              breakdown: {
                byTopic: {
                  "Speed & Distance": { correct: 2, total: 4 },
                  "Profit & Loss": { correct: 3, total: 4 },
                  Percentage: { correct: 3, total: 4 },
                  Calendar: { correct: 2, total: 3 },
                },
                byDifficulty: {
                  easy: { correct: 4, total: 6 },
                  medium: { correct: 6, total: 9 },
                },
              },
              date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
              score: 79,
              difficulty: "easy",
              timeSpent: 720,
              breakdown: {
                byTopic: {
                  "Speed & Distance": { correct: 3, total: 3 },
                  "Number Series": { correct: 2, total: 3 },
                  Percentage: { correct: 3, total: 4 },
                },
                byDifficulty: {
                  easy: { correct: 8, total: 10 },
                },
              },
              date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            },
          ]
          localStorage.setItem("progressHistory", JSON.stringify(history))
        }

        setProgressData(history)

        if (history.length > 0) {
          // Calculate statistics
          const totalTests = history.length
          const averageScore = Math.round(history.reduce((sum, test) => sum + test.score, 0) / totalTests)
          const totalTimeSpent = history.reduce((sum, test) => sum + test.timeSpent, 0)

          // Calculate trend
          let trend = "stable"
          if (history.length >= 3) {
            const recent = history.slice(0, 3)
            const older = history.slice(-3)
            const recentAvg = recent.reduce((sum, test) => sum + test.score, 0) / recent.length
            const olderAvg = older.reduce((sum, test) => sum + test.score, 0) / older.length

            if (recentAvg > olderAvg + 5) trend = "improving"
            else if (recentAvg < olderAvg - 5) trend = "declining"
          }

          // Find best performance
          const bestTest = history.reduce((best, current) => (current.score > best.score ? current : best))

          // Topic analysis
          const topicStats = {}
          history.forEach((test) => {
            Object.entries(test.breakdown.byTopic).forEach(([topic, data]) => {
              if (!topicStats[topic]) {
                topicStats[topic] = { correct: 0, total: 0, tests: 0 }
              }
              topicStats[topic].correct += data.correct
              topicStats[topic].total += data.total
              topicStats[topic].tests += 1
            })
          })

          // Calculate accuracy for each topic
          Object.keys(topicStats).forEach((topic) => {
            topicStats[topic].accuracy = Math.round((topicStats[topic].correct / topicStats[topic].total) * 100)
          })

          setStats({
            totalTests,
            averageScore,
            totalTimeSpent,
            trend,
            bestScore: bestTest.score,
            bestDifficulty: bestTest.difficulty,
            topicStats,
          })
        }
      } catch (error) {
        console.error("Error loading progress data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadProgressData()
  }, [])

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getTrendIcon = (trend) => {
    switch (trend) {
      case "improving":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "declining":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <Minus className="h-4 w-4 text-gray-600" />
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

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-blue-600"
    if (score >= 40) return "text-yellow-600"
    return "text-red-600"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg text-muted-foreground">Loading your progress analytics...</p>
          </div>
        </div>
      </div>
    )
  }

  if (progressData.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <Card className="max-w-md text-center shadow-xl">
            <CardHeader>
              <div className="p-4 bg-primary/10 rounded-full w-fit mx-auto mb-4">
                <BarChart3 className="h-12 w-12 text-primary" />
              </div>
              <CardTitle className="text-2xl">Start Your Journey</CardTitle>
              <CardDescription className="text-base">
                Take your first test to unlock detailed progress tracking and personalized insights.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate("/")} className="w-full" size="lg">
                <Brain className="h-4 w-4 mr-2" />
                Take Your First Test
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-xl">
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">Your Learning Journey</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Track your improvement and analyze your performance with detailed insights and AI-powered recommendations
          </p>
        </div>

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="shadow-lg bg-gradient-to-br from-card to-card/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <Target className="h-4 w-4 mr-2" />
                  Total Tests Taken
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{stats.totalTests}</div>
                <p className="text-xs text-muted-foreground mt-1">Practice sessions completed</p>
              </CardContent>
            </Card>

            <Card className="shadow-lg bg-gradient-to-br from-card to-card/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Average Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${getScoreColor(stats.averageScore)}`}>{stats.averageScore}%</div>
                <p className="text-xs text-muted-foreground mt-1">Across all difficulty levels</p>
              </CardContent>
            </Card>

            <Card className="shadow-lg bg-gradient-to-br from-card to-card/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <Trophy className="h-4 w-4 mr-2" />
                  Best Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <div className={`text-3xl font-bold ${getScoreColor(stats.bestScore)}`}>{stats.bestScore}%</div>
                  <Badge variant="outline" className="text-xs capitalize">
                    {stats.bestDifficulty}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Personal best score</p>
              </CardContent>
            </Card>

            <Card className="shadow-lg bg-gradient-to-br from-card to-card/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Learning Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  {getTrendIcon(stats.trend)}
                  <span className={`text-2xl font-semibold capitalize ${getTrendColor(stats.trend)}`}>
                    {stats.trend}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Performance trajectory</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Topic Performance */}
        {stats?.topicStats && (
          <Card className="mb-8 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-xl">
                <BookOpen className="h-6 w-6 text-primary" />
                <span>Topic Mastery Analysis</span>
              </CardTitle>
              <CardDescription className="text-base">
                Your accuracy and progress across different question categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(stats.topicStats)
                  .sort(([, a], [, b]) => b.accuracy - a.accuracy)
                  .map(([topic, data]) => (
                    <div key={topic} className="space-y-3 p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold">{topic}</span>
                        <div className="flex items-center space-x-3">
                          <span className="text-xs text-muted-foreground">
                            {data.correct}/{data.total} correct
                          </span>
                          <Badge
                            variant="outline"
                            className={`text-xs font-medium ${
                              data.accuracy >= 80
                                ? "bg-green-100 text-green-800 border-green-200"
                                : data.accuracy >= 60
                                  ? "bg-blue-100 text-blue-800 border-blue-200"
                                  : "bg-yellow-100 text-yellow-800 border-yellow-200"
                            }`}
                          >
                            {data.accuracy}%
                          </Badge>
                        </div>
                      </div>
                      <Progress value={data.accuracy} className="h-3" />
                      <p className="text-xs text-muted-foreground">
                        Practiced in {data.tests} test{data.tests !== 1 ? "s" : ""}
                      </p>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Test History */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-xl">
              <Calendar className="h-6 w-6 text-primary" />
              <span>Recent Test History</span>
            </CardTitle>
            <CardDescription className="text-base">Your latest test results and performance trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {progressData.map((test, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-6 border border-border rounded-xl hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Trophy className={`h-5 w-5 ${getScoreColor(test.score)}`} />
                      </div>
                      <div>
                        <span className={`text-xl font-bold ${getScoreColor(test.score)}`}>{test.score}%</span>
                        <p className="text-xs text-muted-foreground">Score</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="capitalize px-3 py-1">
                      {test.difficulty}
                    </Badge>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{formatTime(test.timeSpent)}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-foreground">{formatDate(test.date)}</div>
                    <div className="text-xs text-muted-foreground">
                      {Object.keys(test.breakdown.byTopic).length} topics covered
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Button */}
        <div className="text-center mt-8">
          <Button onClick={() => navigate("/")} size="lg" className="px-8 py-3">
            <Brain className="h-5 w-5 mr-2" />
            Continue Learning Journey
          </Button>
        </div>
      </div>
    </div>
  )
}
