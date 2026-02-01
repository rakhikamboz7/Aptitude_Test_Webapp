import React, { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/auth-context"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { AdaptiveDifficultySelector } from "../components/adaptive-difficulty-selector"
import {
  Brain,
  Building2,
  CheckCircle2,
  TrendingUp,
  Award,
  Sparkles,
  Target,
  Zap,
  Clock,
  BookOpen,
  LogOut,
  User,
  Search,
  Rocket,
  Star,
  Code,
  Database,
  Cpu,
  Lightbulb,
  Trophy,
  BarChart3,
  Menu,
  X,
  ArrowRight,
  GraduationCap,
  Briefcase,
} from "lucide-react"

export default function HomePage() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [selectedDifficulty, setSelectedDifficulty] = useState(user?.preferences?.preferredDifficulty || "medium")
  const [selectedCompany, setSelectedCompany] = useState(null)
  const [customCompany, setCustomCompany] = useState("")
  const [showCustomInput, setShowCustomInput] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [activeFeature, setActiveFeature] = useState(null)
  const canvasRef = useRef(null)

  const companies = [
    { id: "google", name: "Google", color: "from-blue-600 to-sky-500", icon: "🔍", category: "FAANG" },
    { id: "microsoft", name: "Microsoft", color: "from-blue-700 to-cyan-600", icon: "🪟", category: "FAANG" },
    { id: "amazon", name: "Amazon", color: "from-slate-700 to-slate-500", icon: "📦", category: "FAANG" },
    { id: "apple", name: "Apple", color: "from-slate-800 to-slate-600", icon: "🍎", category: "FAANG" },
    { id: "meta", name: "Meta", color: "from-blue-800 to-blue-600", icon: "👥", category: "FAANG" },
    { id: "netflix", name: "Netflix", color: "from-slate-700 to-blue-700", icon: "🎬", category: "FAANG" },
    { id: "tcs", name: "TCS", color: "from-blue-700 to-indigo-700", icon: "💼", category: "Service" },
    { id: "wipro", name: "Wipro", color: "from-slate-600 to-blue-600", icon: "⚡", category: "Service" },
    { id: "infosys", name: "Infosys", color: "from-blue-600 to-cyan-600", icon: "🌐", category: "Service" },
    { id: "accenture", name: "Accenture", color: "from-indigo-700 to-blue-700", icon: "🎯", category: "Consulting" },
    { id: "deloitte", name: "Deloitte", color: "from-emerald-700 to-teal-700", icon: "📊", category: "Consulting" },
    { id: "cognizant", name: "Cognizant", color: "from-blue-700 to-indigo-600", icon: "🧠", category: "Service" },
  ]

  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Entry loading animation
  useEffect(() => {
    const timer = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer)
          setTimeout(() => setIsLoading(false), 500)
          return 100
        }
        return prev + 2
      })
    }, 30)

    return () => clearInterval(timer)
  }, [])

  // Mouse tracking for parallax effect
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
    if (isLoading) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles = []
    const particleCount = 50

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
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
        ctx.fillStyle = `rgba(59, 130, 246, ${particle.opacity})`
        ctx.fill()
      })

      // Connect nearby particles
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach((p2) => {
          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(59, 130, 246, ${0.1 * (1 - distance / 100)})`
            ctx.lineWidth = 0.5
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
          }
        })
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
  }, [isLoading])

  const handleStartTest = () => {
    const company = customCompany || selectedCompany || "general"
    localStorage.setItem("selectedDifficulty", selectedDifficulty)
    localStorage.setItem("selectedCompany", company)
    navigate("/quiz")
  }

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Feedback",
      description: "Get personalized explanations with advanced AI that adapts to your learning style",
      color: "from-blue-600 to-cyan-600",
      stat: "95% accuracy",
    },
    {
      icon: TrendingUp,
      title: "Adaptive Difficulty",
      description: "Questions dynamically adjust to match your skill level for optimal learning",
      color: "from-emerald-600 to-teal-600",
      stat: "3 levels",
    },
    {
      icon: Building2,
      title: "Company-Specific Tests",
      description: "Practice with real interview questions from top tech companies",
      color: "from-blue-700 to-indigo-700",
      stat: "12+ companies",
    },
    {
      icon: Award,
      title: "Achievement System",
      description: "Earn badges and unlock new challenges as you progress",
      color: "from-amber-600 to-orange-600",
      stat: "15+ badges",
    },
    {
      icon: Clock,
      title: "Timed Practice",
      description: "Simulate real test conditions with smart time management",
      color: "from-slate-600 to-slate-700",
      stat: "Real-time",
    },
    {
      icon: BarChart3,
      title: "Detailed Analytics",
      description: "Track your progress with comprehensive performance insights",
      color: "from-indigo-600 to-blue-700",
      stat: "100% tracked",
    },
  ]

  // Loading Screen
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex items-center justify-center overflow-hidden">
        {/* Animated SVG Background */}
        <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: "#0ea5e9", stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: "#3b82f6", stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          
          {[...Array(5)].map((_, i) => (
            <circle
              key={i}
              cx={`${20 + i * 15}%`}
              cy="50%"
              r="100"
              fill="url(#grad1)"
              opacity="0.15"
              style={{
                animation: `pulse ${2 + i * 0.5}s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}

          <path
            d="M0,50 Q250,100 500,50 T1000,50"
            stroke="url(#grad1)"
            strokeWidth="2"
            fill="none"
            opacity="0.2"
            style={{
              animation: "draw 3s ease-in-out infinite",
            }}
          />
        </svg>

        <style>{`
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 0.15; }
            50% { transform: scale(1.3); opacity: 0.3; }
          }
          @keyframes draw {
            0% { stroke-dasharray: 0, 1000; }
            100% { stroke-dasharray: 1000, 0; }
          }
        `}</style>

        <div className="relative z-10 text-center">
          <div className="mb-8 relative">
            <div className="w-32 h-32 mx-auto relative">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <defs>
                  <linearGradient id="brainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: "#0ea5e9" }} />
                    <stop offset="100%" style={{ stopColor: "#3b82f6" }} />
                  </linearGradient>
                </defs>
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="url(#brainGrad)"
                  strokeWidth="3"
                  strokeDasharray="283"
                  strokeDashoffset="283"
                  style={{
                    animation: "fillCircle 2s ease-out forwards",
                  }}
                />
                <g transform="translate(50, 50)">
                  <Brain className="w-12 h-12 text-white" style={{ transform: "translate(-24px, -24px)" }} />
                </g>
              </svg>
            </div>
          </div>

          <style>{`
            @keyframes fillCircle {
              to { stroke-dashoffset: 0; }
            }
          `}</style>

          <h1 className="text-5xl font-bold text-white mb-4 animate-fade-in">
            Aptitude<span className="text-sky-400">AI</span>
          </h1>

          <p className="text-slate-300 text-lg mb-8 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            Preparing your personalized learning experience...
          </p>

          <div className="w-80 mx-auto">
            <div className="bg-slate-800/50 rounded-full h-2 overflow-hidden backdrop-blur-sm border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-sky-500 to-blue-600 transition-all duration-300 ease-out relative"
                style={{ width: `${loadingProgress}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-shimmer"></div>
              </div>
            </div>
            <p className="text-slate-400 text-sm mt-3 font-medium">{loadingProgress}%</p>
          </div>

          <div className="flex justify-center gap-2 mt-8">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2.5 h-2.5 bg-sky-400 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.2}s` }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Animated Canvas Background */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none opacity-30"
        style={{ zIndex: 0 }}
      />

      {/* Gradient Orbs - Professional Blues */}
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
        <div
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-br from-indigo-600/15 to-blue-600/15 rounded-full blur-3xl"
          style={{
            transform: `translate(-50%, -50%) translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`,
            transition: "transform 0.5s ease-out",
          }}
        />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-800/50 bg-slate-900/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={() => navigate("/")}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-sky-500 rounded-xl blur-lg opacity-40 group-hover:opacity-70 transition-opacity"></div>
                <div className="relative p-2 bg-gradient-to-br from-blue-600 to-sky-500 rounded-xl shadow-xl">
                  <Brain className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <span className="text-xl font-bold text-white">
                  Aptitude<span className="text-sky-400">AI</span>
                </span>
                <p className="text-xs text-slate-400 -mt-1">Professional Career Assessment</p>
              </div>
            </div>

            <nav className="hidden md:flex items-center space-x-1 bg-slate-800/50 rounded-full px-2 py-2 border border-slate-700/50">
              {[
                { path: "/", label: "Home", icon: Sparkles },
                { path: "/assessments", label: "Assessments", icon: BookOpen },
                { path: "/progress", label: "Progress", icon: TrendingUp },
                { path: "/employability", label: "Employability", icon: Briefcase },
              ].map((link) => {
                const Icon = link.icon
                return (
                  <button
                    key={link.path}
                    onClick={() => navigate(link.path)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      link.path === "/"
                        ? "bg-gradient-to-r from-blue-600 to-sky-600 text-white shadow-lg shadow-blue-500/30"
                        : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden lg:inline">{link.label}</span>
                  </button>
                )
              })}
            </nav>

            <div className="flex items-center space-x-3">
              {user && (
                <>
                  <div className="hidden sm:block text-right">
                    <p className="text-sm font-medium text-white">
                      {user.profile?.firstName || user.username}
                    </p>
                    <div className="flex items-center justify-end gap-1 text-xs text-slate-400">
                      <Trophy className="h-3 w-3 text-amber-500" />
                      {user.statistics?.totalAssessments || 0} assessments
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
                    className="bg-slate-800/50 hover:bg-red-500/10 border border-slate-700/50 text-white hover:text-red-400 hover:border-red-500/30"
                  >
                    <LogOut className="h-5 w-5" />
                  </Button>
                </>
              )}

              <Button
                variant="ghost"
                size="icon"
                className="md:hidden bg-slate-800/50 border border-slate-700/50 text-white"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 space-y-2 animate-slide-down">
              {[
                { path: "/", label: "Home" },
                { path: "/assessments", label: "Assessments" },
                { path: "/progress", label: "Progress" },
                { path: "/employability", label: "Employability" },
              ].map((link) => (
                <button
                  key={link.path}
                  onClick={() => {
                    navigate(link.path)
                    setMobileMenuOpen(false)
                  }}
                  className="block w-full text-left px-4 py-3 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all"
                >
                  {link.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8" style={{ zIndex: 1 }}>
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600/10 to-sky-600/10 backdrop-blur-sm border border-blue-500/20 px-6 py-3 rounded-full mb-8 animate-fade-in">
              <GraduationCap className="h-4 w-4 text-sky-400" />
              <span className="text-sm font-medium text-slate-200">
                Welcome, {user?.profile?.firstName || user?.username}
              </span>
            </div>

            <div className="relative mb-8">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 animate-fade-in leading-tight">
                Professional Career
                <br />
                <span className="relative inline-block">
                  <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400">
                    Assessment Platform
                  </span>
                  <svg
                    className="absolute -bottom-2 left-0 w-full"
                    height="12"
                    viewBox="0 0 300 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2 10C50 5 100 2 150 2C200 2 250 5 298 10"
                      stroke="url(#underlineGrad)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      style={{
                        strokeDasharray: 300,
                        strokeDashoffset: 300,
                        animation: "drawLine 1.5s ease-out 0.5s forwards",
                      }}
                    />
                    <defs>
                      <linearGradient id="underlineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#0ea5e9" />
                        <stop offset="50%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#6366f1" />
                      </linearGradient>
                    </defs>
                  </svg>
                </span>
              </h1>
            </div>

            <style>{`
              @keyframes drawLine {
                to { stroke-dashoffset: 0; }
              }
            `}</style>

            <p className="text-xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in">
              Enhance your career readiness with AI-powered assessments, adaptive learning, and comprehensive analytics tailored for corporate success.
            </p>
          </div>

          {/* Company Selection */}
          <div className="mb-12">
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-3xl p-8 shadow-2xl">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                <div className="text-left">
                  <h3 className="text-2xl font-bold text-white flex items-center gap-3 mb-2">
                    <div className="p-2 bg-gradient-to-br from-blue-600 to-sky-500 rounded-lg">
                      <Building2 className="h-5 w-5 text-white" />
                    </div>
                    Select Target Organization
                  </h3>
                  <p className="text-sm text-slate-400">
                    Choose from leading companies or specify your preference
                  </p>
                </div>

                <div className="relative w-full md:w-80">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search organizations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
                {filteredCompanies.map((company, index) => (
                  <button
                    key={company.id}
                    onClick={() => {
                      setSelectedCompany(company.id)
                      setCustomCompany("")
                      setShowCustomInput(false)
                    }}
                    className={`group relative p-6 rounded-2xl border-2 transition-all duration-500 hover:scale-105 overflow-hidden ${
                      selectedCompany === company.id
                        ? "border-transparent shadow-2xl shadow-blue-500/30 scale-105"
                        : "border-slate-700/50 hover:border-slate-600/50"
                    }`}
                    style={{
                      animation: `slideUp 0.5s ease-out ${index * 0.05}s backwards`,
                    }}
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${company.color} transition-opacity duration-300 ${
                        selectedCompany === company.id ? "opacity-100" : "opacity-0 group-hover:opacity-10"
                      }`}
                    />

                    <div className="relative z-10 text-center">
                      <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform duration-300">
                        {company.icon}
                      </div>
                      <div
                        className={`font-bold text-sm mb-2 ${
                          selectedCompany === company.id ? "text-white" : "text-slate-200"
                        }`}
                      >
                        {company.name}
                      </div>
                      <Badge
                        variant="secondary"
                        className={`text-xs ${
                          selectedCompany === company.id
                            ? "bg-white/20 text-white border-white/30"
                            : "bg-slate-800 text-slate-400 border-slate-700"
                        }`}
                      >
                        {company.category}
                      </Badge>
                    </div>

                    {selectedCompany === company.id && (
                      <div className="absolute top-3 right-3 z-20">
                        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center animate-scale-in shadow-lg">
                          <CheckCircle2 className="h-4 w-4 text-blue-600" />
                        </div>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </button>
                ))}

                <button
                  onClick={() => {
                    setShowCustomInput(!showCustomInput)
                    setSelectedCompany(null)
                  }}
                  className={`group relative p-6 rounded-2xl border-2 border-dashed transition-all duration-500 hover:scale-105 ${
                    showCustomInput
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-slate-700 hover:border-slate-600"
                  }`}
                >
                  <div className="relative z-10 text-center">
                    <div className="text-4xl mb-3 transform group-hover:rotate-90 transition-transform duration-500">
                      ➕
                    </div>
                    <div className="font-bold text-sm text-slate-200 mb-2">Other</div>
                    <Badge variant="secondary" className="text-xs bg-slate-800 text-slate-400 border-slate-700">
                      Custom
                    </Badge>
                  </div>
                </button>
              </div>

              <style>{`
                @keyframes slideUp {
                  from { opacity: 0; transform: translateY(20px); }
                  to { opacity: 1; transform: translateY(0); }
                }
                @keyframes scale-in {
                  from { transform: scale(0); }
                  to { transform: scale(1); }
                }
              `}</style>

              {showCustomInput && (
                <div className="mb-6 animate-slide-down">
                  <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
                    <label className="block text-sm font-medium text-slate-300 mb-3 items-center gap-2">
                      <Briefcase className="h-4 w-4 text-sky-400" />
                      Specify Your Target Organization
                    </label>
                    <input
                      type="text"
                      value={customCompany}
                      onChange={(e) => setCustomCompany(e.target.value)}
                      placeholder="Enter company name (e.g., Tesla, SpaceX, Goldman Sachs)..."
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                    />
                    {customCompany && (
                      <div className="mt-3 flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <p className="text-emerald-400">
                          Assessment will be customized based on {customCompany}'s recruitment patterns
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {!selectedCompany && !customCompany && (
                <div className="text-center">
                  <p className="text-sm text-slate-400 flex items-center justify-center gap-2">
                    <Target className="h-4 w-4" />
                    Select an organization for targeted preparation or proceed with general assessment
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Difficulty */}
          <div className="mb-12 max-w-4xl mx-auto">
            <AdaptiveDifficultySelector
              selectedDifficulty={selectedDifficulty}
              onDifficultySelect={setSelectedDifficulty}
            />
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button
              size="lg"
              onClick={handleStartTest}
              className="relative group text-lg px-10 py-7 h-auto bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-white font-semibold rounded-xl shadow-2xl shadow-blue-500/40 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-sky-600 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-center gap-3">
                <Zap className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
                Begin Assessment
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate("/progress")}
              className="text-lg px-10 py-7 h-auto bg-slate-800/50 backdrop-blur-sm border-2 border-slate-700/50 text-white hover:bg-slate-700/50 hover:border-slate-600/50 rounded-xl transition-all duration-300 group"
            >
              <TrendingUp className="h-5 w-5 mr-2 group-hover:-translate-y-1 transition-transform duration-300" />
              View Analytics
            </Button>
          </div>

          {/* Features */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-blue-600/20 text-blue-300 border-blue-500/30 px-4 py-1.5">
                Platform Features
              </Badge>
              <h2 className="text-4xl font-bold text-white mb-4">
                Enterprise-Grade Assessment Tools
              </h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                Leverage advanced technology and data-driven insights for optimal career preparation
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  onMouseEnter={() => setActiveFeature(index)}
                  onMouseLeave={() => setActiveFeature(null)}
                  className={`group relative bg-slate-900/50 backdrop-blur-xl border-slate-800/50 hover:border-slate-700/50 transition-all duration-500 overflow-hidden cursor-pointer ${
                    activeFeature === index ? "scale-105 shadow-2xl shadow-blue-500/10" : ""
                  }`}
                  style={{
                    animation: `fadeInUp 0.5s ease-out ${index * 0.1}s backwards`,
                  }}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                  />

                  <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-10 blur-xl`}
                    />
                  </div>

                  <CardHeader className="pb-4 relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className={`p-3 bg-gradient-to-br ${feature.color} rounded-xl shadow-lg group-hover:scale-110 transition-all duration-500`}
                      >
                        <feature.icon className="h-6 w-6 text-white" />
                      </div>
                      <Badge variant="secondary" className="bg-slate-800/80 text-slate-400 border-slate-700/50">
                        {feature.stat}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl text-white group-hover:text-sky-400 transition-colors duration-300">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="relative z-10">
                    <CardDescription className="text-base text-slate-400 leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>

                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </Card>
              ))}
            </div>

            <style>{`
              @keyframes fadeInUp {
                from { opacity: 0; transform: translateY(30px); }
                to { opacity: 1; transform: translateY(0); }
              }
            `}</style>
          </div>

          {/* Stats */}
          <div className="bg-gradient-to-r from-blue-900/20 to-sky-900/20 backdrop-blur-xl border border-slate-800/50 rounded-3xl p-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { value: "10K+", label: "Active Users", icon: "👥" },
                { value: "12+", label: "Companies", icon: "🏢" },
                { value: "95%", label: "Success Rate", icon: "📈" },
                { value: "24/7", label: "Support", icon: "💬" },
              ].map((stat, index) => (
                <div key={index} className="group">
                  <div className="text-5xl mb-3 transform group-hover:scale-110 transition-transform duration-300">
                    {stat.icon}
                  </div>
                  <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-400 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-slate-800/50 py-12 px-4 bg-slate-900/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-sky-500 rounded-xl shadow-xl">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-white">
                  Aptitude<span className="text-sky-400">AI</span>
                </span>
                <p className="text-sm text-slate-400">Professional Career Development</p>
              </div>
            </div>

            <div className="text-center md:text-right">
              <p className="text-slate-400 text-sm mb-1">
                Powered by Advanced AI Technology
              </p>
              <p className="text-slate-500 text-xs">
                © 2024 AptitudeAI. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Global Styles */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          background-size: 1000px 100%;
          animation: shimmer 2s infinite;
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}