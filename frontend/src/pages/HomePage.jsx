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
  Plus, 
  Compass, 
  Activity, 
  FileText, 
  ExternalLink,
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
  const [selectedQOTDOption, setSelectedQOTDOption] = useState(null)
  const canvasRef = useRef(null)

  const companies = [
    { id: "google", name: "Google", color: "from-blue-600 to-sky-500",  category: "FAANG" },
    { id: "microsoft", name: "Microsoft", color: "from-blue-700 to-cyan-600", category: "FAANG" },
    { id: "amazon", name: "Amazon", color: "from-slate-700 to-slate-500",  category: "FAANG" },
    { id: "apple", name: "Apple", color: "from-slate-800 to-slate-600",  category: "FAANG" },
    { id: "meta", name: "Meta", color: "from-blue-800 to-blue-600",  category: "FAANG" },
    { id: "netflix", name: "Netflix", color: "from-slate-700 to-blue-700",  category: "FAANG" },
    { id: "tcs", name: "TCS", color: "from-blue-700 to-indigo-700",   category: "Service" },
    { id: "wipro", name: "Wipro", color: "from-slate-600 to-blue-600",  category: "Service" },
    { id: "infosys", name: "Infosys", color: "from-blue-600 to-cyan-600",  category: "Service" },
    { id: "accenture", name: "Accenture", color: "from-indigo-700 to-blue-700",   category: "Consulting" },
    { id: "deloitte", name: "Deloitte", color: "from-emerald-700 to-teal-700",   category: "Consulting" },
    { id: "cognizant", name: "Cognizant", color: "from-blue-700 to-indigo-600",   category: "Service" },
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
          <div className="text-left mb-12">
            <div className="relative mb-8 mt-8">
              <h1 className="text-2xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 animate-fade-in leading-tight">
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
              <style>{`
                @keyframes drawLine {
                  to { stroke-dashoffset: 0; }
                }
              `}</style>
            </div>

            <span className="text-lg text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in ">
              Land your dream offer with AI-powered assessments modeled after Deloitte, Accenture, and Google.
              <br />Get real-time feedback and comprehensive analytics tailored for corporate success.
            </span>
          </div>

          {/* Company Selection - Horizontal bar (Full Width Restored) */}
          <div className="mb-12">
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6 shadow-2xl">
              
              {/* Top Row: Title & Search */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-3">
                  <div className="p-1.5 bg-gradient-to-br from-blue-600 to-sky-500 rounded-lg">
                    <Building2 className="h-5 w-5 text-white" />
                  </div>
                  Target Organization
                </h3>

                <div className="relative w-full md:w-80">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search organizations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 bg-slate-800/80 border border-slate-700/50 rounded-full text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all text-sm shadow-inner"
                  />
                </div>
              </div>

              {/* Bottom Row: Horizontal Scrollable Pills */}
              <div className="flex items-center gap-3 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {filteredCompanies.map((company) => (
                  <button
                    key={company.id}
                    onClick={() => {
                      setSelectedCompany(company.id)
                      setCustomCompany("")
                      setShowCustomInput(false)
                    }}
                    className={`flex-shrink-0 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-2 border ${
                      selectedCompany === company.id
                        ? "bg-gradient-to-r from-blue-600 to-sky-500 text-white border-transparent shadow-lg shadow-blue-500/30"
                        : "bg-slate-800/50 text-slate-300 border-slate-700/50 hover:bg-slate-700 hover:text-white"
                    }`}
                  >
                    {company.name}
                    {selectedCompany === company.id && <CheckCircle2 className="h-4 w-4" />}
                  </button>
                ))}

                {/* "Other" Custom Button */}
                <button
                  onClick={() => {
                    setShowCustomInput(!showCustomInput)
                    setSelectedCompany(null)
                  }}
                  className={`flex-shrink-0 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-2 border border-dashed ${
                    showCustomInput
                      ? "border-blue-500 bg-blue-500/10 text-white"
                      : "border-slate-600 text-slate-400 hover:border-slate-500 hover:text-white"
                  }`}
                >
                  <Plus className="h-4 w-4" />
                  Other
                </button>
              </div>

              {/* Custom Input Field Reveal */}
              {showCustomInput && (
                <div className="mt-6 animate-slide-down">
                  <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
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
                      <div className="mt-3 flex items-start gap-2 text-sm animate-fade-in">
                        <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <p className="text-emerald-400">
                          Assessment will be customized based on {customCompany}'s recruitment patterns
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
              {/* Difficulty Section (Styled like "Assessment Categories") */}
          <div className="mb-20 max-w-7xl mx-auto">
            {/* Header Area matching the inspiration image */}
            <div className="flex flex-col md:flex-row items-end justify-between mb-10">
              <div>
                <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-blue-600 to-sky-500 rounded-lg">
            <Target className="h-5 w-5 text-white" />
          </div>
          <br></br>
          <h3 className="text-2xl font-bold text-white">Select Difficulty Level</h3>
        </div> 
                <p className="text-slate-400 max-w-2xl">
                  Expertly crafted test modules covering foundational to advanced scenarios required by top employers.
                </p>
              </div>
              
              {/* "View Analytics" moved here to match "View All Modules ->" */}
              <button 
                onClick={() => navigate("/progress")}
                className="mt-6 md:mt-0 flex items-center gap-2 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors"
              >
                View Analytics <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {/* Difficulty Cards */}
            <AdaptiveDifficultySelector
              selectedDifficulty={selectedDifficulty}
              onDifficultySelect={setSelectedDifficulty}
              onStartTest={handleStartTest} 
            />
          </div>

          {/* Features */}
          

          
          {/* Gemini-Powered Intelligence Card */}
          <div className="mb-24 max-w-7xl mx-auto animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row-reverse">
              
              {/* Left Content Area (Reversed to sit on the Right) */}
              <div className="p-10 lg:p-10 lg:w-1/2 flex flex-col justify-center relative">
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-purple-500/5 to-transparent pointer-events-none" />
                
                <Badge className="w-fit mb-6 bg-purple-500/20 text-purple-300 border-purple-500/30 px-4 py-1.5 font-semibold tracking-wide text-xs">
                  Simple & Powerful
                </Badge>
                
                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                  Gemini-Powered Intelligence
                </h2>
                
                <p className="text-lg text-slate-400 mb-10 leading-relaxed">
                  Rather than relying on a mix of secondary algorithms, we chose a direct, streamlined integration with Google Gemini. This ensures your assessments are evaluated with pure, world-class reasoning.
                </p>
                
                {/* 2 Key Points */}
                <div className="space-y-8 mb-10">
                  <div className="flex gap-4">
                    <div className="mt-1 w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0 border border-purple-500/30">
                      <CheckCircle2 className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-lg mb-1">Dynamic Gemini Reasoning</h4>
                      <p className="text-slate-400 text-sm leading-relaxed">Leverage the native logic and semantic understanding of Google Gemini to analyze your complex answers without middle-ware interference.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="mt-1 w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0 border border-purple-500/30">
                      <CheckCircle2 className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-lg mb-1">Personalized Gemini Roadmap</h4>
                      <p className="text-slate-400 text-sm leading-relaxed">Receive a learning plan synthesized directly from Gemini's analysis of your cognitive gaps in real-time.</p>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={() => navigate('/progress')} 
                  className="w-fit bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-8 py-6 h-auto rounded-xl text-base font-semibold shadow-lg shadow-purple-500/20 flex items-center gap-3 transition-all duration-300 group"
                >
                  <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Get Gemini Report
                </Button>
              </div>
              
              {/* Right Content Area (The Professional Analytics UI Dashboard) */}
              <div className="p-6 lg:p-10 lg:w-1/2 bg-slate-950/40 border-r border-slate-800/50 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-950/0 to-slate-950/0 pointer-events-none" />
                
                <div className="bg-slate-900 border border-slate-700/50 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden transform transition-transform hover:-translate-y-1 duration-500">
                  
                  {/* Dashboard Header */}
                  <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 lg:p-5 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white font-bold text-sm tracking-wide">
                      <Sparkles className="w-4 h-4" />
                      GEMINI PERFORMANCE ANALYSIS
                    </div>
                    <Badge className="bg-white/20 text-white border-none hover:bg-white/20 text-[10px] tracking-wider">
                      GEMINI-1.5-PRO
                    </Badge>
                  </div>
                  
                  {/* Dashboard Body */}
                  <div className="p-6 lg:p-8 space-y-8">
                    {/* Progress Bar 1 */}
                    <div>
                      <div className="flex justify-between text-sm mb-3">
                        <span className="text-white font-medium">Complex Data Interpretation</span>
                        <span className="text-purple-400 font-bold">92%</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full relative">
                          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full mr-0.5 shadow-[0_0_5px_rgba(255,255,255,0.8)]" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Progress Bar 2 */}
                    <div>
                      <div className="flex justify-between text-sm mb-3">
                        <span className="text-white font-medium">Logical Deduction Speed</span>
                        <span className="text-indigo-400 font-bold">64%</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-2">
                        <div className="bg-indigo-500 h-2 rounded-full relative" style={{ width: '64%' }}>
                          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full mr-0.5 shadow-[0_0_5px_rgba(255,255,255,0.8)]" />
                        </div>
                      </div>
                      <p className="text-xs text-slate-400 mt-3 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> 
                        Gemini Insight: Work on syllogism patterns.
                      </p>
                    </div>

                    {/* Drill Recommendation */}
                    <div className="pt-8 border-t border-slate-800/80 border-dashed">
                      <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase block mb-4">
                        GEMINI RECOMMENDED DRILL
                      </span>
                      <div className="bg-slate-800/40 border border-slate-700/50 hover:border-purple-500/50 p-4 rounded-xl flex items-start gap-4 cursor-pointer transition-colors duration-300 group">
                        <div className="p-2.5 bg-purple-500/20 rounded-lg text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <h5 className="text-white text-sm font-semibold mb-1 group-hover:text-purple-300 transition-colors">Advanced Matrix Reasoning 2.0</h5>
                          <p className="text-xs text-slate-400">Video Guide • 12 mins</p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-purple-400 transition-colors mt-1" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Experience the AI Rigor (Question of the Day Card) */}
          <div className="mb-8 max-w-7xl mx-auto animate-fade-in">
            <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row">
              
              {/* Left Content Area */}
              <div className="p-10 lg:p-10 lg:w-1/2 flex flex-col justify-center relative">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none" />
                
                <Badge className="w-fit mb-4 bg-indigo-500/20 text-indigo-300 border-indigo-500/30 px-4 py-1.5 font-semibold tracking-wide text-xs">
                  QUESTION OF THE DAY
                </Badge>
                
                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                  Experience the AI Rigor
                </h2>
                
                <p className="text-lg text-slate-400 mb-10 leading-relaxed">
                  Our questions aren't just from a bank. They are procedurally generated to match the specific difficulty curves of elite assessment providers like SHL, Kenexa, and Cubiks.
                </p>
                
                <div className="flex flex-wrap items-center gap-4">
                  <Button className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-6 h-auto rounded-xl text-base font-semibold shadow-lg shadow-indigo-500/20 transition-all duration-300">
                    Try This Question
                  </Button>
                  <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-800/50 px-6 py-6 h-auto rounded-xl text-base font-semibold transition-all duration-300">
                    Explain Solution
                  </Button>
                </div>
              </div>

              {/* Right Content Area (The Interactive Question UI) */}
              <div className="p-6 lg:p-10 lg:w-1/2 bg-slate-950/40 border-l border-slate-800/50 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950/0 to-slate-950/0 pointer-events-none" />
                
                <div className="bg-slate-900 border border-slate-700/50 rounded-2xl p-6 lg:p-8 w-full max-w-md shadow-2xl relative overflow-hidden transform transition-transform hover:scale-[1.02] duration-500">
                  {/* Card Header */}
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                      Question #204 - Numerical
                    </span>
                    <Badge variant="outline" className="text-slate-300 border-slate-600 bg-slate-800/50">
                      Hard
                    </Badge>
                  </div>
                  
                  {/* Question Prompt */}
                  <p className="text-slate-200 text-lg mb-8 leading-relaxed font-medium">
                    If Company A's revenue grew by 15% in Q1 and declined by 8% in Q2, while its operating costs remained constant at 60% of original Q1 revenue, what is the net profit margin percentage at the end of Q2?
                  </p>
                  
                  {/* Options */}
                  {/* Options */}
                  <div className="space-y-2.5">
                    {['4.25%', '6.70%', '12.4%', '8.10%'].map((opt, i) => {
                      const isSelected = selectedQOTDOption === i;
                      
                      return (
                        <div 
                          key={i} 
                          onClick={() => setSelectedQOTDOption(i)}
                          className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all duration-300 group ${
                            isSelected 
                              ? "border-indigo-500 bg-indigo-500/10 shadow-[0_0_15px_rgba(99,102,241,0.1)]" 
                              : "border-slate-700/50 bg-slate-800/30 hover:bg-slate-800/80 hover:border-indigo-500/50"
                          }`}
                        >
                          <span className={`text-sm font-medium transition-colors ${
                            isSelected ? "text-white" : "text-slate-300 group-hover:text-white"
                          }`}>
                            {opt}
                          </span>
                          
                          {/* Radio Button Circle */}
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                            isSelected ? "border-indigo-500" : "border-slate-600 group-hover:border-indigo-400"
                          }`}>
                            {/* Inner filled dot when selected */}
                            {isSelected && <div className="w-2 h-2 rounded-full bg-indigo-500 animate-scale-in" />}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
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