import React, { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Navigation } from "../components/navigation"
import {
  CheckCircle2, Clock, FileText, Plus, Search,
  TrendingUp, Award, ChevronDown, ChevronRight,
  ArrowRight, Trophy, Eye, Calendar, RefreshCw,
  Building2, Edit, Globe, LayoutGrid, Package, Smartphone, Users
} from "lucide-react"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

export default function AssessmentsPage() {
  const navigate = useNavigate()

  const [assessments, setAssessments]                 = useState([])
  const [filteredAssessments, setFilteredAssessments] = useState([])
  const [searchQuery, setSearchQuery]                 = useState("")
  const [activeFilter, setActiveFilter]               = useState("all")
  const [expandedGroups, setExpandedGroups]           = useState(new Set(["recent"]))
  const [isLoading, setIsLoading]                     = useState(true)
  const [error, setError]                             = useState(null)
  const [stats, setStats]                             = useState({ total: 0, completed: 0, inProgress: 0, averageScore: 0 })

  const listContainerRef = useRef(null)

  // ─── Fetch from API ──────────────────────────────────────────────────────────
  const fetchAssessments = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const token = localStorage.getItem("token")
      if (!token) { navigate("/auth"); return }

      const response = await fetch(`${API_URL}/api/assessments?limit=50`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()
      if (!data.success) throw new Error(data.error || "Failed to fetch assessments")

      // ✅ Map MongoDB fields to what the UI expects
      const shaped = data.assessments.map((a) => ({
        _id:            a._id,
        company:        a.companyName || "general",
        difficulty:     a.difficulty,
        score:          a.score              ?? 0,
        correctAnswers: a.correctAnswersCount ?? 0,
        totalQuestions: a.totalQuestions      ?? 15,
        timeSpent:      a.totalTime           ?? 0,
        status:         a.status,
        createdAt:      a.createdAt,
        feedback:       a.feedback,
        badge: a.badge?.level ? {
          level:   a.badge.level,
          color:   a.badge.color,
          message: a.badge.level === "advanced"     ? "Outstanding performance!"
                 : a.badge.level === "intermediate" ? "Good progress!"
                 : "Keep practicing!",
        } : null,
      }))

      setAssessments(shaped)

      const completed = shaped.filter((a) => a.status === "completed")
      setStats({
        total:        shaped.length,
        completed:    completed.length,
        inProgress:   shaped.filter((a) => a.status === "in-progress").length,
        averageScore: completed.length > 0
          ? Math.round(completed.reduce((s, a) => s + a.score, 0) / completed.length)
          : 0,
      })
    } catch (err) {
      console.error("Fetch assessments error:", err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { fetchAssessments() }, [])

  // ─── Filter ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    let filtered = [...assessments]

    if (activeFilter !== "all") {
      const map = { completed: "completed", active: "in-progress" }
      filtered = filtered.filter((a) => a.status === (map[activeFilter] ?? activeFilter))
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (a) => a.company.toLowerCase().includes(q) || a.difficulty.toLowerCase().includes(q)
      )
    }

    setFilteredAssessments(filtered)
  }, [assessments, searchQuery, activeFilter])

  // ─── Group by date ───────────────────────────────────────────────────────────
  const groupByDate = (list) => {
    const now = Date.now()
    const day = 24 * 60 * 60 * 1000
    const g   = { recent: [], thisMonth: [], older: [] }
    list.forEach((a) => {
      const diff = now - new Date(a.createdAt).getTime()
      if (diff < 7 * day)       g.recent.push(a)
      else if (diff < 30 * day) g.thisMonth.push(a)
      else                      g.older.push(a)
    })
    return g
  }

  const toggleGroup = (name) => {
    const next = new Set(expandedGroups)
    next.has(name) ? next.delete(name) : next.add(name)
    setExpandedGroups(next)
    // Smart scroll
    setTimeout(() => {
      listContainerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 100)
  }

  // ─── Config helpers (light theme) ────────────────────────────────────────────
  const statusCfg = (s) => ({
    completed:     { label: "Completed",   bg: "bg-emerald-100", text: "text-emerald-700", border: "border-emerald-200" },
    "in-progress": { label: "In Progress", bg: "bg-amber-100",   text: "text-amber-700",   border: "border-amber-200"   },
    draft:         { label: "Draft",       bg: "bg-slate-100",   text: "text-slate-600",   border: "border-slate-200"   },
  }[s] ?? { label: s, bg: "bg-slate-100", text: "text-slate-600", border: "border-slate-200" })

  const diffCfg = (d) => ({
    easy:   { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200" },
    medium: { bg: "bg-blue-50",    text: "text-blue-600",    border: "border-blue-200"    },
    hard:   { bg: "bg-indigo-50",  text: "text-indigo-600",  border: "border-indigo-200"  },
  }[d] ?? { bg: "bg-slate-50", text: "text-slate-600", border: "border-slate-200" })

  const formatDate = (ds) => {
    const diff = Math.floor((Date.now() - new Date(ds)) / 86400000)
    if (diff === 0) return "Today"
    if (diff === 1) return "Yesterday"
    if (diff  < 7)  return `${diff} days ago`
    return new Date(ds).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  const formatTime = (s) => `${Math.floor(s / 60)}m ${s % 60}s`

  const grouped = groupByDate(filteredAssessments)

  // ─── Loading ─────────────────────────────────────────────────────────────────
  // ─── Loading ─────────────────────────────────────────────────────────────────
  if (isLoading) return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <Navigation />
      <div className="flex-1 flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 relative">
            <div className="absolute inset-0 border-4 border-blue-200 rounded-full" />
            <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin" />
          </div>
          <p className="text-slate-600 text-lg font-medium">Loading assessments...</p>
        </div>
      </div>
    </div>
  )

  // ─── Error ───────────────────────────────────────────────────────────────────
  if (error) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <Card className="max-w-md w-full bg-white border-slate-200 shadow-sm">
        <CardContent className="p-8 text-center">
          <p className="text-red-600 font-semibold mb-2">Failed to load assessments</p>
          <p className="text-slate-500 mb-6 text-sm">{error}</p>
          <Button onClick={fetchAssessments} className="bg-blue-600 hover:bg-blue-700 text-white">
            <RefreshCw className="h-4 w-4 mr-2" /> Retry
          </Button>
        </CardContent>
      </Card>
    </div>
  )

  // ─── Main Render ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden font-sans">
      {/* Light Theme Gradient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-300/30 to-cyan-300/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-sky-300/30 to-blue-400/30 rounded-full blur-3xl" />
      </div>
      
      <Navigation />

      <Navigation />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12">

        {/* Page Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-200">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900">Assessments</h1>
            </div>
            <p className="text-slate-600 font-medium">Track your progress and review past performance</p>
          </div>
          <Button
            onClick={() => navigate("/")}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20"
          >
            <Plus className="h-4 w-4 mr-2" /> New Assessment
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Total Assessments", value: stats.total,             icon: FileText,     accent: "blue"    },
            { label: "Completed",         value: stats.completed,         icon: CheckCircle2, accent: "emerald" },
            { label: "In Progress",       value: stats.inProgress,        icon: Clock,        accent: "amber"   },
            { label: "Average Score",     value: `${stats.averageScore}%`, icon: Award,       accent: "indigo"  },
          ].map(({ label, value, icon: Icon, accent }) => (
            <Card key={label} className={`bg-white border-slate-200 hover:border-${accent}-300 hover:shadow-md transition-all duration-300 group overflow-hidden relative shadow-sm`}>
              <div className={`absolute inset-0 bg-gradient-to-br from-${accent}-50/50 to-${accent}-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 bg-${accent}-50 rounded-lg`}>
                    <Icon className={`h-5 w-5 text-${accent}-600`} />
                  </div>
                  <TrendingUp className="h-5 w-5 text-slate-400" />
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-1">{value}</div>
                <div className="text-sm text-slate-500 font-medium">{label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters + Search */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-8 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {[
                { id: "all",       label: "All",         icon: FileText     },
                { id: "completed", label: "Completed",   icon: CheckCircle2 },
                { id: "active",    label: "In Progress", icon: Clock        },
              ].map(({ id, label, icon: Icon }) => (
                <Button
                  key={id}
                  onClick={() => {
                    setActiveFilter(id)
                    setTimeout(() => {
                      listContainerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
                    }, 100)
                  }}
                  className={
                    activeFilter === id
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20 border-0"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                  }
                >
                  <Icon className="h-4 w-4 mr-2" />{label}
                </Button>
              ))}
            </div>
            <div className="relative w-full lg:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
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

        {/* Empty State */}
        {filteredAssessments.length === 0 ? (
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200">
                <FileText className="h-10 w-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No assessments found</h3>
              <p className="text-slate-500 font-medium mb-6">
                {searchQuery ? "Try adjusting your search criteria" : "Complete your first assessment to see it here"}
              </p>
              <Button
                onClick={() => navigate("/")}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20"
              >
                <Plus className="h-4 w-4 mr-2" /> Start Assessment
              </Button>
            </CardContent>
          </Card>
        ) : (
          // Scrollable grouped list container
          <div
            ref={listContainerRef}
            className="bg-slate-50/50 rounded-2xl p-2 sm:p-4 border border-slate-200 shadow-inner max-h-[680px] overflow-y-auto scroll-mt-24
              [&::-webkit-scrollbar]:w-2
              [&::-webkit-scrollbar-track]:bg-transparent
              [&::-webkit-scrollbar-thumb]:bg-slate-300
              [&::-webkit-scrollbar-thumb]:rounded-full
              hover:[&::-webkit-scrollbar-thumb]:bg-slate-400"
          >
            <div className="space-y-6 pr-1">
              {[
                { key: "recent",    label: "Recent (Last 7 Days)" },
                { key: "thisMonth", label: "This Month"           },
                { key: "older",     label: "Older"                },
              ].map(({ key, label }) =>
                grouped[key].length > 0 ? (
                  <div key={key}>
                    <button
                      onClick={() => toggleGroup(key)}
                      className="flex items-center gap-2 mb-3 text-slate-900 hover:text-blue-600 transition-colors group"
                    >
                      {expandedGroups.has(key)
                        ? <ChevronDown className="h-5 w-5" />
                        : <ChevronRight className="h-5 w-5" />
                      }
                      <h2 className="text-lg font-bold">{label}</h2>
                      <Badge className="bg-blue-100 text-blue-700 border-blue-200">{grouped[key].length}</Badge>
                    </button>

                    {expandedGroups.has(key) && (
                      <div className="space-y-4">
                        {grouped[key].map((assessment, i) => (
                          <AssessmentCard
                            key={assessment._id}
                            assessment={assessment}
                            index={i}
                            statusCfg={statusCfg}
                            diffCfg={diffCfg}
                            formatDate={formatDate}
                            formatTime={formatTime}
                            navigate={navigate}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ) : null
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

// ─── Assessment Card (light theme) ───────────────────────────────────────────
function AssessmentCard({ assessment, index, statusCfg, diffCfg, formatDate, formatTime, navigate }) {
  const sc = statusCfg(assessment.status)
  const dc = diffCfg(assessment.difficulty)

  const scoreColor =
    assessment.score >= 80 ? "text-emerald-600" :
    assessment.score >= 60 ? "text-blue-600"    : "text-amber-600"

  const barColor =
    assessment.score >= 80 ? "from-emerald-400 to-teal-500" :
    assessment.score >= 60 ? "from-blue-400 to-sky-500"     : "from-amber-400 to-orange-500"

  const getCompanyIcon = (company) => {
    switch (company) {
      case "google": return <Globe className="h-6 w-6 text-blue-500" />;
      case "microsoft": return <LayoutGrid className="h-6 w-6 text-blue-600" />;
      case "amazon": return <Package className="h-6 w-6 text-slate-700" />;
      case "apple": return <Smartphone className="h-6 w-6 text-slate-800" />;
      case "meta": return <Users className="h-6 w-6 text-blue-600" />;
      default: return <Building2 className="h-6 w-6 text-slate-500" />;
    }
  }

  return (
    <Card
      className="bg-white border-slate-200 hover:border-blue-300 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group cursor-pointer relative"
      style={{ animation: `slideUp 0.3s ease-out ${index * 0.05}s backwards` }}
      onClick={() => assessment.status === "completed" && navigate("/results")}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-sky-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      <CardContent className="p-6 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

          {/* Left */}
          <div className="flex-1">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 group-hover:bg-white group-hover:border-blue-100 transition-colors">
                {getCompanyIcon(assessment.company)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="text-xl font-bold text-slate-900 capitalize">
                    {assessment.company === "general" ? "General" : assessment.company}
                  </h3>
                  <Badge className={`${sc.bg} ${sc.text} ${sc.border}`}>{sc.label}</Badge>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 font-medium">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />{formatDate(assessment.createdAt)}
                  </span>
                  {assessment.timeSpent > 0 && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />{formatTime(assessment.timeSpent)}
                    </span>
                  )}
                  <Badge className={`${dc.bg} ${dc.text} ${dc.border} capitalize`}>{assessment.difficulty}</Badge>
                </div>
              </div>
            </div>

            {/* Score bar */}
            {assessment.status === "completed" && (
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1.5 text-sm font-medium">
                  <span className="text-slate-500">{assessment.correctAnswers}/{assessment.totalQuestions} correct</span>
                  <span className={`font-bold ${scoreColor}`}>{assessment.score}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${barColor} transition-all duration-500`}
                    style={{ width: `${assessment.score}%` }}
                  />
                </div>
              </div>
            )}

            {/* In-progress bar */}
            {assessment.status === "in-progress" && (
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1.5 text-sm font-medium">
                  <span className="text-slate-500">In Progress: {assessment.correctAnswers}/{assessment.totalQuestions}</span>
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

            {/* Badge */}
            {assessment.badge && (
              <div className="flex items-center gap-2 mt-1">
                <Trophy className="h-4 w-4 text-amber-500" />
                <span className="text-sm font-semibold text-slate-700 capitalize">
                  {assessment.badge.level} — {assessment.badge.message}
                </span>
              </div>
            )}
          </div>

          {/* Right — Actions */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {assessment.status === "completed" && (
              <Button
                variant="outline"
                className="bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200 transition-colors"
                onClick={(e) => { e.stopPropagation(); 
                  localStorage.setItem("quizResults", JSON.stringify(assessment));
                  navigate("/results");
                 }}
              >
                <Eye className="h-4 w-4 mr-2" /> View Results
              </Button>
            )}
            {assessment.status === "in-progress" && (
              <Button
                className="bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/20"
                onClick={(e) => { e.stopPropagation(); navigate("/quiz") }}
              >
                <ArrowRight className="h-4 w-4 mr-2" /> Continue
              </Button>
            )}
          </div>
        </div>
      </CardContent>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
      `}</style>
    </Card>
  )
}