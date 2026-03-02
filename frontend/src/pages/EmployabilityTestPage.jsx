import React, { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/auth-context"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Navigation } from "../components/navigation"
import {
  Building2,
  CheckCircle2,
  Briefcase,
  TrendingUp,
  Award,
  Clock,
  Target,
  Zap,
  Info,
  ArrowRight,
  Brain,
  User,
  LogOut,
  Trophy,
  Star,
  Flame,
  Code,
  Lightbulb,
  BarChart3,
  Rocket,
} from "lucide-react"

export default function EmployabilityTestPage() {
  const navigate = useNavigate()
  const { user } = useAuth() // logout handled by Navigation

  const [selectedCompany, setSelectedCompany]     = useState(null)
  const [selectedDifficulty, setSelectedDifficulty] = useState("medium")
  const [loading, setLoading]                     = useState(false)
  const [mousePosition, setMousePosition]         = useState({ x: 0, y: 0 })
  const [difficultyGauge, setDifficultyGauge]     = useState(50)

  const canvasRef      = useRef(null)
  const gaugeCanvasRef = useRef(null)

  const companies = [
    {
      id: "tcs",
      name: "TCS",
      fullName: "Tata Consultancy Services",
      color: "from-blue-600 to-indigo-700",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/30",
      icon: "💼",
      description: "Technical & Analytical Focus",
      testInfo: "30 mins | Numerical, Logical & Verbal",
      difficulty: "Medium",
      category: "Service Based",
    },
    {
      id: "wipro",
      name: "Wipro",
      fullName: "Wipro Technologies",
      color: "from-orange-600 to-red-600",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/30",
      icon: "⚡",
      description: "Problem Solving & Logic",
      testInfo: "25 mins | Aptitude & Reasoning",
      difficulty: "Medium",
      category: "Service Based",
    },
    {
      id: "google",
      name: "Google",
      fullName: "Google LLC",
      color: "from-red-600 to-pink-600",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/30",
      icon: "🔍",
      description: "Advanced Algorithms",
      testInfo: "45 mins | Coding & Analytics",
      difficulty: "Hard",
      category: "FAANG",
    },
    {
      id: "amazon",
      name: "Amazon",
      fullName: "Amazon Inc.",
      color: "from-amber-600 to-orange-600",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/30",
      icon: "📦",
      description: "Leadership Principles",
      testInfo: "40 mins | Behavioral & Technical",
      difficulty: "Hard",
      category: "FAANG",
    },
    {
      id: "infosys",
      name: "Infosys",
      fullName: "Infosys Limited",
      color: "from-cyan-600 to-blue-600",
      bgColor: "bg-cyan-500/10",
      borderColor: "border-cyan-500/30",
      icon: "🌐",
      description: "Aptitude & Reasoning",
      testInfo: "30 mins | Quantitative & Logical",
      difficulty: "Medium",
      category: "Service Based",
    },
    {
      id: "accenture",
      name: "Accenture",
      fullName: "Accenture PLC",
      color: "from-purple-600 to-indigo-600",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/30",
      icon: "🎯",
      description: "Cognitive Abilities",
      testInfo: "35 mins | Abstract & Verbal",
      difficulty: "Medium",
      category: "Consulting",
    },
  ]

  const difficultyLevels = [
    {
      id: "easy",
      label: "Easy",
      color: "from-emerald-600 to-teal-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-300",
      textColor: "text-emerald-600",
      description: "Beginner friendly questions",
      icon: "🎯",
      gaugeValue: 25,
    },
    {
      id: "medium",
      label: "Normal",
      color: "from-blue-600 to-sky-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-300",
      textColor: "text-blue-600",
      description: "Standard difficulty level",
      icon: "⚖️",
      gaugeValue: 50,
    },
    {
      id: "hard",
      label: "Hard",
      color: "from-red-600 to-orange-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-300",
      textColor: "text-red-600",
      description: "Challenging advanced questions",
      icon: "🔥",
      gaugeValue: 85,
    },
  ]

  // Mouse tracking for parallax
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth  - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Animated background particles (light blue tint)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    canvas.width  = window.innerWidth
    canvas.height = window.innerHeight

    const particles = Array.from({ length: 40 }, () => ({
      x:       Math.random() * canvas.width,
      y:       Math.random() * canvas.height,
      radius:  Math.random() * 2 + 1,
      vx:      (Math.random() - 0.5) * 0.3,
      vy:      (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.4 + 0.1,
    }))

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach((p) => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > canvas.width)  p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        // ✅ Light theme: blue particles
        ctx.fillStyle = `rgba(59, 130, 246, ${p.opacity})`
        ctx.fill()
      })
      requestAnimationFrame(animate)
    }
    animate()

    const handleResize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Draw difficulty gauge (same logic, adapted colors for light bg)
  useEffect(() => {
    const canvas = gaugeCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    const dpr = window.devicePixelRatio || 1
    canvas.width  = canvas.offsetWidth  * dpr
    canvas.height = canvas.offsetHeight * dpr
    ctx.scale(dpr, dpr)

    const width   = canvas.offsetWidth
    const height  = canvas.offsetHeight
    const centerX = width  / 2
    const centerY = height - 20
    const radius  = Math.min(width, height) / 2 - 20

    ctx.clearRect(0, 0, width, height)

    // Background segments
    const segments = [
      { start: 0,    end: 0.33, color: "#10b981" },
      { start: 0.33, end: 0.66, color: "#3b82f6" },
      { start: 0.66, end: 1,    color: "#ef4444" },
    ]
    segments.forEach(({ start, end, color }) => {
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, Math.PI + start * Math.PI, Math.PI + end * Math.PI, false)
      ctx.strokeStyle = color + "30"
      ctx.lineWidth = 15
      ctx.stroke()
    })

    // Active arc
    const targetAngle = Math.PI + (difficultyGauge / 100) * Math.PI
    let activeColor = "#10b981"
    if (difficultyGauge > 66) activeColor = "#ef4444"
    else if (difficultyGauge > 33) activeColor = "#3b82f6"
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, Math.PI, targetAngle, false)
    ctx.strokeStyle = activeColor
    ctx.lineWidth = 15
    ctx.lineCap = "round"
    ctx.stroke()

    // Needle
    const needleAngle  = Math.PI + (difficultyGauge / 100) * Math.PI
    const needleLength = radius - 10
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(centerX + Math.cos(needleAngle) * needleLength, centerY + Math.sin(needleAngle) * needleLength)
    // ✅ Light theme: dark slate needle
    ctx.strokeStyle = "#1e293b"
    ctx.lineWidth = 3
    ctx.stroke()

    // Center dot
    ctx.beginPath()
    ctx.arc(centerX, centerY, 8, 0, Math.PI * 2)
    ctx.fillStyle = "#1e293b"
    ctx.fill()

    // Labels
    ctx.fillStyle = "#64748b"
    ctx.font = "12px system-ui"
    ctx.textAlign = "center"
    ctx.fillText("easy",   centerX - radius + 30, centerY + 5)
    ctx.fillText("normal", centerX,               centerY - radius + 30)
    ctx.fillText("hard",   centerX + radius - 30, centerY + 5)
  }, [difficultyGauge])

  const handleStartEmployabilityTest = async () => {
    if (!selectedCompany) {
      alert("Please select a company first")
      return
    }
    setLoading(true)
    localStorage.setItem("selectedDifficulty", selectedDifficulty)
    localStorage.setItem("selectedCompany", selectedCompany)
    localStorage.setItem("isEmployabilityTest", "true")
    setTimeout(() => navigate("/quiz"), 500)
  }

  const selectedCompanyData = companies.find((c) => c.id === selectedCompany)

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden font-sans">
      {/* Canvas particles */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none opacity-40" style={{ zIndex: 0 }} />

      {/* ✅ Light gradient orbs with parallax */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-indigo-300/30 to-purple-300/30 rounded-full blur-3xl"
          style={{ transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`, transition: "transform 0.5s ease-out" }} />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-300/30 to-cyan-300/30 rounded-full blur-3xl"
          style={{ transform: `translate(${-mousePosition.x}px, ${-mousePosition.y}px)`, transition: "transform 0.5s ease-out" }} />
      </div>

      {/* ✅ Navigation component */}
      <Navigation />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">

        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 px-6 py-3 rounded-full mb-8">
            <Briefcase className="h-4 w-4 text-indigo-600" />
            <span className="text-sm font-semibold text-indigo-700">Career Readiness Test</span>
          </div>
          {/* ✅ Light theme title */}
          <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 mb-6">
            Employability
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600">
              Assessment
            </span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-medium">
            Test your readiness for top tech company placements with company-specific questions and detailed performance analysis
          </p>
        </div>

        {/* Info Banner */}
        <Card className="mb-12 bg-white border-indigo-200 shadow-sm overflow-hidden relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
          <CardContent className="p-8">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex-shrink-0 shadow-md">
                <Info className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-xl mb-3 text-slate-900">What is an Employability Test?</h3>
                <p className="text-slate-600 leading-relaxed">
                  Our employability assessments simulate real company placement tests. Each test is tailored to match
                  the specific requirements and question patterns of leading tech companies. You'll receive detailed
                  feedback on your performance and areas for improvement.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Company Selection */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Select Your Target Company</h2>
            <p className="text-slate-500 font-medium">Choose the organization you're preparing for</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company, index) => (
              <button
                key={company.id}
                onClick={() => setSelectedCompany(company.id)}
                className={`group relative p-8 rounded-2xl border-2 transition-all duration-500 hover:scale-105 text-left overflow-hidden ${
                  selectedCompany === company.id
                    ? "border-transparent shadow-xl scale-105"
                    : "border-slate-200 bg-white hover:border-blue-300 hover:shadow-md"
                }`}
                style={{ animation: `slideUp 0.5s ease-out ${index * 0.1}s backwards` }}
              >
                {/* Gradient overlay when selected */}
                <div className={`absolute inset-0 bg-gradient-to-br ${company.color} transition-opacity duration-300 ${
                  selectedCompany === company.id ? "opacity-100" : "opacity-0 group-hover:opacity-5"
                }`} />

                {/* Light bg when not selected */}
                {selectedCompany !== company.id && (
                  <div className="absolute inset-0 bg-white" />
                )}

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-5xl mb-3 transform group-hover:scale-110 transition-transform duration-300">
                      {company.icon}
                    </div>
                    {selectedCompany === company.id && (
                      <div className="animate-scale-in">
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
                          <CheckCircle2 className="h-5 w-5 text-indigo-600" />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className={`font-bold text-2xl mb-2 ${selectedCompany === company.id ? "text-white" : "text-slate-900"}`}>
                    {company.name}
                  </div>
                  <div className={`text-sm mb-4 ${selectedCompany === company.id ? "text-white/90" : "text-slate-500"}`}>
                    {company.fullName}
                  </div>

                  <Badge className={`mb-4 ${
                    selectedCompany === company.id
                      ? "bg-white/20 text-white border-white/30"
                      : "bg-slate-100 text-slate-600 border-slate-200"
                  }`}>
                    {company.category}
                  </Badge>

                  <div className={`mb-3 font-medium ${selectedCompany === company.id ? "text-white/90" : "text-slate-600"}`}>
                    {company.description}
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className={`h-4 w-4 ${selectedCompany === company.id ? "text-white/80" : "text-slate-400"}`} />
                    <span className={`text-sm ${selectedCompany === company.id ? "text-white/90" : "text-slate-500"}`}>
                      {company.testInfo}
                    </span>
                  </div>
                </div>

                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty Gauge Section */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Exam Level</h2>
            <p className="text-slate-500 font-medium">Adjust the difficulty to match your skill level</p>
          </div>

          {/* ✅ Light theme gauge card */}
          <Card className="bg-white border-slate-200 shadow-sm overflow-hidden relative max-w-2xl mx-auto">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-red-500" />
            <CardContent className="p-8">
              {/* Gauge Chart */}
              <div className="mb-8">
                <canvas ref={gaugeCanvasRef} className="w-full h-48 mx-auto" />
              </div>

              {/* Difficulty Buttons */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {difficultyLevels.map((level) => (
                  <button
                    key={level.id}
                    onClick={() => {
                      setSelectedDifficulty(level.id)
                      setDifficultyGauge(level.gaugeValue)
                    }}
                    className={`p-6 rounded-xl border-2 transition-all duration-300 bg-white ${
                      selectedDifficulty === level.id
                        ? `${level.bgColor} ${level.borderColor} shadow-md scale-105`
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-3">{level.icon}</div>
                      <div className={`font-bold text-lg mb-2 ${selectedDifficulty === level.id ? level.textColor : "text-slate-700"}`}>
                        {level.label}
                      </div>
                      <div className="text-xs text-slate-500 font-medium">{level.description}</div>
                    </div>
                  </button>
                ))}
              </div>

              {/* ✅ Light theme Start Button */}
              <Button
                size="lg"
                onClick={handleStartEmployabilityTest}
                disabled={!selectedCompany || loading}
                className="w-full text-lg py-8 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/20 transition-all duration-300 group disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Loading...
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Rocket className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
                    Start Test
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                )}
              </Button>

              {!selectedCompany && (
                <p className="text-sm text-center text-slate-400 mt-4 font-medium">Please select a company to continue</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Selected Company Details */}
        {selectedCompanyData && (
          <Card className="mb-12 bg-white border-slate-200 shadow-sm overflow-hidden relative max-w-4xl mx-auto">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-md">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-slate-900">Test Preview: {selectedCompanyData.fullName}</CardTitle>
                  <CardDescription className="text-slate-500 text-base">What to expect in this assessment</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { icon: Target, label: "Focus Areas", value: selectedCompanyData.description },
                  { icon: Clock,  label: "Duration",    value: "25 minutes (15 questions)"      },
                  { icon: Award,  label: "Scoring",     value: "Earn badges based on performance" },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3 p-5 bg-slate-50 rounded-xl border border-slate-200">
                    <Icon className="h-5 w-5 text-indigo-500 mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-bold text-slate-900 mb-1">{label}</div>
                      <div className="text-sm text-slate-500 font-medium">{value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* User Stats */}
        {user && user.statistics && (
          <Card className="bg-white border-slate-200 shadow-sm max-w-4xl mx-auto overflow-hidden relative">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-md">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-xl text-slate-900">Your Performance Overview</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { label: "Tests Taken",   value: user.statistics.totalAssessments },
                  { label: "Avg Score",     value: `${user.statistics.averageScore}%` },
                  { label: "Best Score",    value: `${user.statistics.bestScore}%`    },
                  { label: "Badges Earned", value:
                    (user.statistics.badgesEarned?.beginner     || 0) +
                    (user.statistics.badgesEarned?.intermediate || 0) +
                    (user.statistics.badgesEarned?.advanced     || 0)
                  },
                ].map(({ label, value }) => (
                  <div key={label} className="text-center p-5 bg-slate-50 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all duration-300">
                    <div className="text-4xl font-bold text-indigo-600 mb-2">{value}</div>
                    <div className="text-sm text-slate-500 font-medium">{label}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes scale-in {
          from { transform: scale(0); }
          to   { transform: scale(1); }
        }
        .animate-scale-in { animation: scale-in 0.3s ease-out; }
      `}</style>
    </div>
  )
}