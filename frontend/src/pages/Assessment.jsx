import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import {
  Brain,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Filter,
  Plus,
  Search,
  TrendingUp,
  Award,
  Target,
  BookOpen,
  BarChart3,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  Zap,
  Trophy,
  Edit,
  Trash2,
  Eye,
  Building2,
} from "lucide-react"

export default function AssessmentsPage() {
  const navigate = useNavigate()

  const [assessments, setAssessments] = useState([])
  const [filteredAssessments, setFilteredAssessments] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("all") // all, completed, active, draft
  const [expandedGroups, setExpandedGroups] = useState(new Set(["recent"]))
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    active: 0,
    averageScore: 0,
  })

  useEffect(() => {
    fetchAssessments()
  }, [])

  useEffect(() => {
    filterAssessments()
  }, [assessments, searchQuery, activeFilter])

  const fetchAssessments = async () => {
    try {
      setIsLoading(true)
      // Simulated data - replace with actual API call
      // const response = await fetch(`/api/test-results?userId=${user._id}`)
      // const data = await response.json()

      // Mock data for demonstration
      const mockAssessments = [
        {
          _id: "1",
          sessionId: "session-1",
          company: "Google",
          difficulty: "medium",
          score: 85,
          correctAnswers: 17,
          totalQuestions: 20,
          timeSpent: 1200,
          status: "completed",
          createdAt: "2024-02-01T10:30:00Z",
          badge: {
            level: "advanced",
            color: "blue",
            message: "Excellent performance!",
          },
          topicBreakdown: new Map([
            ["Logical Reasoning", { correct: 8, total: 10, percentage: 80 }],
            ["Quantitative Aptitude", { correct: 9, total: 10, percentage: 90 }],
          ]),
        },
        {
          _id: "2",
          sessionId: "session-2",
          company: "Microsoft",
          difficulty: "hard",
          score: 70,
          correctAnswers: 14,
          totalQuestions: 20,
          timeSpent: 1500,
          status: "completed",
          createdAt: "2024-01-28T14:20:00Z",
          badge: {
            level: "intermediate",
            color: "green",
            message: "Good progress!",
          },
        },
        {
          _id: "3",
          sessionId: "session-3",
          company: "Amazon",
          difficulty: "easy",
          score: 0,
          correctAnswers: 12,
          totalQuestions: 20,
          timeSpent: 600,
          status: "active",
          createdAt: "2024-01-30T09:15:00Z",
        },
        {
          _id: "4",
          sessionId: "session-4",
          company: "Meta",
          difficulty: "medium",
          score: 92,
          correctAnswers: 18,
          totalQuestions: 20,
          timeSpent: 1100,
          status: "completed",
          createdAt: "2024-01-25T16:45:00Z",
          badge: {
            level: "advanced",
            color: "purple",
            message: "Outstanding!",
          },
        },
        {
          _id: "5",
          sessionId: "session-5",
          company: "Apple",
          difficulty: "hard",
          score: 0,
          correctAnswers: 0,
          totalQuestions: 20,
          timeSpent: 0,
          status: "draft",
          createdAt: "2024-01-20T11:30:00Z",
        },
      ]

      setAssessments(mockAssessments)

      // Calculate stats
      const completed = mockAssessments.filter((a) => a.status === "completed")
      const avgScore = completed.length > 0
        ? Math.round(completed.reduce((sum, a) => sum + a.score, 0) / completed.length)
        : 0

      setStats({
        total: mockAssessments.length,
        completed: completed.length,
        active: mockAssessments.filter((a) => a.status === "active").length,
        averageScore: avgScore,
      })
    } catch (error) {
      console.error("Error fetching assessments:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterAssessments = () => {
    let filtered = [...assessments]

    // Apply status filter
    if (activeFilter !== "all") {
      filtered = filtered.filter((a) => a.status === activeFilter)
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (a) =>
          a.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.difficulty.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredAssessments(filtered)
  }

  const toggleGroup = (groupName) => {
    const newExpanded = new Set(expandedGroups)
    if (newExpanded.has(groupName)) {
      newExpanded.delete(groupName)
    } else {
      newExpanded.add(groupName)
    }
    setExpandedGroups(newExpanded)
  }

  const getStatusConfig = (status) => {
    switch (status) {
      case "completed":
        return {
          label: "Completed",
          bgColor: "bg-emerald-500/10",
          textColor: "text-emerald-400",
          borderColor: "border-emerald-500/30",
        }
      case "active":
        return {
          label: "In Progress",
          bgColor: "bg-amber-500/10",
          textColor: "text-amber-400",
          borderColor: "border-amber-500/30",
        }
      case "draft":
        return {
          label: "Draft",
          bgColor: "bg-slate-500/10",
          textColor: "text-slate-400",
          borderColor: "border-slate-500/30",
        }
      default:
        return {
          label: "Unknown",
          bgColor: "bg-slate-500/10",
          textColor: "text-slate-400",
          borderColor: "border-slate-500/30",
        }
    }
  }

  const getDifficultyConfig = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return {
          bgColor: "bg-emerald-500/10",
          textColor: "text-emerald-400",
          borderColor: "border-emerald-500/30",
        }
      case "medium":
        return {
          bgColor: "bg-blue-500/10",
          textColor: "text-blue-400",
          borderColor: "border-blue-500/30",
        }
      case "hard":
        return {
          bgColor: "bg-indigo-500/10",
          textColor: "text-indigo-400",
          borderColor: "border-indigo-500/30",
        }
      default:
        return {
          bgColor: "bg-slate-500/10",
          textColor: "text-slate-400",
          borderColor: "border-slate-500/30",
        }
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "Yesterday"
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }

  const groupAssessmentsByDate = (assessments) => {
    const groups = {
      recent: [],
      thisMonth: [],
      older: [],
    }

    const now = new Date()
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    assessments.forEach((assessment) => {
      const assessmentDate = new Date(assessment.createdAt)
      if (assessmentDate > sevenDaysAgo) {
        groups.recent.push(assessment)
      } else if (assessmentDate > thirtyDaysAgo) {
        groups.thisMonth.push(assessment)
      } else {
        groups.older.push(assessment)
      }
    })

    return groups
  }

  const groupedAssessments = groupAssessmentsByDate(filteredAssessments)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 relative">
            <div className="absolute inset-0 border-4 border-blue-600/30 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="text-slate-300 text-lg">Loading assessments...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Gradient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-sky-600/20 to-blue-700/20 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-slate-800/50 bg-slate-900/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 bg-gradient-to-br from-blue-600 to-sky-500 rounded-xl shadow-lg">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-white">Assessments</h1>
              </div>
              <p className="text-slate-400 ml-14">
                Track your progress and review past performance
              </p>
            </div>
            <Button
              onClick={() => navigate("/")}
              className="bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-white shadow-lg shadow-blue-500/30"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Assessment
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800/50 hover:border-slate-700/50 transition-all duration-300 group overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-sky-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2.5 bg-gradient-to-br from-blue-600 to-sky-600 rounded-lg">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <TrendingUp className="h-5 w-5 text-slate-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stats.total}</div>
              <div className="text-sm text-slate-400">Total Assessments</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800/50 hover:border-slate-700/50 transition-all duration-300 group overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/5 to-teal-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2.5 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-white" />
                </div>
                <TrendingUp className="h-5 w-5 text-slate-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stats.completed}</div>
              <div className="text-sm text-slate-400">Completed</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800/50 hover:border-slate-700/50 transition-all duration-300 group overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-600/5 to-orange-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2.5 bg-gradient-to-br from-amber-600 to-orange-600 rounded-lg">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <TrendingUp className="h-5 w-5 text-slate-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stats.active}</div>
              <div className="text-sm text-slate-400">In Progress</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800/50 hover:border-slate-700/50 transition-all duration-300 group overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-blue-700/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2.5 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-lg">
                  <Award className="h-5 w-5 text-white" />
                </div>
                <TrendingUp className="h-5 w-5 text-slate-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stats.averageScore}%</div>
              <div className="text-sm text-slate-400">Average Score</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {[
                { id: "all", label: "All", icon: FileText },
                { id: "completed", label: "Completed", icon: CheckCircle2 },
                { id: "active", label: "In Progress", icon: Clock },
                { id: "draft", label: "Drafts", icon: Edit },
              ].map((filter) => {
                const Icon = filter.icon
                return (
                  <Button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                    variant={activeFilter === filter.id ? "default" : "outline"}
                    className={`${
                      activeFilter === filter.id
                        ? "bg-gradient-to-r from-blue-600 to-sky-600 text-white shadow-lg shadow-blue-500/30 border-0"
                        : "bg-slate-800/50 text-slate-300 border-slate-700/50 hover:bg-slate-700/50 hover:text-white"
                    } transition-all duration-300`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {filter.label}
                  </Button>
                )
              })}
            </div>

            <div className="relative w-full lg:w-80">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by company or difficulty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Assessments List */}
        {filteredAssessments.length === 0 ? (
          <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800/50">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-slate-800/50 rounded-full flex items-center justify-center">
                <FileText className="h-10 w-10 text-slate-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No assessments found</h3>
              <p className="text-slate-400 mb-6">
                {searchQuery
                  ? "Try adjusting your search criteria"
                  : "Start your first assessment to track your progress"}
              </p>
              <Button
                onClick={() => navigate("/")}
                className="bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-white shadow-lg shadow-blue-500/30"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Assessment
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Recent Assessments */}
            {groupedAssessments.recent.length > 0 && (
              <div>
                <button
                  onClick={() => toggleGroup("recent")}
                  className="flex items-center gap-2 mb-4 text-white hover:text-sky-400 transition-colors group"
                >
                  {expandedGroups.has("recent") ? (
                    <ChevronDown className="h-5 w-5" />
                  ) : (
                    <ChevronRight className="h-5 w-5" />
                  )}
                  <h2 className="text-xl font-bold">Recent (Last 7 Days)</h2>
                  <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                    {groupedAssessments.recent.length}
                  </Badge>
                </button>

                {expandedGroups.has("recent") && (
                  <div className="grid grid-cols-1 gap-4">
                    {groupedAssessments.recent.map((assessment, index) => (
                      <AssessmentCard
                        key={assessment._id}
                        assessment={assessment}
                        index={index}
                        getStatusConfig={getStatusConfig}
                        getDifficultyConfig={getDifficultyConfig}
                        formatDate={formatDate}
                        formatTime={formatTime}
                        navigate={navigate}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* This Month */}
            {groupedAssessments.thisMonth.length > 0 && (
              <div>
                <button
                  onClick={() => toggleGroup("thisMonth")}
                  className="flex items-center gap-2 mb-4 text-white hover:text-sky-400 transition-colors group"
                >
                  {expandedGroups.has("thisMonth") ? (
                    <ChevronDown className="h-5 w-5" />
                  ) : (
                    <ChevronRight className="h-5 w-5" />
                  )}
                  <h2 className="text-xl font-bold">This Month</h2>
                  <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                    {groupedAssessments.thisMonth.length}
                  </Badge>
                </button>

                {expandedGroups.has("thisMonth") && (
                  <div className="grid grid-cols-1 gap-4">
                    {groupedAssessments.thisMonth.map((assessment, index) => (
                      <AssessmentCard
                        key={assessment._id}
                        assessment={assessment}
                        index={index}
                        getStatusConfig={getStatusConfig}
                        getDifficultyConfig={getDifficultyConfig}
                        formatDate={formatDate}
                        formatTime={formatTime}
                        navigate={navigate}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Older */}
            {groupedAssessments.older.length > 0 && (
              <div>
                <button
                  onClick={() => toggleGroup("older")}
                  className="flex items-center gap-2 mb-4 text-white hover:text-sky-400 transition-colors group"
                >
                  {expandedGroups.has("older") ? (
                    <ChevronDown className="h-5 w-5" />
                  ) : (
                    <ChevronRight className="h-5 w-5" />
                  )}
                  <h2 className="text-xl font-bold">Older</h2>
                  <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                    {groupedAssessments.older.length}
                  </Badge>
                </button>

                {expandedGroups.has("older") && (
                  <div className="grid grid-cols-1 gap-4">
                    {groupedAssessments.older.map((assessment, index) => (
                      <AssessmentCard
                        key={assessment._id}
                        assessment={assessment}
                        index={index}
                        getStatusConfig={getStatusConfig}
                        getDifficultyConfig={getDifficultyConfig}
                        formatDate={formatDate}
                        formatTime={formatTime}
                        navigate={navigate}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

function AssessmentCard({
  assessment,
  index,
  getStatusConfig,
  getDifficultyConfig,
  formatDate,
  formatTime,
  navigate,
}) {
  const statusConfig = getStatusConfig(assessment.status)
  const difficultyConfig = getDifficultyConfig(assessment.difficulty)

  return (
    <Card
      className="bg-slate-900/50 backdrop-blur-xl border-slate-800/50 hover:border-slate-700/50 transition-all duration-500 overflow-hidden group cursor-pointer"
      style={{
        animation: `slideUp 0.5s ease-out ${index * 0.05}s backwards`,
      }}
      onClick={() => {
        if (assessment.status === "completed") {
          navigate(`/results/${assessment.sessionId}`)
        } else if (assessment.status === "active") {
          navigate(`/quiz?resume=${assessment.sessionId}`)
        }
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-sky-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <CardContent className="p-6 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Left Section */}
          <div className="flex-1">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-sky-600 rounded-xl shadow-lg flex-shrink-0">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h3 className="text-xl font-bold text-white">{assessment.company}</h3>
                  <Badge className={`${statusConfig.bgColor} ${statusConfig.textColor} ${statusConfig.borderColor}`}>
                    {statusConfig.label}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    {formatDate(assessment.createdAt)}
                  </div>
                  {assessment.status === "completed" && (
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      {formatTime(assessment.timeSpent)}
                    </div>
                  )}
                  <Badge className={`${difficultyConfig.bgColor} ${difficultyConfig.textColor} ${difficultyConfig.borderColor} capitalize`}>
                    {assessment.difficulty}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Progress Bar for Completed */}
            {assessment.status === "completed" && (
              <div className="mb-3">
                <div className="flex items-center justify-between mb-2 text-sm">
                  <span className="text-slate-400">
                    Progress: {assessment.correctAnswers}/{assessment.totalQuestions}
                  </span>
                  <span className={`font-semibold ${assessment.score >= 80 ? "text-emerald-400" : assessment.score >= 60 ? "text-blue-400" : "text-amber-400"}`}>
                    {assessment.score}%
                  </span>
                </div>
                <div className="w-full bg-slate-800/50 rounded-full h-2 overflow-hidden border border-slate-700/50">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      assessment.score >= 80
                        ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                        : assessment.score >= 60
                        ? "bg-gradient-to-r from-blue-500 to-sky-500"
                        : "bg-gradient-to-r from-amber-500 to-orange-500"
                    }`}
                    style={{ width: `${(assessment.correctAnswers / assessment.totalQuestions) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Active Progress */}
            {assessment.status === "active" && (
              <div className="mb-3">
                <div className="flex items-center justify-between mb-2 text-sm">
                  <span className="text-slate-400">
                    In Progress: {assessment.correctAnswers}/{assessment.totalQuestions}
                  </span>
                  <span className="text-amber-400 font-semibold">
                    {Math.round((assessment.correctAnswers / assessment.totalQuestions) * 100)}% complete
                  </span>
                </div>
                <div className="w-full bg-slate-800/50 rounded-full h-2 overflow-hidden border border-slate-700/50">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
                    style={{ width: `${(assessment.correctAnswers / assessment.totalQuestions) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Badge Message */}
            {assessment.badge && assessment.status === "completed" && (
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-amber-400" />
                <span className="text-sm text-slate-300">{assessment.badge.message}</span>
              </div>
            )}
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center gap-3">
            {assessment.status === "completed" && (
              <Button
                variant="outline"
                className="bg-slate-800/50 text-white border-slate-700/50 hover:bg-slate-700/50 hover:border-slate-600/50"
                onClick={(e) => {
                  e.stopPropagation()
                  navigate(`/results/${assessment.sessionId}`)
                }}
              >
                <Eye className="h-4 w-4 mr-2" />
                View Results
              </Button>
            )}
            {assessment.status === "active" && (
              <Button
                className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white shadow-lg shadow-amber-500/30"
                onClick={(e) => {
                  e.stopPropagation()
                  navigate(`/quiz?resume=${assessment.sessionId}`)
                }}
              >
                <ArrowRight className="h-4 w-4 mr-2" />
                Continue
              </Button>
            )}
            {assessment.status === "draft" && (
              <Button
                className="bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-white shadow-lg shadow-blue-500/30"
                onClick={(e) => {
                  e.stopPropagation()
                  navigate(`/quiz?draft=${assessment.sessionId}`)
                }}
              >
                <Edit className="h-4 w-4 mr-2" />
                Start
              </Button>
            )}
          </div>
        </div>
      </CardContent>

      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </Card>
  )
}