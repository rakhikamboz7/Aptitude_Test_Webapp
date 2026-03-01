import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import {
  CheckCircle2, Clock, FileText, Plus, Search,
  TrendingUp, Award, ChevronDown, ChevronRight,
  ArrowRight, Trophy, Eye, Calendar, RefreshCw,
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

  // ─── Fetch from API ─────────────────────────────────────────────────────────
  const fetchAssessments = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const token = localStorage.getItem("token")
      if (!token) { navigate("/auth"); return }

      // Fetch completed assessments (default) — pass status=all to get everything
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
        score:          a.score          ?? 0,
        correctAnswers: a.correctAnswersCount ?? 0,
        totalQuestions: a.totalQuestions  ?? 15,
        timeSpent:      a.totalTime       ?? 0,
        status:         a.status,
        createdAt:      a.createdAt,
        badge: a.badge?.level ? {
          level:   a.badge.level,
          color:   a.badge.color,
          message: a.badge.level === "advanced" ? "Outstanding performance!"
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

  // ─── Filter ─────────────────────────────────────────────────────────────────
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
    const now   = Date.now()
    const day   = 24 * 60 * 60 * 1000
    const g     = { recent: [], thisMonth: [], older: [] }
    list.forEach((a) => {
      const diff = now - new Date(a.createdAt).getTime()
      if (diff <  7 * day)  g.recent.push(a)
      else if (diff < 30 * day) g.thisMonth.push(a)
      else                  g.older.push(a)
    })
    return g
  }

  const toggleGroup = (name) => {
    const next = new Set(expandedGroups)
    next.has(name) ? next.delete(name) : next.add(name)
    setExpandedGroups(next)
  }

  // ─── Config helpers ──────────────────────────────────────────────────────────
  const statusCfg = (s) => ({
    completed:    { label: "Completed",   bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/30" },
    "in-progress":{ label: "In Progress", bg: "bg-amber-500/10",   text: "text-amber-400",   border: "border-amber-500/30"   },
    draft:        { label: "Draft",       bg: "bg-slate-500/10",   text: "text-slate-400",   border: "border-slate-500/30"   },
  }[s] ?? { label: s, bg: "bg-slate-500/10", text: "text-slate-400", border: "border-slate-500/30" })

  const diffCfg = (d) => ({
    easy:   { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/30" },
    medium: { bg: "bg-blue-500/10",    text: "text-blue-400",    border: "border-blue-500/30"    },
    hard:   { bg: "bg-indigo-500/10",  text: "text-indigo-400",  border: "border-indigo-500/30"  },
  }[d] ?? { bg: "bg-slate-500/10", text: "text-slate-400", border: "border-slate-500/30" })

  const formatDate = (ds) => {
    const diff = Math.floor((Date.now() - new Date(ds)) / 86400000)
    if (diff === 0) return "Today"
    if (diff === 1) return "Yesterday"
    if (diff  <  7) return `${diff} days ago`
    return new Date(ds).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  const formatTime = (s) => `${Math.floor(s / 60)}m ${s % 60}s`

  const grouped = groupByDate(filteredAssessments)

  // ─── Loading ─────────────────────────────────────────────────────────────────
  if (isLoading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 relative">
          <div className="absolute inset-0 border-4 border-blue-600/30 rounded-full" />
          <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin" />
        </div>
        <p className="text-slate-300 text-lg">Loading assessments...</p>
      </div>
    </div>
  )

  // ─── Error ────────────────────────────────────────────────────────────────────
  if (error) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <Card className="max-w-md w-full bg-slate-900/50 border-slate-800/50">
        <CardContent className="p-8 text-center">
          <p className="text-red-400 font-semibold mb-2">Failed to load assessments</p>
          <p className="text-slate-400 mb-6 text-sm">{error}</p>
          <Button onClick={fetchAssessments} className="bg-gradient-to-r from-blue-600 to-sky-600 text-white">
            <RefreshCw className="h-4 w-4 mr-2" /> Retry
          </Button>
        </CardContent>
      </Card>
    </div>
  )

  // ─── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-sky-600/20 to-blue-700/20 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-slate-800/50 bg-slate-900/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2.5 bg-gradient-to-br from-blue-600 to-sky-500 rounded-xl shadow-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white">Assessments</h1>
            </div>
            <p className="text-slate-400 ml-14">Track your progress and review past performance</p>
          </div>
          <Button
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-white shadow-lg shadow-blue-500/30"
          >
            <Plus className="h-4 w-4 mr-2" /> New Assessment
          </Button>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Total",        value: stats.total,             icon: FileText,     from: "from-blue-600",    to: "to-sky-600"    },
            { label: "Completed",    value: stats.completed,         icon: CheckCircle2, from: "from-emerald-600", to: "to-teal-600"   },
            { label: "In Progress",  value: stats.inProgress,        icon: Clock,        from: "from-amber-600",   to: "to-orange-600" },
            { label: "Avg Score",    value: `${stats.averageScore}%`, icon: Award,       from: "from-indigo-600",  to: "to-blue-700"   },
          ].map(({ label, value, icon: Icon, from, to }) => {
            const IconComponent = Icon
            return (
            <Card key={label} className="bg-slate-900/50 backdrop-blur-xl border-slate-800/50 hover:border-slate-700/50 transition-all duration-300 group overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-sky-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2.5 bg-gradient-to-br ${from} ${to} rounded-lg`}>
                    <IconComponent className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-1">{value}</div>
                <div className="text-sm text-slate-400">{label}</div>
              </CardContent>
            </Card>
            )
          })}
        </div>

        {/* Filters */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {[
                { id: "all",       label: "All",         icon: FileText     },
                { id: "completed", label: "Completed",   icon: CheckCircle2 },
                { id: "active",    label: "In Progress", icon: Clock        },
              ].map(({ id, label, icon: Icon }) => {
                const IconComponent = Icon
                return (
                <Button
                  key={id}
                  onClick={() => setActiveFilter(id)}
                  className={
                    activeFilter === id
                      ? "bg-gradient-to-r from-blue-600 to-sky-600 text-white shadow-lg border-0"
                      : "bg-slate-800/50 text-slate-300 border border-slate-700/50 hover:bg-slate-700/50 hover:text-white"
                  }
                >
                  <IconComponent className="h-4 w-4 mr-2" />{label}
                </Button>
                )
              })}
            </div>
            <div className="relative w-full lg:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by company or difficulty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              />
            </div>
          </div>
        </div>

        {/* List */}
        {filteredAssessments.length === 0 ? (
          <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800/50">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-slate-800/50 rounded-full flex items-center justify-center">
                <FileText className="h-10 w-10 text-slate-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No assessments found</h3>
              <p className="text-slate-400 mb-6">
                {searchQuery ? "Try adjusting your search" : "Complete your first assessment to see it here"}
              </p>
              <Button
                onClick={() => navigate("/")}
                className="bg-gradient-to-r from-blue-600 to-sky-600 text-white shadow-lg shadow-blue-500/30"
              >
                <Plus className="h-4 w-4 mr-2" /> Start Assessment
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {[
              { key: "recent",    label: "Recent (Last 7 Days)" },
              { key: "thisMonth", label: "This Month"           },
              { key: "older",     label: "Older"                },
            ].map(({ key, label }) =>
              grouped[key].length > 0 ? (
                <div key={key}>
                  <button
                    onClick={() => toggleGroup(key)}
                    className="flex items-center gap-2 mb-4 text-white hover:text-sky-400 transition-colors"
                  >
                    {expandedGroups.has(key) ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                    <h2 className="text-xl font-bold">{label}</h2>
                    <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">{grouped[key].length}</Badge>
                  </button>
                  {expandedGroups.has(key) && (
                    <div className="grid grid-cols-1 gap-4">
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
        )}
      </main>
    </div>
  )
}

// ─── Card Component ───────────────────────────────────────────────────────────
function AssessmentCard({ assessment, index, statusCfg, diffCfg, formatDate, formatTime, navigate }) {
  const sc = statusCfg(assessment.status)
  const dc = diffCfg(assessment.difficulty)

  const scoreColor =
    assessment.score >= 80 ? "text-emerald-400" :
    assessment.score >= 60 ? "text-blue-400"    : "text-amber-400"

  const barColor =
    assessment.score >= 80 ? "from-emerald-500 to-teal-500" :
    assessment.score >= 60 ? "from-blue-500 to-sky-500"     : "from-amber-500 to-orange-500"

  const emoji =
    assessment.company === "google"    ? "🔍" :
    assessment.company === "microsoft" ? "🪟" :
    assessment.company === "amazon"    ? "📦" :
    assessment.company === "apple"     ? "🍎" :
    assessment.company === "meta"      ? "👥" : "🏢"

  return (
    <Card
      className="bg-slate-900/50 backdrop-blur-xl border-slate-800/50 hover:border-slate-700/50 transition-all duration-300 overflow-hidden group relative cursor-pointer"
      style={{ animation: `slideUp 0.4s ease-out ${index * 0.05}s backwards` }}
      onClick={() => assessment.status === "completed" && navigate("/results")}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-sky-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />

      <CardContent className="p-6 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

          {/* Left */}
          <div className="flex-1">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-slate-800/50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                {emoji}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="text-xl font-bold text-white capitalize">
                    {assessment.company === "general" ? "General" : assessment.company}
                  </h3>
                  <Badge className={`${sc.bg} ${sc.text} ${sc.border}`}>{sc.label}</Badge>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
                  <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{formatDate(assessment.createdAt)}</span>
                  {assessment.timeSpent > 0 && (
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{formatTime(assessment.timeSpent)}</span>
                  )}
                  <Badge className={`${dc.bg} ${dc.text} ${dc.border} capitalize`}>{assessment.difficulty}</Badge>
                </div>
              </div>
            </div>

            {/* Score bar */}
            {assessment.status === "completed" && (
              <div className="mb-3">
                <div className="flex justify-between mb-1.5 text-sm">
                  <span className="text-slate-400">{assessment.correctAnswers}/{assessment.totalQuestions} correct</span>
                  <span className={`font-bold ${scoreColor}`}>{assessment.score}%</span>
                </div>
                <div className="w-full bg-slate-800/50 rounded-full h-2 overflow-hidden border border-slate-700/50">
                  <div className={`h-full rounded-full bg-gradient-to-r ${barColor}`} style={{ width: `${assessment.score}%` }} />
                </div>
              </div>
            )}

            {/* Badge */}
            {assessment.badge && (
              <div className="flex items-center gap-2 mt-1">
                <Trophy className="h-4 w-4 text-amber-400" />
                <span className="text-sm text-slate-300 capitalize">{assessment.badge.level} — {assessment.badge.message}</span>
              </div>
            )}
          </div>

          {/* Right — Actions */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {assessment.status === "completed" && (
              <Button
                variant="outline"
                className="bg-slate-800/50 text-white border-slate-700/50 hover:bg-slate-700/50"
                onClick={(e) => { e.stopPropagation(); navigate("/results") }}
              >
                <Eye className="h-4 w-4 mr-2" /> View Results
              </Button>
            )}
            {assessment.status === "in-progress" && (
              <Button
                className="bg-gradient-to-r from-amber-600 to-orange-600 text-white"
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