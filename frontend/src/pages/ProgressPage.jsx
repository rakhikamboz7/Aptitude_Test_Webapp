import React, { useState, useEffect } from "react"
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
  Award,
  Building2,
  Zap,
} from "lucide-react"

export default function ProgressPage() {
  const navigate = useNavigate()
  const [progressData, setProgressData] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [badgeStats, setBadgeStats] = useState(null)

  useEffect(() => {
    const loadProgressData = () => {
      try {
        const history = JSON.parse(localStorage.getItem("progressHistory") || "[]")
        setProgressData(history)

        if (history.length > 0) {
          // Calculate statistics
          const totalTests = history.length
          const averageScore = Math.round(history.reduce((sum, test) => sum + test.score, 0) / totalTests)
          const totalTimeSpent = history.reduce((sum, test) => sum + test.timeSpent, 0)

          // Badge statistics
          const badgeCounts = {
            beginner: 0,
            intermediate: 0,
            advanced: 0,
          }
          history.forEach((test) => {
            if (test.badge?.level) {
              badgeCounts[test.badge.level]++
            }
          })

          setBadgeStats(badgeCounts)

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

          // Company analysis
          const companyStats = {}
          history.forEach((test) => {
            const company = test.company || "general"
            if (!companyStats[company]) {
              companyStats[company] = { tests: 0, totalScore: 0, avgScore: 0 }
            }
            companyStats[company].tests++
            companyStats[company].totalScore += test.score
          })

          Object.keys(companyStats).forEach((company) => {
            companyStats[company].avgScore = Math.round(
              companyStats[company].totalScore / companyStats[company].tests
            )
          })

          // Topic analysis
          const topicStats = {}
          history.forEach((test) => {
            if (test.breakdown?.byTopic) {
              Object.entries(test.breakdown.byTopic).forEach(([topic, data]) => {
                if (!topicStats[topic]) {
                  topicStats[topic] = { correct: 0, total: 0, tests: 0 }
                }
                topicStats[topic].correct += data.correct
                topicStats[topic].total += data.total
                topicStats[topic].tests += 1
              })
            }
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
            companyStats,
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

  const getBadgeIcon = (level) => {
    const badges = {
      beginner: "🥉",
      intermediate: "🥈",
      advanced: "🥇",
    }
    return badges[level] || "🏅"
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
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
          <Card className="max-w-md text-center shadow-xl">
            <CardHeader>
              <div className="p-4 bg-primary/10 rounded-full w-fit mx-auto mb-4">
                <BarChart3 className="h-12 w-12 text-primary" />
              </div>
              <CardTitle className="text-2xl">Start Your Journey</CardTitle>
              <CardDescription className="text-base">
                Take your first assessment to unlock detailed progress tracking and earn achievement badges.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate("/")} className="w-full" size="lg">
                <Brain className="h-4 w-4 mr-2" />
                Take Your First Assessment
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
            <h1 className="text-4xl font-bold text-foreground">Your Learning Dashboard</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Track your improvement, analyze performance, and celebrate achievements with detailed insights
          </p>
        </div>

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="shadow-lg bg-gradient-to-br from-card to-card/50 hover:shadow-xl transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <Target className="h-4 w-4 mr-2" />
                  Total Assessments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-primary mb-1">{stats.totalTests}</div>
                <p className="text-xs text-muted-foreground">Practice sessions completed</p>
              </CardContent>
            </Card>

            <Card className="shadow-lg bg-gradient-to-br from-card to-card/50 hover:shadow-xl transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Average Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-4xl font-bold mb-1 ${getScoreColor(stats.averageScore)}`}>
                  {stats.averageScore}%
                </div>
                <p className="text-xs text-muted-foreground">Across all difficulty levels</p>
              </CardContent>
            </Card>

            <Card className="shadow-lg bg-gradient-to-br from-card to-card/50 hover:shadow-xl transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <Trophy className="h-4 w-4 mr-2" />
                  Best Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <div className={`text-4xl font-bold ${getScoreColor(stats.bestScore)}`}>{stats.bestScore}%</div>
                  <Badge variant="outline" className="text-xs capitalize">
                    {stats.bestDifficulty}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Personal best score</p>
              </CardContent>
            </Card>

            <Card className="shadow-lg bg-gradient-to-br from-card to-card/50 hover:shadow-xl transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Learning Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  {getTrendIcon(stats.trend)}
                  <span className={`text-3xl font-semibold capitalize ${getTrendColor(stats.trend)}`}>
                    {stats.trend}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Performance trajectory</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Badge Collection */}
        {badgeStats && (
          <Card className="mb-8 shadow-lg bg-gradient-to-r from-primary/5 to-secondary/5">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-xl">
                <Award className="h-6 w-6 text-primary" />
                <span>Your Badge Collection</span>
              </CardTitle>
              <CardDescription className="text-base">Achievement badges earned through your assessments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-yellow-50 rounded-xl border-2 border-yellow-200">
                  <div className="text-6xl mb-3">🥉</div>
                  <div className="text-2xl font-bold text-yellow-700 mb-1">{badgeStats.beginner}</div>
                  <p className="text-sm text-muted-foreground">Beginner Badges</p>
                </div>
                <div className="text-center p-6 bg-blue-50 rounded-xl border-2 border-blue-200">
                  <div className="text-6xl mb-3">🥈</div>
                  <div className="text-2xl font-bold text-blue-700 mb-1">{badgeStats.intermediate}</div>
                  <p className="text-sm text-muted-foreground">Intermediate Badges</p>
                </div>
                <div className="text-center p-6 bg-purple-50 rounded-xl border-2 border-purple-200">
                  <div className="text-6xl mb-3">🥇</div>
                  <div className="text-2xl font-bold text-purple-700 mb-1">{badgeStats.advanced}</div>
                  <p className="text-sm text-muted-foreground">Advanced Badges</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Company Performance */}
        {stats?.companyStats && Object.keys(stats.companyStats).length > 0 && (
          <Card className="mb-8 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-xl">
                <Building2 className="h-6 w-6 text-primary" />
                <span>Company-Specific Performance</span>
              </CardTitle>
              <CardDescription className="text-base">Your average scores across different company assessments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(stats.companyStats).map(([company, data]) => (
                  <div key={company} className="p-5 bg-muted/30 rounded-xl border border-border">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-bold capitalize text-lg">{company === "general" ? "General" : company.toUpperCase()}</span>
                      <Badge variant="outline" className="text-xs">
                        {data.tests} test{data.tests !== 1 ? "s" : ""}
                      </Badge>
                    </div>
                    <div className={`text-3xl font-bold mb-2 ${getScoreColor(data.avgScore)}`}>
                      {data.avgScore}%
                    </div>
                    <Progress value={data.avgScore} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Topic Performance */}
        {stats?.topicStats && Object.keys(stats.topicStats).length > 0 && (
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
                    <div key={topic} className="space-y-3 p-5 bg-muted/30 rounded-xl border border-border">
                      <div className="flex items-center justify-between">
                        <span className="text-base font-semibold capitalize">{topic}</span>
                        <div className="flex items-center space-x-3">
                          <span className="text-xs text-muted-foreground">
                            {data.correct}/{data.total} correct
                          </span>
                          <Badge
                            variant="outline"
                            className={`text-sm font-bold px-3 py-1 ${
                              data.accuracy >= 80
                                ? "bg-green-100 text-green-800 border-green-300"
                                : data.accuracy >= 60
                                  ? "bg-blue-100 text-blue-800 border-blue-300"
                                  : "bg-yellow-100 text-yellow-800 border-yellow-300"
                            }`}
                          >
                            {data.accuracy}%
                          </Badge>
                        </div>
                      </div>
                      <Progress value={data.accuracy} className="h-3" />
                      <p className="text-xs text-muted-foreground">
                        Practiced in {data.tests} assessment{data.tests !== 1 ? "s" : ""}
                      </p>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Test History */}
        <Card className="shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-xl">
              <Calendar className="h-6 w-6 text-primary" />
              <span>Recent Assessment History</span>
            </CardTitle>
            <CardDescription className="text-base">Your latest test results and performance trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {progressData.slice(0, 10).map((test, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-6 border-2 border-border rounded-xl hover:bg-muted/30 transition-all hover:shadow-md gap-4"
                >
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Trophy className={`h-6 w-6 ${getScoreColor(test.score)}`} />
                      </div>
                      <div>
                        <span className={`text-2xl font-bold ${getScoreColor(test.score)}`}>{test.score}%</span>
                        <p className="text-xs text-muted-foreground">Score</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline" className="capitalize px-3 py-1">
                        {test.difficulty}
                      </Badge>
                      {test.company && test.company !== "general" && (
                        <Badge variant="secondary" className="capitalize px-3 py-1">
                          <Building2 className="h-3 w-3 mr-1" />
                          {test.company}
                        </Badge>
                      )}
                      {test.badge && (
                        <Badge variant="outline" className="px-3 py-1">
                          <span className="mr-1">{getBadgeIcon(test.badge.level)}</span>
                          {test.badge.level}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{formatTime(test.timeSpent)}</span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm font-medium text-foreground">{formatDate(test.date)}</div>
                    <div className="text-xs text-muted-foreground">
                      {test.breakdown?.byTopic ? Object.keys(test.breakdown.byTopic).length : 0} topics covered
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Button */}
        <div className="text-center">
          <Button onClick={() => navigate("/")} size="lg" className="px-10 py-6 text-lg shadow-xl hover:shadow-2xl">
            <Zap className="h-5 w-5 mr-2" />
            Continue Learning Journey
          </Button>
        </div>
      </div>
    </div>
  )
}