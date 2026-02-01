import React, { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Progress } from "../components/ui/progress"
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
  ArrowRight,
  Activity,
  CircleDot,
  ChevronRight,
  Star,
  Flame,
  Users,
  LogOut,
  User,
} from "lucide-react"
import { useAuth } from "../contexts/auth-context"

export default function ProgressPage() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [progressData, setProgressData] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [badgeStats, setBadgeStats] = useState(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const chartCanvasRef = useRef(null)
  const gaugeCanvasRef = useRef(null)

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

  // Mouse tracking for parallax
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Draw bar chart
  useEffect(() => {
    if (!chartCanvasRef.current || !progressData.length) return

    const canvas = chartCanvasRef.current
    const ctx = canvas.getContext("2d")
    const dpr = window.devicePixelRatio || 1
    
    canvas.width = canvas.offsetWidth * dpr
    canvas.height = canvas.offsetHeight * dpr
    ctx.scale(dpr, dpr)

    const width = canvas.offsetWidth
    const height = canvas.offsetHeight
    const padding = 40
    const chartWidth = width - padding * 2
    const chartHeight = height - padding * 2

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Get last 7 tests
    const recentTests = progressData.slice(0, 7).reverse()
    const barWidth = chartWidth / recentTests.length
    const maxScore = 100

    // Draw bars
    recentTests.forEach((test, index) => {
      const barHeight = (test.score / maxScore) * chartHeight
      const x = padding + index * barWidth + barWidth * 0.15
      const y = height - padding - barHeight
      const width = barWidth * 0.7

      // Gradient
      const gradient = ctx.createLinearGradient(x, y, x, y + barHeight)
      if (test.score >= 80) {
        gradient.addColorStop(0, "#10b981")
        gradient.addColorStop(1, "#14b8a6")
      } else if (test.score >= 60) {
        gradient.addColorStop(0, "#3b82f6")
        gradient.addColorStop(1, "#0ea5e9")
      } else {
        gradient.addColorStop(0, "#f59e0b")
        gradient.addColorStop(1, "#f97316")
      }

      ctx.fillStyle = gradient
      ctx.fillRect(x, y, width, barHeight)

      // Score text
      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 12px system-ui"
      ctx.textAlign = "center"
      ctx.fillText(`${test.score}%`, x + width / 2, y - 8)

      // Day label
      ctx.fillStyle = "#94a3b8"
      ctx.font = "10px system-ui"
      const date = new Date(test.date)
      const dayLabel = date.toLocaleDateString("en-US", { weekday: "short" })
      ctx.fillText(dayLabel, x + width / 2, height - padding + 20)
    })

    // Draw axes
    ctx.strokeStyle = "#334155"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height - padding)
    ctx.lineTo(width - padding, height - padding)
    ctx.stroke()
  }, [progressData])

  // Draw gauge chart
  useEffect(() => {
    if (!gaugeCanvasRef.current || !stats) return

    const canvas = gaugeCanvasRef.current
    const ctx = canvas.getContext("2d")
    const dpr = window.devicePixelRatio || 1
    
    canvas.width = canvas.offsetWidth * dpr
    canvas.height = canvas.offsetHeight * dpr
    ctx.scale(dpr, dpr)

    const width = canvas.offsetWidth
    const height = canvas.offsetHeight
    const centerX = width / 2
    const centerY = height - 20
    const radius = Math.min(width, height) / 2 - 30

    ctx.clearRect(0, 0, width, height)

    // Background arc
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, Math.PI, 2 * Math.PI, false)
    ctx.strokeStyle = "#1e293b"
    ctx.lineWidth = 20
    ctx.stroke()

    // Score arc
    const scoreAngle = Math.PI + (stats.averageScore / 100) * Math.PI
    const gradient = ctx.createLinearGradient(centerX - radius, centerY, centerX + radius, centerY)
    
    if (stats.averageScore >= 80) {
      gradient.addColorStop(0, "#10b981")
      gradient.addColorStop(1, "#14b8a6")
    } else if (stats.averageScore >= 60) {
      gradient.addColorStop(0, "#3b82f6")
      gradient.addColorStop(1, "#0ea5e9")
    } else {
      gradient.addColorStop(0, "#f59e0b")
      gradient.addColorStop(1, "#f97316")
    }

    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, Math.PI, scoreAngle, false)
    ctx.strokeStyle = gradient
    ctx.lineWidth = 20
    ctx.lineCap = "round"
    ctx.stroke()

    // Center text
    ctx.fillStyle = "#ffffff"
    ctx.font = "bold 48px system-ui"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(`${stats.averageScore}%`, centerX, centerY - 15)

    ctx.fillStyle = "#94a3b8"
    ctx.font = "14px system-ui"
    ctx.fillText("Average Score", centerX, centerY + 20)
  }, [stats])

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
        return <TrendingUp className="h-5 w-5 text-emerald-400" />
      case "declining":
        return <TrendingDown className="h-5 w-5 text-red-400" />
      default:
        return <Minus className="h-5 w-5 text-slate-400" />
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

  const getScoreColor = (score) => {
    if (score >= 80) return "text-emerald-400"
    if (score >= 60) return "text-blue-400"
    if (score >= 40) return "text-amber-400"
    return "text-red-400"
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
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 relative">
            <div className="absolute inset-0 border-4 border-blue-600/30 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="text-slate-300 text-lg">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (progressData.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 relative overflow-hidden">
        {/* Gradient Orbs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-sky-600/20 to-blue-700/20 rounded-full blur-3xl" />
        </div>

        {/* Header */}
        <header className="relative z-10 border-b border-slate-800/50 bg-slate-900/80 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
                <div className="p-2 bg-gradient-to-br from-blue-600 to-sky-500 rounded-xl shadow-xl">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white">
                  Aptitude<span className="text-sky-400">AI</span>
                </span>
              </div>
              {user && (
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate("/profile")}
                    className="bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 text-white"
                  >
                    <User className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={logout}
                    className="bg-slate-800/50 hover:bg-red-500/10 border border-slate-700/50 text-white hover:text-red-400"
                  >
                    <LogOut className="h-5 w-5" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="flex items-center justify-center min-h-[calc(100vh-5rem)] px-4 relative z-10">
          <Card className="max-w-md text-center bg-slate-900/50 backdrop-blur-xl border-slate-800/50 shadow-2xl">
            <CardHeader>
              <div className="p-6 bg-gradient-to-br from-blue-600/10 to-sky-600/10 rounded-full w-fit mx-auto mb-4 border border-blue-500/20">
                <BarChart3 className="h-16 w-16 text-blue-400" />
              </div>
              <CardTitle className="text-3xl text-white">Start Your Journey</CardTitle>
              <CardDescription className="text-base text-slate-400 mt-2">
                Take your first assessment to unlock detailed progress tracking and analytics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => navigate("/")}
                className="w-full bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-white shadow-lg shadow-blue-500/30"
                size="lg"
              >
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
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Gradient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
        <div
          className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-full blur-3xl"
          style={{
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
            transition: "transform 0.5s ease-out",
          }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-sky-600/20 to-blue-700/20 rounded-full blur-3xl"
          style={{
            transform: `translate(${-mousePosition.x}px, ${-mousePosition.y}px)`,
            transition: "transform 0.5s ease-out",
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-slate-800/50 bg-slate-900/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
              <div className="p-2 bg-gradient-to-br from-blue-600 to-sky-500 rounded-xl shadow-xl">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                Aptitude<span className="text-sky-400">AI</span>
              </span>
            </div>
            {user && (
              <div className="flex items-center gap-3">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-white">{user.profile?.firstName || user.username}</p>
                  <div className="flex items-center justify-end gap-1 text-xs text-slate-400">
                    <Trophy className="h-3 w-3 text-amber-500" />
                    {stats?.totalTests || 0} completed
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate("/profile")}
                  className="bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 text-white"
                >
                  <User className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={logout}
                  className="bg-slate-800/50 hover:bg-red-500/10 border border-slate-700/50 text-white hover:text-red-400"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600/10 to-sky-600/10 backdrop-blur-sm border border-blue-500/20 px-6 py-3 rounded-full mb-6">
            <Activity className="h-4 w-4 text-sky-400" />
            <span className="text-sm font-medium text-slate-200">Performance Analytics</span>
          </div>

          <h1 className="text-5xl font-bold text-white mb-4">
            Your Learning <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-400">Dashboard</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Track your improvement, analyze performance, and celebrate achievements
          </p>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800/50 hover:border-slate-700/50 transition-all duration-300 group overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-sky-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 bg-gradient-to-br from-blue-600 to-sky-600 rounded-lg">
                    <Target className="h-5 w-5 text-white" />
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-500 group-hover:text-sky-400 transition-colors" />
                </div>
                <div className="text-4xl font-bold text-white mb-1">{stats.totalTests}</div>
                <div className="text-sm text-slate-400">Total Assessments</div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800/50 hover:border-slate-700/50 transition-all duration-300 group overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/5 to-teal-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-white" />
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                </div>
                <div className={`text-4xl font-bold mb-1 ${getScoreColor(stats.averageScore)}`}>
                  {stats.averageScore}%
                </div>
                <div className="text-sm text-slate-400">Average Score</div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800/50 hover:border-slate-700/50 transition-all duration-300 group overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-600/5 to-orange-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 bg-gradient-to-br from-amber-600 to-orange-600 rounded-lg">
                    <Trophy className="h-5 w-5 text-white" />
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-500 group-hover:text-amber-400 transition-colors" />
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <div className={`text-4xl font-bold ${getScoreColor(stats.bestScore)}`}>
                    {stats.bestScore}%
                  </div>
                  <Badge className="bg-slate-800/50 text-slate-300 border-slate-700/50 capitalize text-xs">
                    {stats.bestDifficulty}
                  </Badge>
                </div>
                <div className="text-sm text-slate-400">Best Performance</div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800/50 hover:border-slate-700/50 transition-all duration-300 group overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-blue-700/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-lg">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  {getTrendIcon(stats.trend)}
                </div>
                <div className={`text-3xl font-bold capitalize mb-1 ${getTrendColor(stats.trend)}`}>
                  {stats.trend}
                </div>
                <div className="text-sm text-slate-400">Learning Trend</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Performance Chart */}
          <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800/50 overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800/30 to-slate-900/30" />
            <CardHeader className="relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-blue-600 to-sky-600 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-white">Recent Performance</CardTitle>
                    <CardDescription className="text-slate-400">Last 7 assessments</CardDescription>
                  </div>
                </div>
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                  Trending
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <canvas ref={chartCanvasRef} className="w-full h-64" />
            </CardContent>
          </Card>

          {/* Gauge Chart */}
          <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800/50 overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800/30 to-slate-900/30" />
            <CardHeader className="relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg">
                    <CircleDot className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-white">Success Rate</CardTitle>
                    <CardDescription className="text-slate-400">Overall performance</CardDescription>
                  </div>
                </div>
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                  Active
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <canvas ref={gaugeCanvasRef} className="w-full h-64" />
            </CardContent>
          </Card>
        </div>

        {/* Badge Collection */}
        {badgeStats && (
          <Card className="mb-8 bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-xl border-slate-800/50 overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-600/5 to-orange-600/5" />
            <CardHeader className="relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-br from-amber-600 to-orange-600 rounded-xl shadow-lg">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-white">Achievement Collection</CardTitle>
                  <CardDescription className="text-slate-400 text-base">Badges earned through excellence</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="relative group/badge">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-2xl blur-xl opacity-0 group-hover/badge:opacity-100 transition-opacity duration-500" />
                  <div className="relative text-center p-8 bg-slate-800/50 backdrop-blur-sm rounded-2xl border-2 border-amber-500/30 hover:border-amber-500/50 transition-all duration-300 hover:scale-105">
                    <div className="text-7xl mb-4 transform group-hover/badge:scale-110 transition-transform duration-300">🥉</div>
                    <div className="text-4xl font-bold text-amber-400 mb-2">{badgeStats.beginner}</div>
                    <p className="text-sm text-slate-400 font-medium">Beginner Badges</p>
                  </div>
                </div>

                <div className="relative group/badge">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-sky-500/20 rounded-2xl blur-xl opacity-0 group-hover/badge:opacity-100 transition-opacity duration-500" />
                  <div className="relative text-center p-8 bg-slate-800/50 backdrop-blur-sm rounded-2xl border-2 border-blue-500/30 hover:border-blue-500/50 transition-all duration-300 hover:scale-105">
                    <div className="text-7xl mb-4 transform group-hover/badge:scale-110 transition-transform duration-300">🥈</div>
                    <div className="text-4xl font-bold text-blue-400 mb-2">{badgeStats.intermediate}</div>
                    <p className="text-sm text-slate-400 font-medium">Intermediate Badges</p>
                  </div>
                </div>

                <div className="relative group/badge">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-blue-600/20 rounded-2xl blur-xl opacity-0 group-hover/badge:opacity-100 transition-opacity duration-500" />
                  <div className="relative text-center p-8 bg-slate-800/50 backdrop-blur-sm rounded-2xl border-2 border-indigo-500/30 hover:border-indigo-500/50 transition-all duration-300 hover:scale-105">
                    <div className="text-7xl mb-4 transform group-hover/badge:scale-110 transition-transform duration-300">🥇</div>
                    <div className="text-4xl font-bold text-indigo-400 mb-2">{badgeStats.advanced}</div>
                    <p className="text-sm text-slate-400 font-medium">Advanced Badges</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Company & Topic Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Company Performance */}
          {stats?.companyStats && Object.keys(stats.companyStats).length > 0 && (
            <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800/50 overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800/30 to-slate-900/30" />
              <CardHeader className="relative z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-blue-600 to-sky-600 rounded-lg">
                    <Building2 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-white">Company Performance</CardTitle>
                    <CardDescription className="text-slate-400">Target-specific scores</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="space-y-4">
                  {Object.entries(stats.companyStats)
                    .sort(([, a], [, b]) => b.avgScore - a.avgScore)
                    .map(([company, data]) => (
                      <div key={company} className="group/item">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">
                              {company === "google" ? "🔍" : 
                               company === "microsoft" ? "🪟" : 
                               company === "amazon" ? "📦" : 
                               company === "apple" ? "🍎" : 
                               company === "meta" ? "👥" : "🏢"}
                            </div>
                            <div>
                              <span className="font-semibold capitalize text-white">
                                {company === "general" ? "General" : company}
                              </span>
                              <p className="text-xs text-slate-500">
                                {data.tests} test{data.tests !== 1 ? "s" : ""}
                              </p>
                            </div>
                          </div>
                          <Badge className={`${
                            data.avgScore >= 80 ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" :
                            data.avgScore >= 60 ? "bg-blue-500/20 text-blue-300 border-blue-500/30" :
                            "bg-amber-500/20 text-amber-300 border-amber-500/30"
                          } font-bold`}>
                            {data.avgScore}%
                          </Badge>
                        </div>
                        <div className="w-full bg-slate-800/50 rounded-full h-2.5 overflow-hidden border border-slate-700/50">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              data.avgScore >= 80 ? "bg-gradient-to-r from-emerald-500 to-teal-500" :
                              data.avgScore >= 60 ? "bg-gradient-to-r from-blue-500 to-sky-500" :
                              "bg-gradient-to-r from-amber-500 to-orange-500"
                            }`}
                            style={{ width: `${data.avgScore}%` }}
                          />
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Topic Mastery */}
          {stats?.topicStats && Object.keys(stats.topicStats).length > 0 && (
            <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800/50 overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800/30 to-slate-900/30" />
              <CardHeader className="relative z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-lg">
                    <BookOpen className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-white">Topic Mastery</CardTitle>
                    <CardDescription className="text-slate-400">Skills breakdown</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="space-y-4">
                  {Object.entries(stats.topicStats)
                    .sort(([, a], [, b]) => b.accuracy - a.accuracy)
                    .slice(0, 5)
                    .map(([topic, data]) => (
                      <div key={topic} className="group/item">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <span className="font-semibold capitalize text-white text-sm">{topic}</span>
                            <p className="text-xs text-slate-500">
                              {data.correct}/{data.total} correct
                            </p>
                          </div>
                          <Badge className={`${
                            data.accuracy >= 80 ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" :
                            data.accuracy >= 60 ? "bg-blue-500/20 text-blue-300 border-blue-500/30" :
                            "bg-amber-500/20 text-amber-300 border-amber-500/30"
                          } font-bold`}>
                            {data.accuracy}%
                          </Badge>
                        </div>
                        <div className="w-full bg-slate-800/50 rounded-full h-2.5 overflow-hidden border border-slate-700/50">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              data.accuracy >= 80 ? "bg-gradient-to-r from-emerald-500 to-teal-500" :
                              data.accuracy >= 60 ? "bg-gradient-to-r from-blue-500 to-sky-500" :
                              "bg-gradient-to-r from-amber-500 to-orange-500"
                            }`}
                            style={{ width: `${data.accuracy}%` }}
                          />
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Recent History */}
        <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800/50 mb-8 overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800/30 to-slate-900/30" />
          <CardHeader className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-blue-600 to-sky-600 rounded-xl shadow-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl text-white">Recent Activity</CardTitle>
                <CardDescription className="text-slate-400 text-base">Latest assessment results</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="space-y-3">
              {progressData.slice(0, 5).map((test, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl hover:bg-slate-700/30 hover:border-slate-600/50 transition-all duration-300 group/item gap-4"
                  style={{
                    animation: `slideUp 0.5s ease-out ${index * 0.1}s backwards`,
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${
                      test.score >= 80 ? "bg-gradient-to-br from-emerald-600 to-teal-600" :
                      test.score >= 60 ? "bg-gradient-to-br from-blue-600 to-sky-600" :
                      "bg-gradient-to-br from-amber-600 to-orange-600"
                    }`}>
                      <Trophy className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-2xl font-bold ${getScoreColor(test.score)}`}>
                          {test.score}%
                        </span>
                        <Badge className="capitalize bg-slate-700/50 text-slate-300 border-slate-600/50">
                          {test.difficulty}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTime(test.timeSpent)}
                        </span>
                        {test.company && test.company !== "general" && (
                          <span className="flex items-center gap-1 capitalize">
                            <Building2 className="h-3 w-3" />
                            {test.company}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-white">{formatDate(test.date)}</div>
                    {test.badge && (
                      <div className="text-xs text-slate-400 mt-1">
                        {getBadgeIcon(test.badge.level)} {test.badge.level}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <Button
            onClick={() => navigate("/")}
            size="lg"
            className="text-lg px-12 py-7 h-auto bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-white font-semibold rounded-xl shadow-2xl shadow-blue-500/40 transition-all duration-300 group"
          >
            <Zap className="h-6 w-6 mr-2 group-hover:scale-110 transition-transform duration-300" />
            Continue Learning Journey
            <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
        </div>
      </main>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}