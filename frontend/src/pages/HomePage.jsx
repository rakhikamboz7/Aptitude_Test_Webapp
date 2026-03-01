import React, { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/auth-context"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { AdaptiveDifficultySelector } from "../components/adaptive-difficulty-selector"
import { Navigation } from "../components/navigation" // Added Navigation Import
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
  Layers
} from "lucide-react"
let initialLoadDone = false;
export default function HomePage() {
  const navigate = useNavigate()
  const { user } = useAuth() // Removed logout, it's handled in Navigation now!
  const [selectedDifficulty, setSelectedDifficulty] = useState(user?.preferences?.preferredDifficulty || "medium")
  const [selectedCompany, setSelectedCompany] = useState(null)
  const [customCompany, setCustomCompany] = useState("")
  const [showCustomInput, setShowCustomInput] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(!initialLoadDone)
  const [loadingProgress, setLoadingProgress] = useState(initialLoadDone ? 100 : 0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [selectedQOTDOption, setSelectedQOTDOption] = useState(null)
  const canvasRef = useRef(null)
  const difficultySectionRef = useRef(null)
  const customInputRef = useRef(null);
  const [companiesList, setCompaniesList] = useState([
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
)
  const filteredCompanies = companiesList.filter((company) =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSaveCustomCompany = (e) => {
    if (e) e.preventDefault();
    if (!customCompany.trim()) return;
    const newId = customCompany.toLowerCase().replace(/\s+/g, '-');
    
    // Create new pill if it doesn't exist yet
    if (!companiesList.find(c => c.id === newId)) {
      setCompaniesList([...companiesList, { id: newId, name: customCompany, color: "from-blue-600 to-sky-500", category: "Custom" }]);
    }
    
    // Select it, close the input, and clear the text
    setSelectedCompany(newId);
    setShowCustomInput(false);
    setCustomCompany(""); 
    
    // Scroll down to difficulty smoothly
    setTimeout(() => {
      difficultySectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  useEffect(() => {
    // If it already loaded this session, skip the timer completely
    if (initialLoadDone) return;

    const timer = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer)
          setTimeout(() => {
            setIsLoading(false)
            initialLoadDone = true // Mark it as done so it doesn't happen again!
          }, 500)
          return 100
        }
        return prev + 2
      })
    }, 30)
    return () => clearInterval(timer)
  }, [])

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

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-slate-50 flex items-center justify-center overflow-hidden">
        <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
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
          <path d="M0,50 Q250,100 500,50 T1000,50" stroke="url(#grad1)" strokeWidth="2" fill="none" opacity="0.2" style={{ animation: "draw 3s ease-in-out infinite" }} />
        </svg>

        <style>{`
          @keyframes pulse { 0%, 100% { transform: scale(1); opacity: 0.15; } 50% { transform: scale(1.3); opacity: 0.3; } }
          @keyframes draw { 0% { stroke-dasharray: 0, 1000; } 100% { stroke-dasharray: 1000, 0; } }
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
                <circle cx="50" cy="50" r="45" fill="none" stroke="url(#brainGrad)" strokeWidth="3" strokeDasharray="283" strokeDashoffset="283" style={{ animation: "fillCircle 2s ease-out forwards" }} />
                <g transform="translate(50, 50)">
                  <Brain className="w-12 h-12 text-slate-900" style={{ transform: "translate(-24px, -24px)" }} />
                </g>
              </svg>
            </div>
          </div>
          <style>{`@keyframes fillCircle { to { stroke-dashoffset: 0; } }`}</style>
          <h1 className="text-5xl font-bold text-slate-900 mb-4 animate-fade-in">Aptitude<span className="text-sky-500">AI</span></h1>
          <p className="text-slate-600 text-lg mb-8 animate-fade-in" style={{ animationDelay: "0.3s" }}>Preparing your personalized learning experience...</p>
          <div className="w-80 mx-auto">
            <div className="bg-slate-200 rounded-full h-2 overflow-hidden border border-slate-300">
              <div className="h-full bg-gradient-to-r from-sky-400 to-blue-500 transition-all duration-300 ease-out relative" style={{ width: `${loadingProgress}%` }}>
                <div className="absolute inset-0 bg-white/30 animate-shimmer"></div>
              </div>
            </div>
            <p className="text-slate-500 text-sm mt-3 font-medium">{loadingProgress}%</p>
          </div>
          <div className="flex justify-center gap-2 mt-8">
            {[0, 1, 2].map((i) => (
              <div key={i} className="w-2.5 h-2.5 bg-sky-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.2}s` }}></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden font-sans">
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none opacity-40" style={{ zIndex: 0 }} />

      <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-300/30 to-cyan-300/30 rounded-full blur-3xl" style={{ transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`, transition: "transform 0.5s ease-out" }} />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-sky-300/30 to-blue-400/30 rounded-full blur-3xl" style={{ transform: `translate(${-mousePosition.x}px, ${-mousePosition.y}px)`, transition: "transform 0.5s ease-out" }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-br from-indigo-300/20 to-blue-300/20 rounded-full blur-3xl" style={{ transform: `translate(-50%, -50%) translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`, transition: "transform 0.5s ease-out" }} />
      </div>

      {/* PLUGGED IN NAVIGATION COMPONENT */}
      <Navigation />

      <main className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8" style={{ zIndex: 1 }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="relative mb-8 mt-8">
              <h1 className="text-4xl sm:text-6xl lg:text-6xl font-bold text-slate-900 mb-6 animate-fade-in leading-tight">
                Professional Career
                <br />
                <span className="relative inline-block">
                  <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600">
                    Assessment Platform
                  </span>
                  <svg className="absolute -bottom-2 left-0 w-full opacity-60" height="12" viewBox="0 0 300 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 10C50 5 100 2 150 2C200 2 250 5 298 10" stroke="url(#underlineGrad)" strokeWidth="4" strokeLinecap="round" style={{ strokeDasharray: 300, strokeDashoffset: 300, animation: "drawLine 1.5s ease-out 0.5s forwards" }} />
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
              <style>{`@keyframes drawLine { to { stroke-dashoffset: 0; } }`}</style>
            </div>
            <p className="text-lg text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in font-medium">
              Land your dream offer with AI-powered assessments modeled after Deloitte, Accenture, and Google.
              <br />Get real-time feedback and comprehensive analytics tailored for corporate success.
            </p>
          </div>

          <div className="mb-12">
            <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-2xl p-6 shadow-xl shadow-slate-200/50">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                  <Building2 className="h-6 w-6 text-blue-500" /> Target Organization
                </h3>
                <div className="relative w-full md:w-80">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input type="text" placeholder="Search organizations..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-sm shadow-inner" />
                </div>
              </div>
              <div className="flex items-center gap-3 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {filteredCompanies.map((company) => (
                  <button 
                   type="button"
                    key={company.id} 
                    onClick={() => { 
                      setSelectedCompany(company.id); 
                      setCustomCompany(""); 
                      setShowCustomInput(false);
                      // NEW: Scroll down to difficulty section smoothly
                      setTimeout(() => {
                        difficultySectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }, 100);}} className={`flex-shrink-0 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-2 border ${selectedCompany === company.id ? "bg-gradient-to-r from-blue-600 to-sky-500 text-white border-transparent shadow-md shadow-blue-500/30" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900"}`}>
                    {company.name} {selectedCompany === company.id && <CheckCircle2 className="h-4 w-4" />}
                  </button>
                ))}
                <button 
                  type="button"
                  onClick={() => { 
                    const willShow = !showCustomInput;
                    setShowCustomInput(willShow); 
                    setSelectedCompany(null); 
                    // Scroll to input box when opened
                    if (willShow) {
                      setTimeout(() => customInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
                    }
                  }} className={`flex-shrink-0 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-2 border border-dashed ${showCustomInput ? "border-blue-500 bg-blue-50 text-blue-700" : "border-slate-300 text-slate-500 hover:border-slate-400 hover:text-slate-700"}`}>
                  <Plus className="h-4 w-4" /> Other
                </button>
              </div>
              {/* Custom Input Field Reveal */}
              {showCustomInput && (
                <div ref={customInputRef} className="mt-6 animate-slide-down">
                  <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-3">
                      <Briefcase className="h-4 w-4 text-blue-500" /> Specify Your Target Organization
                    </label>
                    
                    {/* NEW: Flex container to put input and button side-by-side */}
                    <div className="flex gap-3">
                      <input 
                        type="text" 
                        value={customCompany} 
                        onChange={(e) => setCustomCompany(e.target.value)} 
                        onKeyDown={(e) => e.key === 'Enter' && handleSaveCustomCompany(e)}
                        placeholder="Enter company name (e.g., Tesla, GoldmanSachs)." 
                        className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all shadow-sm" 
                      />
                      
                      {/* THIS IS STEP 3: The Confirm button with type="button" */}
                      <Button 
                        type="button" 
                        onClick={handleSaveCustomCompany}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 h-auto rounded-lg shadow-md"
                      >
                        Confirm
                      </Button>
                    </div>

                    {/* RESTORED: The customization message */}
                    {customCompany && (
                      <div className="mt-4 flex items-start gap-2 text-sm animate-fade-in">
                        <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <p className="text-emerald-700 font-medium">
                          Assessment will be customized based on <span className="font-bold">{customCompany}'s</span> recruitment patterns
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div ref={difficultySectionRef} className="mb-20 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-end justify-between mb-10">
              <div>
                <div className="flex items-center gap-3 mb-4 mt-5">
                  <Layers className="h-7 w-7 text-blue-500" />
                  <h3 className="text-2xl font-bold text-slate-900">Select Difficulty Level</h3>
                </div> 
                <p className="text-slate-600 max-w-2xl font-medium">Expertly crafted test modules covering foundational to advanced scenarios required by top employers.</p>
              </div>
              <button onClick={() => navigate("/progress")} className="mt-6 md:mt-0 flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-500 transition-colors">
                View Analytics <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            <AdaptiveDifficultySelector selectedDifficulty={selectedDifficulty} onDifficultySelect={setSelectedDifficulty} onStartTest={handleStartTest} />
          </div>

          <div className="mb-24 max-w-5xl mx-auto animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 flex flex-col lg:flex-row-reverse">
              <div className="p-8 lg:p-10 lg:w-1/2 flex flex-col justify-center relative">
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-purple-100/50 to-transparent pointer-events-none" />
                <Badge className="w-fit mb-4 bg-purple-100 text-purple-700 border-purple-200 px-3 py-1 font-semibold tracking-wide text-[10px]">Simple & Powerful</Badge>
                <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-4">Gemini-Powered Intelligence</h2>
                <p className="text-base text-slate-600 mb-8 leading-relaxed">To ensure the highest standard of evaluation, our platform is built directly on Google Gemini. By leveraging its native intelligence, we guarantee world-class reasoning quality and precise feedback for every assessment.</p>
                <div className="space-y-6 mb-8">
                  <div className="flex gap-3">
                    <div className="mt-1 w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center shrink-0 border border-purple-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="text-slate-900 font-semibold text-base mb-1">Dynamic Gemini Reasoning</h4>
                      <p className="text-slate-600 text-xs leading-relaxed">Leverage the native logic and semantic understanding of Google Gemini to analyze your complex answers without middle-ware interference.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="mt-1 w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center shrink-0 border border-purple-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="text-slate-900 font-semibold text-base mb-1">Personalized Gemini Roadmap</h4>
                      <p className="text-slate-600 text-xs leading-relaxed">Receive a learning plan synthesized directly from Gemini's analysis of your cognitive gaps in real-time.</p>
                    </div>
                  </div>
                </div>
                <Button onClick={() => navigate('/progress')} className="w-fit bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-4 h-auto rounded-xl text-sm font-semibold shadow-lg shadow-purple-500/30 flex items-center gap-2 transition-all duration-300 group">
                  <Sparkles className="w-4 h-4 group-hover:scale-110 transition-transform" /> Get Gemini Report
                </Button>
              </div>
              <div className="p-6 lg:p-8 lg:w-1/2 bg-slate-50/50 border-r border-slate-200 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-200/40 via-transparent to-transparent pointer-events-none" />
                <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md shadow-2xl shadow-slate-200/60 overflow-hidden transform transition-transform hover:-translate-y-1 duration-500">
                  <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white font-bold text-xs tracking-wide"><Sparkles className="w-3.5 h-3.5" /> GEMINI PERFORMANCE ANALYSIS</div>
                    <Badge className="bg-white/20 text-white border-none hover:bg-white/30 text-[8px] tracking-wider px-1.5 backdrop-blur-sm">GEMINI-1.5-PRO</Badge>
                  </div>
                  <div className="p-5 lg:p-6 space-y-6">
                    <div>
                      <div className="flex justify-between text-xs mb-2.5"><span className="text-slate-800 font-bold">Complex Data Interpretation</span><span className="text-purple-600 font-bold">92%</span></div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5"><div className="bg-purple-500 h-1.5 rounded-full relative shadow-sm" style={{ width: '92%' }}><div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full mr-0 shadow-sm" /></div></div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-2.5"><span className="text-slate-800 font-bold">Logical Deduction Speed</span><span className="text-indigo-600 font-bold">64%</span></div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5"><div className="bg-indigo-500 h-1.5 rounded-full relative shadow-sm" style={{ width: '64%' }}><div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full mr-0 shadow-sm" /></div></div>
                      <p className="text-[10px] text-slate-500 mt-2.5 flex items-center gap-1.5 font-medium"><Sparkles className="w-3 h-3 text-indigo-500" /> Gemini Insight: Work on syllogism patterns.</p>
                    </div>
                    <div className="pt-6 border-t border-slate-200 border-dashed">
                      <span className="text-[9px] font-bold text-slate-400 tracking-wider uppercase block mb-3">GEMINI RECOMMENDED DRILL</span>
                      <div className="bg-slate-50 border border-slate-200 hover:border-purple-300 p-3 rounded-xl flex items-start gap-3 cursor-pointer transition-colors duration-300 group">
                        <div className="p-2 bg-purple-100 rounded-lg text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors"><FileText className="w-4 h-4" /></div>
                        <div className="flex-1"><h5 className="text-slate-900 text-xs font-bold mb-0.5 group-hover:text-purple-700 transition-colors">Advanced Matrix Reasoning 2.0</h5><p className="text-[10px] text-slate-500 font-medium">Video Guide • 12 mins</p></div>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-600 transition-colors mt-0.5" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8 max-w-5xl mx-auto animate-fade-in">
            <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 flex flex-col lg:flex-row">
              <div className="p-8 pt-12 lg:p-10 lg:w-1/2 flex flex-col justify-start relative">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-100/50 to-transparent pointer-events-none" />
                <Badge className="w-fit mb-4 bg-indigo-100 text-indigo-700 border-indigo-200 px-3 py-1 font-semibold tracking-wide text-[10px]">QUESTION OF THE DAY</Badge>
                <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-4">Experience the AI Rigor</h2>
                <p className="text-base text-slate-600 mb-8 leading-relaxed">Our questions aren't just from a bank. They are procedurally generated to match the specific difficulty curves of elite assessment providers like SHL, Kenexa, and Cubiks.</p>
                <div className="flex flex-wrap items-center gap-3">
                  <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-4 h-auto rounded-xl text-sm font-semibold shadow-md shadow-indigo-500/20 transition-all duration-300">Try This Question</Button>
                  <Button variant="ghost" className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 px-4 py-4 h-auto rounded-xl text-sm font-semibold transition-all duration-300">Explain Solution</Button>
                </div>
              </div>
              <div className="p-6 lg:p-8 lg:w-1/2 bg-slate-50/50 border-l border-slate-200 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-200/40 via-transparent to-transparent pointer-events-none" />
                <div className="bg-white border border-slate-200 rounded-2xl p-5 lg:p-6 w-full max-w-md shadow-xl shadow-slate-200/80 relative overflow-hidden transform transition-transform hover:scale-[1.02] duration-500">
                  <div className="flex justify-between items-center mb-5"><span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">Question #204 - Numerical</span><Badge variant="outline" className="text-slate-600 border-slate-300 bg-slate-50 text-[10px] px-2 py-0">Hard</Badge></div>
                  <p className="text-slate-900 text-sm mb-6 leading-relaxed font-bold">If Company A's revenue grew by 15% in Q1 and declined by 8% in Q2, while its operating costs remained constant at 60% of original Q1 revenue, what is the net profit margin percentage at the end of Q2?</p>
                  <div className="space-y-2">
                    {['4.25%', '6.70%', '12.4%', '8.10%'].map((opt, i) => {
                      const isSelected = selectedQOTDOption === i;
                      return (
                        <div key={i} onClick={() => setSelectedQOTDOption(i)} className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all duration-300 group ${isSelected ? "border-indigo-500 bg-indigo-50 shadow-sm" : "border-slate-200 bg-white hover:bg-slate-50 hover:border-indigo-300"}`}>
                          <span className={`text-sm font-bold transition-colors ${isSelected ? "text-indigo-900" : "text-slate-600 group-hover:text-slate-900"}`}>{opt}</span>
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors bg-white ${isSelected ? "border-indigo-500" : "border-slate-300 group-hover:border-indigo-400"}`}>
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

      <footer className="relative border-t border-slate-200 py-12 px-4 bg-white/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-sky-500 rounded-xl shadow-md"><Brain className="h-6 w-6 text-white" /></div>
              <div><span className="text-xl font-bold text-slate-900">Aptitude<span className="text-sky-500">AI</span></span><p className="text-sm text-slate-500 font-medium">Professional Career Development</p></div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-slate-600 font-medium text-sm mb-1">Powered by Advanced AI Technology</p>
              <p className="text-slate-400 text-xs">© 2026 AptitudeAI. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes shimmer { 0% { background-position: -1000px 0; } 100% { background-position: 1000px 0; } }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-down { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-shimmer { background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent); background-size: 1000px 100%; animation: shimmer 2s infinite; }
        .animate-fade-in { animation: fade-in 1s ease-out; }
        .animate-slide-down { animation: slide-down 0.3s ease-out; }
        .animate-scale-in { animation: scale-in 0.3s ease-out; }
      `}</style>
    </div>
  )
}