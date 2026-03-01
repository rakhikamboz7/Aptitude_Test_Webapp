import React, { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Navigation } from "../components/navigation"

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
  
  const listContainerRef = useRef(null) // Added ref for smart scrolling
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

  const getStatusConfig = (status) => {
    switch (status) {
      case "completed":
        return {
          label: "Completed",
          bgColor: "bg-emerald-100",
          textColor: "text-emerald-700",
          borderColor: "border-emerald-200",
        }
      case "active":
        return {
          label: "In Progress",
          bgColor: "bg-amber-100",
          textColor: "text-amber-700",
          borderColor: "border-amber-200",
        }
      case "draft":
        return {
          label: "Draft",
          bgColor: "bg-slate-100",
          textColor: "text-slate-600",
          borderColor: "border-slate-200",
        }
      default:
        return {
          label: "Unknown",
          bgColor: "bg-slate-100",
          textColor: "text-slate-600",
          borderColor: "border-slate-200",
        }
    }
  }

  const getDifficultyConfig = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return {
          bgColor: "bg-emerald-50",
          textColor: "text-emerald-600",
          borderColor: "border-emerald-200",
        }
      case "medium":
        return {
          bgColor: "bg-blue-50",
          textColor: "text-blue-600",
          borderColor: "border-blue-200",
        }
      case "hard":
        return {
          bgColor: "bg-indigo-50",
          textColor: "text-indigo-600",
          borderColor: "border-indigo-200",
        }
      default:
        return {
          bgColor: "bg-slate-50",
          textColor: "text-slate-600",
          borderColor: "border-slate-200",
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 relative">
            <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="text-slate-600 text-lg font-medium">Loading assessments...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden font-sans">
      
      {/* Light Theme Gradient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-300/30 to-cyan-300/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-sky-300/30 to-blue-400/30 rounded-full blur-3xl" />
      </div>
      
      <Navigation />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12">
        
        {/* Page Title Area */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-200">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900">Assessments</h1>
            </div>
            <p className="text-slate-600 font-medium">
              Track your progress and review past performance
            </p>
          </div>
          <Button
            onClick={() => navigate("/")}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition-all"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Assessment
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border-slate-200 hover:border-blue-300 hover:shadow-md transition-all duration-300 group overflow-hidden relative shadow-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-sky-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <TrendingUp className="h-5 w-5 text-slate-400" />
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-1">{stats.total}</div>
              <div className="text-sm text-slate-500 font-medium">Total Assessments</div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all duration-300 group overflow-hidden relative shadow-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-emerald-50 rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                </div>
                <TrendingUp className="h-5 w-5 text-slate-400" />
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-1">{stats.completed}</div>
              <div className="text-sm text-slate-500 font-medium">Completed</div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 hover:border-amber-300 hover:shadow-md transition-all duration-300 group overflow-hidden relative shadow-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 to-orange-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-amber-50 rounded-lg">
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
                <TrendingUp className="h-5 w-5 text-slate-400" />
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-1">{stats.active}</div>
              <div className="text-sm text-slate-500 font-medium">In Progress</div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all duration-300 group overflow-hidden relative shadow-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-indigo-50 rounded-lg">
                  <Award className="h-5 w-5 text-indigo-600" />
                </div>
                <TrendingUp className="h-5 w-5 text-slate-400" />
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-1">{stats.averageScore}%</div>
              <div className="text-sm text-slate-500 font-medium">Average Score</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-8 shadow-sm">
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
                    onClick={() => {
                      setActiveFilter(filter.id)
                      // Smart Scroll triggers when tab is clicked
                      setTimeout(() => {
                        listContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                      }, 100)
                    }}
                    variant={activeFilter === filter.id ? "default" : "outline"}
                    className={`${
                      activeFilter === filter.id
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/20 border-0"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900"
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
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-inner text-sm"
              />
            </div>
          </div>
        </div>

        {/* Assessments List Container */}
        {filteredAssessments.length === 0 ? (
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200">
                <FileText className="h-10 w-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No assessments found</h3>
              <p className="text-slate-500 font-medium mb-6">
                {searchQuery
                  ? "Try adjusting your search criteria"
                  : "Start your first assessment to track your progress"}
              </p>
              <Button
                onClick={() => navigate("/")}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Assessment
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div 
            ref={listContainerRef} 
            className="bg-slate-50/50 rounded-2xl p-2 sm:p-4 border border-slate-200 shadow-inner max-h-[600px] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-400 transition-colors scroll-mt-24"
          >
            <div className="space-y-4 pr-2">
              {filteredAssessments.map((assessment, index) => (
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
      className="bg-white border-slate-200 hover:border-blue-300 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group cursor-pointer"
      style={{
        animation: `slideUp 0.3s ease-out ${index * 0.05}s backwards`,
      }}
      onClick={() => {
        if (assessment.status === "completed") {
          navigate(`/results/${assessment.sessionId}`)
        } else if (assessment.status === "active") {
          navigate(`/quiz?resume=${assessment.sessionId}`)
        }
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-sky-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <CardContent className="p-6 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Left Section */}
          <div className="flex-1">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl group-hover:bg-white group-hover:border-blue-100 transition-colors">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h3 className="text-xl font-bold text-slate-900">{assessment.company}</h3>
                  <Badge className={`${statusConfig.bgColor} ${statusConfig.textColor} ${statusConfig.borderColor}`}>
                    {statusConfig.label}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 font-medium">
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
                <div className="flex items-center justify-between mb-2 text-sm font-medium">
                  <span className="text-slate-600">
                    Progress: {assessment.correctAnswers}/{assessment.totalQuestions}
                  </span>
                  <span className={`font-bold ${assessment.score >= 80 ? "text-emerald-600" : assessment.score >= 60 ? "text-blue-600" : "text-amber-600"}`}>
                    {assessment.score}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      assessment.score >= 80
                        ? "bg-gradient-to-r from-emerald-400 to-teal-500"
                        : assessment.score >= 60
                        ? "bg-gradient-to-r from-blue-400 to-sky-500"
                        : "bg-gradient-to-r from-amber-400 to-orange-500"
                    }`}
                    style={{ width: `${(assessment.correctAnswers / assessment.totalQuestions) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Active Progress */}
            {assessment.status === "active" && (
              <div className="mb-3">
                <div className="flex items-center justify-between mb-2 text-sm font-medium">
                  <span className="text-slate-600">
                    In Progress: {assessment.correctAnswers}/{assessment.totalQuestions}
                  </span>
                  <span className="text-amber-600 font-bold">
                    {Math.round((assessment.correctAnswers / assessment.totalQuestions) * 100)}% complete
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500"
                    style={{ width: `${(assessment.correctAnswers / assessment.totalQuestions) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Badge Message */}
            {assessment.badge && assessment.status === "completed" && (
              <div className="flex items-center gap-2 mt-2">
                <Trophy className="h-4 w-4 text-amber-500" />
                <span className="text-sm font-semibold text-slate-700">{assessment.badge.message}</span>
              </div>
            )}
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center gap-3">
            {assessment.status === "completed" && (
              <Button
                variant="outline"
                className="bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200 transition-colors"
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
                className="bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/20"
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
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20"
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

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </Card>
  )
}