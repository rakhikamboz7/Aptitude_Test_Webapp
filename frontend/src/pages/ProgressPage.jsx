


import React, { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Navigation } from "../components/navigation"
import {
  TrendingUp, TrendingDown, Clock, BookOpen, BarChart3,
  Trophy, Target, Brain, Sparkles, Award, Building2, Zap,
  ArrowRight, Activity, Flame, LogOut, User, CheckCircle2,
  Lock, Play, MessageSquare, ChevronRight, Bell, Settings,
  FileText, Map, LayoutDashboard, Minus,Globe, LayoutGrid, Package, Smartphone, Users,Building
} from "lucide-react"
import { useAuth } from "../contexts/auth-context"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

export default function ProgressPage() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const [progressData, setProgressData] = useState([])
  const [stats, setStats]               = useState(null)
  const [loading, setLoading]           = useState(true)
  const [badgeStats, setBadgeStats]     = useState(null)
  const [activeNav, setActiveNav]       = useState("dashboard")
  const chartRef                        = useRef(null)

  // ─── Data loading ──────────────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem("token")
        if (token) {
          const res  = await fetch(`${API_URL}/api/dashboard/summary`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          const data = await res.json()
          if (data.success) {
            const s = data.summary
            setProgressData(s.progressHistory || [])
            setBadgeStats(s.badges)
            setStats({
              totalTests:     s.totalAssessments,
              averageScore:   s.averageScore,
              bestScore:      s.bestScore,
              bestDifficulty: s.bestDifficulty,
              totalTimeSpent: s.totalTimeSpent,
              trend:          s.trend,
              topicStats:     s.topicStats   || {},
              companyStats:   s.companyStats || {},
            })
            return
          }
        }
        // localStorage fallback
        const local = JSON.parse(localStorage.getItem("progressHistory") || "[]")
        setProgressData(local)
        if (local.length > 0) {
          const avg  = Math.round(local.reduce((s, t) => s + t.score, 0) / local.length)
          const best = local.reduce((b, c) => (c.score > b.score ? c : b))
          const bdg  = { beginner: 0, intermediate: 0, advanced: 0 }
          local.forEach((t) => { if (t.badge?.level) bdg[t.badge.level]++ })
          setBadgeStats(bdg)
          setStats({ totalTests: local.length, averageScore: avg, bestScore: best.score, bestDifficulty: best.difficulty, totalTimeSpent: local.reduce((s, t) => s + (t.timeSpent || 0), 0), trend: "stable", topicStats: {}, companyStats: {} })
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // ─── Growth line chart ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!chartRef.current || progressData.length < 2) return
    const canvas = chartRef.current
    const ctx    = canvas.getContext("2d")
    const dpr    = window.devicePixelRatio || 1
    canvas.width  = canvas.offsetWidth  * dpr
    canvas.height = canvas.offsetHeight * dpr
    ctx.scale(dpr, dpr)
    const W = canvas.offsetWidth, H = canvas.offsetHeight
    const p = { t: 16, r: 16, b: 30, l: 32 }
    const cW = W - p.l - p.r, cH = H - p.t - p.b

    ctx.clearRect(0, 0, W, H)

    const pts = progressData.slice(0, 5).reverse()

    // y-axis lines
    ;[25, 50, 75, 100].forEach((v) => {
      const y = p.t + cH - (v / 100) * cH
      ctx.strokeStyle = "#e2e8f0"; ctx.lineWidth = 1
      ctx.beginPath(); ctx.moveTo(p.l, y); ctx.lineTo(W - p.r, y); ctx.stroke()
      ctx.fillStyle = "black"; ctx.font = "9px system-ui"; ctx.textAlign = "right"
      ctx.fillText(`${v}`, p.l - 4, y + 3)
    })

    const points = pts.map((t, i) => ({
      x: p.l + (i / Math.max(pts.length - 1, 1)) * cW,
      y: p.t + cH - (t.score / 100) * cH,
      score: t.score,
    }))

    // Fill
    const grd = ctx.createLinearGradient(0, p.t, 0, H - p.b)
    grd.addColorStop(0, "rgba(6,182,212,0.22)"); grd.addColorStop(1, "rgba(6,182,212,0)")
    ctx.beginPath()
    ctx.moveTo(points[0].x, H - p.b)
    points.forEach((pt) => ctx.lineTo(pt.x, pt.y))
    ctx.lineTo(points[points.length - 1].x, H - p.b)
    ctx.closePath(); ctx.fillStyle = grd; ctx.fill()

    // Line
    ctx.beginPath(); ctx.moveTo(points[0].x, points[0].y)
    points.forEach((pt) => ctx.lineTo(pt.x, pt.y))
    ctx.strokeStyle = "#06b6d4"; ctx.lineWidth = 2.5; ctx.lineJoin = "round"; ctx.stroke()

    // Dots + labels
    points.forEach((pt, i) => {
      ctx.beginPath(); ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2)
      ctx.fillStyle = "#06b6d4"; ctx.fill()
      ctx.strokeStyle = "#0f172a"; ctx.lineWidth = 2; ctx.stroke()
      ctx.fillStyle = "black"; ctx.font = "9px system-ui"; ctx.textAlign = "center"
      ctx.fillText(`Test ${i + 1}`, pt.x, H - p.b + 16)
    })
  }, [progressData])

  // ─── Helpers ───────────────────────────────────────────────────────────────
  const fmtDate    = (d) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  const scoreColor = (s) => s >= 80 ? "text-emerald-400" : s >= 60 ? "text-cyan-400" : s >= 40 ? "text-amber-400" : "text-red-400"
  const barColor   = (s) => s >= 80 ? "from-emerald-500 to-teal-500" : s >= 60 ? "from-cyan-500 to-blue-500" : "from-amber-500 to-orange-500"
  const scoreLabel = (s) => s >= 80 ? "Exceptional" : s >= 70 ? "Improved" : s >= 60 ? "Steady" : "Needs Work"
  const labelColor = (l) => l === "Exceptional" ? "text-emerald-400" : l === "Improved" ? "text-cyan-400" : l === "Steady" ? "text-blue-400" : "text-amber-400"

  const streak = Math.min(progressData.length, 6)

  // Calculate dynamic greeting
  const currentHour = new Date().getHours()
  const greeting = currentHour < 12 ? "Good morning" : currentHour < 18 ? "Good afternoon" : "Good evening"
  const firstName = user?.name?.split(" ")[0] || "Student"

  // Learning path from topic stats or fallback
  const topicEntries  = stats?.topicStats ? Object.entries(stats.topicStats).sort(([,a],[,b]) => b.accuracy - a.accuracy) : []
  const learningItems = topicEntries.length > 0
    ? topicEntries.slice(0, 4).map(([ topic, data ], i) => ({
        label:   topic.charAt(0).toUpperCase() + topic.slice(1).replace(/([A-Z])/g, " $1") + " Mastery",
        detail:  i === 0 ? `Accuracy: ${data.accuracy}%` : i === 1 ? null : `Unlocks after previous`,
        time:    `${data.total} Qs`,
        status:  i === 0 ? "completed" : i === 1 ? "active" : "locked",
        progress: data.accuracy,
      }))
    : [
        { label: "Numerical Reasoning",  detail: "Completed on last session", time: "45 mins", status: "completed", progress: 100 },
        { label: "Logical Thinking",      detail: null,                         time: "1.2 hrs",  status: "active",    progress: 65  },
        { label: "Verbal Comprehension",  detail: "Unlocks after Logical",      time: "2 hrs",    status: "locked",    progress: 0   },
        { label: "Data Interpretation",   detail: "Unlocks after Logical",      time: "30 mins",  status: "locked",    progress: 0   },
      ]

  // ─── Loading / Empty ───────────────────────────────────────────────────────
  // ─── Loading / Empty ───────────────────────────────────────────────────────
  if (loading) return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <Navigation />
      <div className="flex-1 flex items-center justify-center pt-20">
        <div className="w-16 h-16 relative">
          <div className="absolute inset-0 border-4 border-blue-200 rounded-full" />
          <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin" />
        </div>
      </div>
    </div>
  )

  if (!progressData.length) return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navigation />
      <div className="flex-1 flex items-center justify-center px-4 pt-20">
        <Card className="max-w-md w-full text-center bg-white border-slate-200 shadow-xl rounded-2xl">
          <CardHeader>
            <div className="p-5 bg-blue-50 rounded-full w-fit mx-auto mb-3 border border-blue-100">
              <BarChart3 className="h-12 w-12 text-blue-600" />
            </div>
            <CardTitle className="text-2xl text-slate-900">Start Your Journey</CardTitle>
            <CardDescription className="text-slate-500 mt-1 font-medium">Complete your first assessment to unlock analytics</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/auth")} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md rounded-xl" size="lg">
              <Brain className="h-4 w-4 mr-2" /> Take First Assessment
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
  // --- ADD THIS RIGHT BEFORE THE RETURN STATEMENT ---
  const currentScore = stats?.averageScore || 0;
  
  // 1. Calculate dynamic greeting
  let motivationalGreeting = "Every step counts";
  if (currentScore >= 80) motivationalGreeting = "Outstanding work";
  else if (currentScore >= 60) motivationalGreeting = "Great progress";
  else if (currentScore >= 40) motivationalGreeting = "Almost there";

  // 2. Fix the Top Percentage Math
  const topPercentage = Math.max(1, 100 - currentScore);
  // ------------------------------------------------

  // ─── Main Render ───────────────────────────────────────────────────────────
  return (
    
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <Navigation />
      <div className="flex flex-1 pt-20">

      {/* ═══ SIDEBAR ══════════════════════════════════════════════════════════ */}
      <aside className="hidden lg:flex flex-col w-52 bg-white border-r border-slate-200 fixed top-20 bottom-0 left-0 z-20">
        <div className="px-5 py-4 border-b border-slate-800/60">
          <p className="text-[11px] font-semibold text-slate-700 uppercase tracking-widest">Student Portal</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {[
            { id: "dashboard", icon: LayoutDashboard, label: "Dashboard",    path: "/progress"    },
            { id: "tests",     icon: FileText,         label: "My Tests",     path: "/assessments" }
          ].map(({ id, label, path }) => (
            <button
              key={id}
              onClick={() => { setActiveNav(id); navigate(path) }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeNav === id ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:text-blue-600 hover:bg-slate-50"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
        <div className="px-3 pb-5 border-t border-slate-800/50 pt-3">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>

      {/* ═══ MAIN CONTENT ═════════════════════════════════════════════════════ */}
      <div className="flex-1 lg:ml-52 flex flex-col min-h-screen">

        

        {/* Page content */}
        <main className="flex-1 px-6 py-7 w-full max-w-7xl mx-auto">

          {/* Page heading + streak */}
          <div className="flex items-start justify-between mb-7">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{greeting}, {firstName}!</h1>
              <p className="text-slate-500 text-sm mt-0.5">Welcome to your dashboard. Track your growth and master your skills.</p>
            </div>
            {streak > 0 && (
              <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500">
                Current Streak:
                <span className="flex items-center gap-1 px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-slate-600 font-semibold text-xs">
                  <Flame className="h-3 w-3 text-amber-900" /> {streak} Days
                </span>
              </div>
            )}
          </div>

          {/* ── Row 1: Score Hero + Growth Chart ───────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 mb-5">

            {/* Hero readiness card */}
            <Card className="lg:col-span-3 bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden relative">

              
              <div className="absolute right-0 top-0 w-56 h-56 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
              <CardContent className="relative z-10 p-6">
                <p className="text-[11px] font-bold text-cyan-700 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <TrendingUp className="h-3 w-3" />
                  {stats?.trend === "improving" ? "+Progress from last week" : "Performance overview"}
                </p>
                <div className="flex items-center gap-5">
                  {/* SVG Gauge */}
                  <div className="flex-shrink-0">
                    <svg width="108" height="108" viewBox="0 0 108 108">
                      <circle cx="54" cy="54" r="43" fill="none" stroke="#f1f5f9" strokeWidth="10" />
                      <circle
                        cx="54" cy="54" r="43"
                        fill="none"
                        stroke="url(#cg)"
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={`${(stats?.averageScore || 0) * 2.703} 270.3`}
                        strokeDashoffset="67.6"
                        transform="rotate(-90 54 54)"
                      />
                      <defs>
                        <linearGradient id="cg" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#06b6d4" />
                          <stop offset="100%" stopColor="#2b75f5" />
                        </linearGradient>
                      </defs>
                      <text x="54" y="50" textAnchor="middle" fill="#0f172a" fontSize="19" fontWeight="bold">{stats?.averageScore || 0}%</text>
                      <text x="54" y="64" textAnchor="middle" fill="#64748b" fontSize="8.5" fontWeight="600">READY</text>
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-bold text-slate-900 mb-1.5">
                      {motivationalGreeting},{" "}
                      <span className="text-cyan-500">{user?.name?.split(" ")[0] || "Student"}!</span>
                    </h2>
                    <p className="text-slate-600 text-sm leading-relaxed mb-4">
                      Your readiness score is in the{" "}
                      <strong className="text-slate-900">top {topPercentage}%</strong>{" "}
                      for Software Engineering roles.
                      {topicEntries.length > 0 && (
                        <> Focus on <strong className="text-blue-700 capitalize">
                          "{topicEntries[topicEntries.length - 1]?.[0]}"
                        </strong> to hit the next milestone.</>
                      )}
                    </p>
                    <Button
  onClick={() => navigate("/assessments")}
  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-4 py-2 h-auto rounded-lg shadow-sm"
>
  View Skill Breakdown
</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Growth Momentum */}
            <Card className="lg:col-span-2 bg-white/[0.03] border-slate-800/50">
              <CardHeader className="px-5 pt-5 pb-2">
                <CardTitle className="text-sm font-semibold text-slate-900">Growth Momentum</CardTitle>
                <CardDescription className="text-xs text-slate-700">
                  Performance over your last {Math.min(progressData.length, 5)} assessments
                </CardDescription>
              </CardHeader>
              <CardContent className="px-3 pb-4">
                <canvas ref={chartRef} className="w-full" style={{ height: "160px" }} />
              </CardContent>
            </Card>
          </div>

          {/* ── Row 2: Learning Path + Action Cards ────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 mb-5">

            {/* Learning Path */}
            <Card className="lg:col-span-3 bg-white/[0.03] border-slate-800/50">
              <CardHeader className="px-6 pt-5 pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-sm font-semibold text-slate-900">Your Learning Path</CardTitle>
                    <CardDescription className="text-xs text-slate-500 mt-0.5">Next missions tailored to your skill gaps</CardDescription>
                  </div>
                  <button
  onClick={() => navigate("/gemini-report")}
  className="text-blue-600 hover:text-blue-800 text-xs font-bold flex items-center gap-0.5 transition-colors"
>
  View Full Map <ChevronRight className="h-3.5 w-3.5" />
</button>
                </div>
              </CardHeader>
              <CardContent className="px-6 pb-5">
                <div className="space-y-0 divide-y divide-slate-800/40">
                  {learningItems.map((item) => (
                    <div key={item.label} className="flex items-center justify-between py-3.5">
                      <div className="flex items-center gap-3">
                        {item.status === "completed" ? (
                          <div className="w-7 h-7 rounded-full border-2 border-slate-700 flex items-center justify-center flex-shrink-0">
                            <CheckCircle2 className="h-3.5 w-3.5 text-slate-500" />
                          </div>
                        ) : item.status === "active" ? (
                          <div className="w-7 h-7 rounded-full border-2 border-slate-700 flex items-center justify-center flex-shrink-0 ">
                            <Zap className="h-3.5 w-3.5 text-slate-900" />
                          </div>
                        ) : (
                          <div className="w-7 h-7 rounded-full border-2 border-slate-800 flex items-center justify-center flex-shrink-0">
                            <Lock className="h-3 w-3 text-slate-700" />
                          </div>
                        )}
                        <div>
                          <p className={`text-sm font-semibold ${item.status === "locked" ? "text-slate-600" : "text-slate-900"}`}>
                            {item.label}
                          </p>
                          {item.detail && (
                            <p className="text-xs text-slate-500 mt-0.5">{item.detail}</p>
                          )}
                          {item.status === "active" && (
                            <div className="mt-1.5 w-36 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" style={{ width: `${item.progress}%` }} />
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className="text-xs text-slate-600">{item.time}</span>
                        {item.status === "active" && (
                          <Button
  size="sm"
  onClick={() => navigate("/")}
  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-8 px-4 rounded-lg shadow-sm"
>
  Resume Mission
</Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Right action cards */}
            <div className="lg:col-span-2 flex flex-col gap-4">

              {/* Resume Test */}
              
                <Card className="bg-white border border-slate-200 shadow-sm mb-5 rounded-2xl">
                <CardContent className="p-5">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/10 flex items-center justify-center mb-3">
                    <Play className="h-4 w-4 text-blue-600" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1">Resume Test</h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">
                    Continue your latest assessment from where you left off.
                  </p>
                  <Button
  onClick={() => navigate("/assessments")}
  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm h-10 rounded-xl flex items-center justify-center gap-2 shadow-sm"
>
  Start Now <ArrowRight className="h-4 w-4" />
</Button>
                </CardContent>
              </Card>

              
            </div>
          </div>

          {/* ── Row 3: Recent Test History (table style) ────────────────── */}
          <Card className="bg-white border border-slate-200 shadow-sm mb-5 rounded-2xl">
            <CardHeader className="px-6 pt-5 pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-slate-900">Recent Test History</CardTitle>
                <button
                  onClick={() => navigate("/assessments")}
                  className="text-blue-600  hover:text-cyan-300 text-xs font-bold transition-colors"
                >
                  View All Results
                </button>
              </div>
            </CardHeader>
            <CardContent className="px-6 pb-5">
              {/* Header row */}
              <div className="grid gap-4 pb-2.5 border-b border-slate-800/50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider"
                style={{ gridTemplateColumns: "2fr 1fr 0.7fr 0.8fr 1.2fr" }}
              >
                <span>Test Category</span>
                <span>Date Taken</span>
                <span>Score</span>
                <span>Status</span>
                <span className="text-right">Action</span>
              </div>

              {/* Data rows */}
              <div className="divide-y divide-slate-800/30">
                {progressData.slice(0, 5).map((test, i) => {
                  const status = scoreLabel(test.score)
                  return (
                    <div
                      key={i}
                      className="grid gap-4 py-3.5 items-center hover:bg-slate-100/20 -mx-2 px-2 rounded-lg transition-colors group"
                      style={{
                        gridTemplateColumns: "2fr 1fr 0.7fr 0.8fr 1.2fr",
                        animation: `slideUp 0.4s ease-out ${i * 0.06}s backwards`,
                      }}
                    >
                      {/* Category */}
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Brain className="h-4 w-4 text-cyan-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900 capitalize leading-tight">
                            {test.company && test.company !== "general" ? `${test.company}: ` : "Aptitude: "}
                            {test.difficulty}
                          </p>
                          <p className="text-xs text-slate-600 capitalize">{test.difficulty} level</p>
                        </div>
                      </div>
                      <span className="text-sm text-slate-500">{fmtDate(test.date || test.createdAt)}</span>
                      <span className={`text-sm font-bold ${scoreColor(test.score)}`}>{test.score}%</span>
                      <span className={`text-sm font-semibold ${labelColor(status)}`}>{status}</span>
                      <div className="text-right">
                        <button
                          onClick={() => navigate("/results")}
                          className="text-xs font-bold text-slate-900 hover:text-cyan-400 transition-colors"
                        >
                          Detailed Feedback
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* ── Row 4: Topic + Company (if data exists) ─────────────────── */}
          {stats && (Object.keys(stats.topicStats).length > 0 || Object.keys(stats.companyStats).length > 0) && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">

              {Object.keys(stats.topicStats).length > 0 && (
                <Card className="bg-white border border-slate-200 shadow-sm mb-5 rounded-2xl">
                  <CardHeader className="px-5 pt-5 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 ">
                        <BookOpen className="h-4 w-4 text-indigo-700" />
                      </div>
                      <div>
                        <CardTitle className="text-sm font-semibold text-slate-900">Topic Mastery</CardTitle>
                        <CardDescription className="text-xs text-slate-500">Skills breakdown by area</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="px-5 pb-5 space-y-3.5">
                    {Object.entries(stats.topicStats).sort(([,a],[,b]) => b.accuracy - a.accuracy).slice(0, 5).map(([topic, data]) => (
                      <div key={topic}>
                        <div className="flex justify-between mb-1">
                          <span className="text-xs font-semibold text-slate-900 capitalize">{topic}</span>
                          <span className={`text-xs font-bold ${scoreColor(data.accuracy)}`}>{data.accuracy}%</span>
                        </div>
                        <div className="w-full bg-slate-100/60 rounded-full h-1.5 overflow-hidden">
                          <div className={`h-full rounded-full bg-gradient-to-r ${barColor(data.accuracy)}`} style={{ width: `${data.accuracy}%` }} />
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5">{data.correct}/{data.total} correct</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {Object.keys(stats.companyStats).length > 0 && (
                <Card className="bg-white border border-slate-200 shadow-sm mb-5 rounded-2xl">
                  <CardHeader className="px-5 pt-5 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 ">
                        <Building2 className="h-5 w-5 text-indigo-800" />
                      </div>
                      <div>
                        <CardTitle className="text-sm font-semibold text-slate-900">Company Performance</CardTitle>
                        <CardDescription className="text-xs text-slate-500">Target-specific scores</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="px-5 pb-5 space-y-3.5">
                    {Object.entries(stats.companyStats).sort(([,a],[,b]) => b.avgScore - a.avgScore).map(([company, data]) => {
                      const getCompanyIcon = (comp) => {
                        switch (comp) {
                          case "google": return <Globe className="h-4 w-4 text-blue-500" />;
                          case "microsoft": return <LayoutGrid className="h-4 w-4 text-blue-600" />;
                          case "amazon": return <Package className="h-4 w-4 text-slate-700" />;
                          case "apple": return <Smartphone className="h-4 w-4 text-slate-800" />;
                          case "meta": return <Users className="h-4 w-4 text-blue-600" />;
                          default: return <Building className="h-4 w-4 text-slate-500" />;
                        }
                      };
                      
                      return (
                        <div key={company}>
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              {getCompanyIcon(company)}
                              <span className="text-xs font-semibold text-slate-900 capitalize">{company === "general" ? "General" : company}</span>
                              <span className="text-[11px] text-slate-600">{data.tests} tests</span>
                            </div>
                            <span className={`text-xs font-bold ${scoreColor(data.avgScore)}`}>{data.avgScore}%</span>
                          </div>
                          <div className="w-full bg-slate-100/60 rounded-full h-1.5 overflow-hidden">
                            <div className={`h-full rounded-full bg-gradient-to-r ${barColor(data.avgScore)}`} style={{ width: `${data.avgScore}%` }} />
                          </div>
                        </div>
                      )
                    })}
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Badges row */}
          {badgeStats && (
            <Card className="bg-white border border-slate-200 shadow-sm mb-5 rounded-2xl">
              <CardContent className="px-6 py-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Trophy className="h-4.5 w-4.5 text-amber-400" />
                    <span className="text-sm font-semibold text-slate-900">Achievement Collection</span>
                  </div>
                  <div className="flex items-center gap-10">
                    {[
                      { 
                        icon: <Award className="h-6 w-6 text-amber-600" />, 
                        bg: "bg-amber-50 border-amber-100", 
                        count: badgeStats.beginner,     
                        label: "Beginner"     
                      },
                      { 
                        icon: <Award className="h-6 w-6 text-slate-600" />, 
                        bg: "bg-slate-50 border-slate-200", 
                        count: badgeStats.intermediate, 
                        label: "Intermediate" 
                      },
                      { 
                        icon: <Trophy className="h-6 w-6 text-yellow-600" />, 
                        bg: "bg-yellow-50 border-yellow-200", 
                        count: badgeStats.advanced,     
                        label: "Advanced"     
                      },
                    ].map(({ icon, bg, count, label }) => (
                      <div key={label} className="text-center flex flex-col items-center">
                        <div className={`w-12 h-12 rounded-full border flex items-center justify-center mb-2 shadow-sm ${bg}`}>
                          {icon}
                        </div>
                        <div className="text-lg font-bold text-slate-900 leading-none mb-1">{count}</div>
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

        </main>

        {/* Footer */}
        <footer className="border-t border-slate-800/40 px-6 py-4 flex items-center justify-between text-xs text-slate-600">
          <span>© 2024 AptitudeAI. Empowering talent through intelligence.</span>
          <div className="flex items-center gap-4">
            {["Privacy", "Terms", "Support"].map((l) => (
              <button key={l} className="hover:text-slate-500 transition-colors">{l}</button>
            ))}
          </div>
        </footer>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
      `}</style>
    </div>
    </div>
  )
}