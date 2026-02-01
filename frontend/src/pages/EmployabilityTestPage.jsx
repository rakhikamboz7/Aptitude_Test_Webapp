import React, { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/auth-context"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
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
  const { user, logout } = useAuth()
  const [selectedCompany, setSelectedCompany] = useState(null)
  const [selectedDifficulty, setSelectedDifficulty] = useState("medium")
  const [loading, setLoading] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [difficultyGauge, setDifficultyGauge] = useState(50)
  const canvasRef = useRef(null)
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
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/30",
      textColor: "text-emerald-400",
      description: "Beginner friendly questions",
      icon: "🎯",
      gaugeValue: 25,
    },
    {
      id: "medium",
      label: "Normal",
      color: "from-blue-600 to-sky-600",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/30",
      textColor: "text-blue-400",
      description: "Standard difficulty level",
      icon: "⚖️",
      gaugeValue: 50,
    },
    {
      id: "hard",
      label: "Hard",
      color: "from-red-600 to-orange-600",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/30",
      textColor: "text-red-400",
      description: "Challenging advanced questions",
      icon: "🔥",
      gaugeValue: 85,
    },
  ]

  // Mouse tracking
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

  // Animated background particles
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles = []
    const particleCount = 40

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.5 + 0.2,
      })
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle) => {
        particle.x += particle.vx
        particle.y += particle.vy

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(99, 102, 241, ${particle.opacity})`
        ctx.fill()
      })

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Draw difficulty gauge
  useEffect(() => {
    const canvas = gaugeCanvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    const dpr = window.devicePixelRatio || 1
    
    canvas.width = canvas.offsetWidth * dpr
    canvas.height = canvas.offsetHeight * dpr
    ctx.scale(dpr, dpr)

    const width = canvas.offsetWidth
    const height = canvas.offsetHeight
    const centerX = width / 2
    const centerY = height - 20
    const radius = Math.min(width, height) / 2 - 20

    ctx.clearRect(0, 0, width, height)

    // Background arc segments
    const segments = [
      { start: 0, end: 0.33, color: "#10b981" }, // Green (easy)
      { start: 0.33, end: 0.66, color: "#3b82f6" }, // Blue (normal)
      { start: 0.66, end: 1, color: "#ef4444" }, // Red (hard)
    ]

    segments.forEach((segment) => {
      const startAngle = Math.PI + segment.start * Math.PI
      const endAngle = Math.PI + segment.end * Math.PI

      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, startAngle, endAngle, false)
      ctx.strokeStyle = segment.color + "30"
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
    const needleAngle = Math.PI + (difficultyGauge / 100) * Math.PI
    const needleLength = radius - 10
    
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(
      centerX + Math.cos(needleAngle) * needleLength,
      centerY + Math.sin(needleAngle) * needleLength
    )
    ctx.strokeStyle = "#1e293b"
    ctx.lineWidth = 3
    ctx.stroke()

    // Center dot
    ctx.beginPath()
    ctx.arc(centerX, centerY, 8, 0, Math.PI * 2)
    ctx.fillStyle = "#1e293b"
    ctx.fill()

    // Labels
    ctx.fillStyle = "#94a3b8"
    ctx.font = "12px system-ui"
    ctx.textAlign = "center"
    ctx.fillText("easy", centerX - radius + 30, centerY + 5)
    ctx.fillText("normal", centerX, centerY - radius + 30)
    ctx.fillText("hard", centerX + radius - 30, centerY + 5)
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
    
    setTimeout(() => {
      navigate("/quiz")
    }, 500)
  }

  const selectedCompanyData = companies.find((c) => c.id === selectedCompany)

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Animated Canvas Background */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none opacity-20"
        style={{ zIndex: 0 }}
      />

      {/* Gradient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
        <div
          className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 rounded-full blur-3xl"
          style={{
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
            transition: "transform 0.5s ease-out",
          }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-full blur-3xl"
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
              <div className="p-2 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-xl">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-white">
                  Aptitude<span className="text-indigo-400">AI</span>
                </span>
                <p className="text-xs text-slate-400 -mt-1">Employability Assessment</p>
              </div>
            </div>
            {user && (
              <div className="flex items-center gap-3">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-white">{user.profile?.firstName || user.username}</p>
                  <div className="flex items-center justify-end gap-1 text-xs text-slate-400">
                    <Trophy className="h-3 w-3 text-amber-500" />
                    {user.statistics?.totalAssessments || 0} completed
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
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 backdrop-blur-sm border border-indigo-500/20 px-6 py-3 rounded-full mb-8">
            <Briefcase className="h-4 w-4 text-indigo-400" />
            <span className="text-sm font-medium text-slate-200">Career Readiness Test</span>
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6">
            Employability
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              Assessment
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Test your readiness for top tech company placements with company-specific questions and detailed performance analysis
          </p>
        </div>

        {/* Info Banner */}
        <Card className="mb-12 bg-gradient-to-r from-indigo-900/20 to-purple-900/20 backdrop-blur-xl border-indigo-500/30 overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/5 to-purple-600/5" />
          <CardContent className="p-8 relative z-10">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex-shrink-0">
                <Info className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-xl mb-3 text-white">What is an Employability Test?</h3>
                <p className="text-slate-300 leading-relaxed">
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
            <h2 className="text-3xl font-bold text-white mb-3">Select Your Target Company</h2>
            <p className="text-slate-400">Choose the organization you're preparing for</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company, index) => (
              <button
                key={company.id}
                onClick={() => setSelectedCompany(company.id)}
                className={`group relative p-8 rounded-2xl border-2 transition-all duration-500 hover:scale-105 text-left overflow-hidden ${
                  selectedCompany === company.id
                    ? "border-transparent shadow-2xl scale-105"
                    : "border-slate-700/50 hover:border-slate-600/50"
                }`}
                style={{
                  animation: `slideUp 0.5s ease-out ${index * 0.1}s backwards`,
                }}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${company.color} transition-opacity duration-300 ${
                    selectedCompany === company.id ? "opacity-100" : "opacity-0 group-hover:opacity-10"
                  }`}
                />

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-5xl mb-3 transform group-hover:scale-110 transition-transform duration-300">
                      {company.icon}
                    </div>
                    {selectedCompany === company.id && (
                      <div className="animate-scale-in">
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                          <CheckCircle2 className="h-5 w-5 text-indigo-600" />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className={`font-bold text-2xl mb-2 ${selectedCompany === company.id ? "text-white" : "text-slate-200"}`}>
                    {company.name}
                  </div>
                  <div className={`text-sm mb-4 ${selectedCompany === company.id ? "text-white/90" : "text-slate-400"}`}>
                    {company.fullName}
                  </div>

                  <Badge
                    className={`mb-4 ${
                      selectedCompany === company.id
                        ? "bg-white/20 text-white border-white/30"
                        : "bg-slate-800 text-slate-400 border-slate-700"
                    }`}
                  >
                    {company.category}
                  </Badge>

                  <div className={`mb-3 ${selectedCompany === company.id ? "text-white/90" : "text-slate-400"}`}>
                    {company.description}
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className={`h-4 w-4 ${selectedCompany === company.id ? "text-white/80" : "text-slate-500"}`} />
                    <span className={`text-sm ${selectedCompany === company.id ? "text-white/90" : "text-slate-400"}`}>
                      {company.testInfo}
                    </span>
                  </div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty Gauge Section */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-3">Exam Level</h2>
            <p className="text-slate-400">Adjust the difficulty to match your skill level</p>
          </div>

          <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800/50 overflow-hidden relative max-w-2xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800/30 to-slate-900/30" />
            <CardContent className="p-8 relative z-10">
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
                    className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                      selectedDifficulty === level.id
                        ? `${level.bgColor} ${level.borderColor} shadow-lg scale-105`
                        : "border-slate-700/50 hover:border-slate-600/50"
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-3">{level.icon}</div>
                      <div className={`font-bold text-lg mb-2 ${selectedDifficulty === level.id ? level.textColor : "text-slate-300"}`}>
                        {level.label}
                      </div>
                      <div className="text-xs text-slate-500">{level.description}</div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Start Test Button */}
              <Button
                size="lg"
                onClick={handleStartEmployabilityTest}
                disabled={!selectedCompany || loading}
                className="w-full text-lg py-8 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-2xl shadow-indigo-500/40 transition-all duration-300 group disabled:opacity-50"
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
                <p className="text-sm text-center text-slate-400 mt-4">Please select a company to continue</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Selected Company Details */}
        {selectedCompanyData && (
          <Card className="mb-12 bg-slate-900/50 backdrop-blur-xl border-slate-800/50 overflow-hidden relative group max-w-4xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800/30 to-slate-900/30" />
            <CardHeader className="relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-white">Test Preview: {selectedCompanyData.fullName}</CardTitle>
                  <CardDescription className="text-slate-400 text-base">What to expect in this assessment</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-start gap-3 p-5 bg-slate-800/30 rounded-xl border border-slate-700/50">
                  <Target className="h-5 w-5 text-indigo-400 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-white mb-1">Focus Areas</div>
                    <div className="text-sm text-slate-400">{selectedCompanyData.description}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-5 bg-slate-800/30 rounded-xl border border-slate-700/50">
                  <Clock className="h-5 w-5 text-indigo-400 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-white mb-1">Duration</div>
                    <div className="text-sm text-slate-400">25 minutes (15 questions)</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-5 bg-slate-800/30 rounded-xl border border-slate-700/50">
                  <Award className="h-5 w-5 text-indigo-400 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-white mb-1">Scoring</div>
                    <div className="text-sm text-slate-400">Earn badges based on performance</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* User Stats */}
        {user && user.statistics && (
          <Card className="bg-gradient-to-r from-indigo-900/20 to-purple-900/20 backdrop-blur-xl border-indigo-500/30 max-w-4xl mx-auto overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/5 to-purple-600/5" />
            <CardHeader className="relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-xl text-white">Your Performance Overview</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center p-5 bg-slate-800/30 rounded-xl border border-slate-700/50">
                  <div className="text-4xl font-bold text-indigo-400 mb-2">{user.statistics.totalAssessments}</div>
                  <div className="text-sm text-slate-400">Tests Taken</div>
                </div>
                <div className="text-center p-5 bg-slate-800/30 rounded-xl border border-slate-700/50">
                  <div className="text-4xl font-bold text-indigo-400 mb-2">{user.statistics.averageScore}%</div>
                  <div className="text-sm text-slate-400">Avg Score</div>
                </div>
                <div className="text-center p-5 bg-slate-800/30 rounded-xl border border-slate-700/50">
                  <div className="text-4xl font-bold text-indigo-400 mb-2">{user.statistics.bestScore}%</div>
                  <div className="text-sm text-slate-400">Best Score</div>
                </div>
                <div className="text-center p-5 bg-slate-800/30 rounded-xl border border-slate-700/50">
                  <div className="text-4xl font-bold text-indigo-400 mb-2">
                    {(user.statistics.badgesEarned?.beginner || 0) +
                      (user.statistics.badgesEarned?.intermediate || 0) +
                      (user.statistics.badgesEarned?.advanced || 0)}
                  </div>
                  <div className="text-sm text-slate-400">Badges Earned</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scale-in {
          from { transform: scale(0); }
          to { transform: scale(1); }
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}