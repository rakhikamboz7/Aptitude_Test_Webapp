// import React, { useState, useEffect } from "react"
// import { useNavigate } from "react-router-dom"
// import { Button } from "../components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
// import { Badge } from "../components/ui/badge"
// import { Navigation } from "../components/navigation"
// import {
//   Brain,
//   Clock,
//   Target,
//   AlertCircle,
//   Coffee,
//   ChevronRight,
//   ChevronLeft,
//   CheckCircle2,
//   XCircle,
//   ListRestart,
//   Award,
//   Rocket,
//   FileText
// } from "lucide-react"

// // --- THE 15-QUESTION PROFESSIONAL BANK ---
// const QUESTION_BANK = [
//   {
//     category: "Logical Problem Solving",
//     question: "If a machine takes 5 minutes to cut 5 widgets, how many minutes would it take 100 machines to cut 100 widgets?",
//     options: ["100 minutes", "50 minutes", "5 minutes", "1 minute"],
//     correctOptionIndex: 2,
//     explanation: "It takes exactly one machine 5 minutes to make one widget. Therefore, 100 machines working simultaneously will make 100 widgets in 5 minutes."
//   },
//   {
//     category: "Data Interpretation",
//     question: "A company's revenue grew by 20% in 2022 and then decreased by 10% in 2023. What is the net percentage change in revenue over the two years?",
//     options: ["10% increase", "8% increase", "12% increase", "2% decrease"],
//     correctOptionIndex: 1,
//     explanation: "Let initial revenue = 100. After 20% increase = 120. A 10% decrease on 120 is 12. Final revenue = 120 - 12 = 108. Net change = +8%."
//   },
//   {
//     category: "Situational Judgment",
//     question: "You are nearing a critical project deadline, and a key API dependency from another team is delayed. What is the most professional immediate step?",
//     options: [
//       "Wait silently until the API team finishes their work.",
//       "Escalate immediately to the CEO.",
//       "Mock the API responses to continue frontend development and communicate the risk to stakeholders.",
//       "Redesign the entire application to avoid using the API."
//     ],
//     correctOptionIndex: 2,
//     explanation: "Mocking the dependency allows you to unblock your own progress while properly communicating risks without unnecessary panic."
//   },
//   {
//     category: "Algorithmic Thinking",
//     question: "Which data structure operates on a Last-In, First-Out (LIFO) principle?",
//     options: ["Queue", "Stack", "Linked List", "Binary Tree"],
//     correctOptionIndex: 1,
//     explanation: "A Stack follows the LIFO principle, similar to a stack of plates where the last plate placed is the first one removed."
//   },
//   {
//     category: "Quantitative Aptitude",
//     question: "If the price of a laptop is discounted by 25%, by what percentage must the new price be increased to return to the original price?",
//     options: ["25%", "33.33%", "30%", "20%"],
//     correctOptionIndex: 1,
//     explanation: "Let original price = $100. Discounted price = $75. To get back to $100, you need $25. $25 is 33.33% of $75."
//   },
//   {
//     category: "Professional Communication",
//     question: "A client reports a critical bug in production. You investigate and find it's a known issue that will take 3 days to fix. How should you respond?",
//     options: [
//       "Tell them it's their fault for using the software wrong.",
//       "Ignore the email until the bug is fixed.",
//       "Acknowledge the issue immediately, provide a brief explanation, and offer a realistic 3-day timeline.",
//       "Tell them it will be fixed in 1 hour to keep them happy."
//     ],
//     correctOptionIndex: 2,
//     explanation: "Transparency, immediate acknowledgment, and realistic timeline management are key to professional client communication."
//   },
//   {
//     category: "Logical Problem Solving",
//     question: "All programmers are analytical. Some analytical people are musicians. Therefore:",
//     options: [
//       "All programmers are musicians.",
//       "Some programmers are musicians.",
//       "All musicians are analytical.",
//       "None of the above conclusions are necessarily true."
//     ],
//     correctOptionIndex: 3,
//     explanation: "The premises do not guarantee that the overlap between analytical people and musicians includes programmers."
//   },
//   {
//     category: "Database Fundamentals",
//     question: "In a relational database, what is the primary purpose of a 'Foreign Key'?",
//     options: [
//       "To encrypt sensitive data.",
//       "To ensure data in a column is completely unique.",
//       "To establish a link between the data in two tables.",
//       "To automatically generate sequential ID numbers."
//     ],
//     correctOptionIndex: 2,
//     explanation: "A foreign key is a field (or collection of fields) in one table that uniquely identifies a row of another table, establishing a relationship."
//   },
//   {
//     category: "Quantitative Aptitude",
//     question: "A train running at a speed of 60 km/hr crosses a pole in 9 seconds. What is the length of the train?",
//     options: ["120 meters", "180 meters", "150 meters", "320 meters"],
//     correctOptionIndex: 2,
//     explanation: "Speed in m/s = 60 * (5/18) = 50/3 m/s. Length = Speed * Time = (50/3) * 9 = 150 meters."
//   },
//   {
//     category: "Systems Architecture",
//     question: "Which of the following is a primary benefit of using a Microservices architecture over a Monolith?",
//     options: [
//       "It is always easier and faster to set up initially.",
//       "It allows individual services to be scaled and deployed independently.",
//       "It guarantees zero latency between database calls.",
//       "It requires only one programming language for the entire backend."
//     ],
//     correctOptionIndex: 1,
//     explanation: "Microservices allow independent deployment and scaling, meaning a high-traffic service can be scaled without scaling the entire application."
//   },
//   {
//     category: "Logical Problem Solving",
//     question: "Look at this series: 2, 6, 18, 54, ... What number should come next?",
//     options: ["108", "148", "162", "216"],
//     correctOptionIndex: 2,
//     explanation: "This is a simple multiplication series. Each number is multiplied by 3 to get the next number (54 * 3 = 162)."
//   },
//   {
//     category: "Situational Judgment",
//     question: "You discover a major security vulnerability in your company's codebase just before a weekend. What do you do?",
//     options: [
//       "Wait until Monday so you don't ruin anyone's weekend.",
//       "Fix it yourself quietly without telling anyone.",
//       "Post about it on an external developer forum to warn people.",
//       "Immediately alert the security/engineering lead and follow the incident response protocol."
//     ],
//     correctOptionIndex: 3,
//     explanation: "Security issues require immediate, internal escalation through proper channels, regardless of the time or day."
//   },
//   {
//     category: "Software Engineering",
//     question: "What does the 'S' stand for in the SOLID principles of object-oriented design?",
//     options: ["Static Typing", "Single Responsibility", "Synchronous Processing", "Scalable Architecture"],
//     correctOptionIndex: 1,
//     explanation: "The Single Responsibility Principle states that a class should have one, and only one, reason to change."
//   },
//   {
//     category: "Data Interpretation",
//     question: "If an algorithm's execution time quadruples when the input size doubles, what is its likely time complexity?",
//     options: ["O(N)", "O(log N)", "O(N^2)", "O(2^N)"],
//     correctOptionIndex: 2,
//     explanation: "If input goes from N to 2N, and time goes from T to 4T, it indicates a quadratic relationship: (2N)^2 = 4(N^2)."
//   },
//   {
//     category: "Quantitative Aptitude",
//     question: "Working together, A and B can complete a task in 6 days. A alone can do it in 10 days. How many days would B take to do it alone?",
//     options: ["15 days", "12 days", "18 days", "20 days"],
//     correctOptionIndex: 0,
//     explanation: "A's 1-day work = 1/10. (A+B)'s 1-day work = 1/6. B's 1-day work = 1/6 - 1/10 = 5/30 - 3/30 = 2/30 = 1/15. So, B takes 15 days."
//   }
// ];

// export default function EmployabilityTestPage() {
//   const navigate = useNavigate()
//   const { user } = useAuth() // logout handled by Navigation

//   const [selectedCompany, setSelectedCompany]     = useState(null)
//   const [selectedDifficulty, setSelectedDifficulty] = useState("medium")
//   const [loading, setLoading]                     = useState(false)
//   const [mousePosition, setMousePosition]         = useState({ x: 0, y: 0 })
//   const [difficultyGauge, setDifficultyGauge]     = useState(50)

//   const canvasRef      = useRef(null)
//   const gaugeCanvasRef = useRef(null)

//   const companies = [
//     {
//       id: "tcs",
//       name: "TCS",
//       fullName: "Tata Consultancy Services",
//       color: "from-blue-600 to-indigo-700",
//       bgColor: "bg-blue-500/10",
//       borderColor: "border-blue-500/30",
//       icon: "💼",
//       description: "Technical & Analytical Focus",
//       testInfo: "30 mins | Numerical, Logical & Verbal",
//       difficulty: "Medium",
//       category: "Service Based",
//     },
//     {
//       id: "wipro",
//       name: "Wipro",
//       fullName: "Wipro Technologies",
//       color: "from-orange-600 to-red-600",
//       bgColor: "bg-orange-500/10",
//       borderColor: "border-orange-500/30",
//       icon: "⚡",
//       description: "Problem Solving & Logic",
//       testInfo: "25 mins | Aptitude & Reasoning",
//       difficulty: "Medium",
//       category: "Service Based",
//     },
//     {
//       id: "google",
//       name: "Google",
//       fullName: "Google LLC",
//       color: "from-red-600 to-pink-600",
//       bgColor: "bg-red-500/10",
//       borderColor: "border-red-500/30",
//       icon: "🔍",
//       description: "Advanced Algorithms",
//       testInfo: "45 mins | Coding & Analytics",
//       difficulty: "Hard",
//       category: "FAANG",
//     },
//     {
//       id: "amazon",
//       name: "Amazon",
//       fullName: "Amazon Inc.",
//       color: "from-amber-600 to-orange-600",
//       bgColor: "bg-amber-500/10",
//       borderColor: "border-amber-500/30",
//       icon: "📦",
//       description: "Leadership Principles",
//       testInfo: "40 mins | Behavioral & Technical",
//       difficulty: "Hard",
//       category: "FAANG",
//     },
//     {
//       id: "infosys",
//       name: "Infosys",
//       fullName: "Infosys Limited",
//       color: "from-cyan-600 to-blue-600",
//       bgColor: "bg-cyan-500/10",
//       borderColor: "border-cyan-500/30",
//       icon: "🌐",
//       description: "Aptitude & Reasoning",
//       testInfo: "30 mins | Quantitative & Logical",
//       difficulty: "Medium",
//       category: "Service Based",
//     },
//     {
//       id: "accenture",
//       name: "Accenture",
//       fullName: "Accenture PLC",
//       color: "from-purple-600 to-indigo-600",
//       bgColor: "bg-purple-500/10",
//       borderColor: "border-purple-500/30",
//       icon: "🎯",
//       description: "Cognitive Abilities",
//       testInfo: "35 mins | Abstract & Verbal",
//       difficulty: "Medium",
//       category: "Consulting",
//     },
//   ]

//   const difficultyLevels = [
//     {
//       id: "easy",
//       label: "Easy",
//       color: "from-emerald-600 to-teal-600",
//       bgColor: "bg-emerald-50",
//       borderColor: "border-emerald-300",
//       textColor: "text-emerald-600",
//       description: "Beginner friendly questions",
//       icon: "🎯",
//       gaugeValue: 25,
//     },
//     {
//       id: "medium",
//       label: "Normal",
//       color: "from-blue-600 to-sky-600",
//       bgColor: "bg-blue-50",
//       borderColor: "border-blue-300",
//       textColor: "text-blue-600",
//       description: "Standard difficulty level",
//       icon: "⚖️",
//       gaugeValue: 50,
//     },
//     {
//       id: "hard",
//       label: "Hard",
//       color: "from-red-600 to-orange-600",
//       bgColor: "bg-red-50",
//       borderColor: "border-red-300",
//       textColor: "text-red-600",
//       description: "Challenging advanced questions",
//       icon: "🔥",
//       gaugeValue: 85,
//     },
//   ]

//   // Mouse tracking for parallax
//   useEffect(() => {
//     const handleMouseMove = (e) => {
//       setMousePosition({
//         x: (e.clientX / window.innerWidth  - 0.5) * 20,
//         y: (e.clientY / window.innerHeight - 0.5) * 20,
//       })
//     }
//     window.addEventListener("mousemove", handleMouseMove)
//     return () => window.removeEventListener("mousemove", handleMouseMove)
//   }, [])

//   // Animated background particles (light blue tint)
//   useEffect(() => {
//     const canvas = canvasRef.current
//     if (!canvas) return
//     const ctx = canvas.getContext("2d")
//     canvas.width  = window.innerWidth
//     canvas.height = window.innerHeight

//     const particles = Array.from({ length: 40 }, () => ({
//       x:       Math.random() * canvas.width,
//       y:       Math.random() * canvas.height,
//       radius:  Math.random() * 2 + 1,
//       vx:      (Math.random() - 0.5) * 0.3,
//       vy:      (Math.random() - 0.5) * 0.3,
//       opacity: Math.random() * 0.4 + 0.1,
//     }))

//     function animate() {
//       ctx.clearRect(0, 0, canvas.width, canvas.height)
//       particles.forEach((p) => {
//         p.x += p.vx; p.y += p.vy
//         if (p.x < 0 || p.x > canvas.width)  p.vx *= -1
//         if (p.y < 0 || p.y > canvas.height) p.vy *= -1
//         ctx.beginPath()
//         ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
//         // ✅ Light theme: blue particles
//         ctx.fillStyle = `rgba(59, 130, 246, ${p.opacity})`
//         ctx.fill()
//       })
//       requestAnimationFrame(animate)
//     }
//     animate()

//     const handleResize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
//     window.addEventListener("resize", handleResize)
//     return () => window.removeEventListener("resize", handleResize)
//   }, [])

//   // Draw difficulty gauge (same logic, adapted colors for light bg)
//   useEffect(() => {
//     const canvas = gaugeCanvasRef.current
//     if (!canvas) return
//     const ctx = canvas.getContext("2d")
//     const dpr = window.devicePixelRatio || 1
//     canvas.width  = canvas.offsetWidth  * dpr
//     canvas.height = canvas.offsetHeight * dpr
//     ctx.scale(dpr, dpr)

//     const width   = canvas.offsetWidth
//     const height  = canvas.offsetHeight
//     const centerX = width  / 2
//     const centerY = height - 20
//     const radius  = Math.min(width, height) / 2 - 20

//     ctx.clearRect(0, 0, width, height)

//     // Background segments
//     const segments = [
//       { start: 0,    end: 0.33, color: "#10b981" },
//       { start: 0.33, end: 0.66, color: "#3b82f6" },
//       { start: 0.66, end: 1,    color: "#ef4444" },
//     ]
//     segments.forEach(({ start, end, color }) => {
//       ctx.beginPath()
//       ctx.arc(centerX, centerY, radius, Math.PI + start * Math.PI, Math.PI + end * Math.PI, false)
//       ctx.strokeStyle = color + "30"
//       ctx.lineWidth = 15
//       ctx.stroke()
//     })

//     // Active arc
//     const targetAngle = Math.PI + (difficultyGauge / 100) * Math.PI
//     let activeColor = "#10b981"
//     if (difficultyGauge > 66) activeColor = "#ef4444"
//     else if (difficultyGauge > 33) activeColor = "#3b82f6"
//     ctx.beginPath()
//     ctx.arc(centerX, centerY, radius, Math.PI, targetAngle, false)
//     ctx.strokeStyle = activeColor
//     ctx.lineWidth = 15
//     ctx.lineCap = "round"
//     ctx.stroke()

//     // Needle
//     const needleAngle  = Math.PI + (difficultyGauge / 100) * Math.PI
//     const needleLength = radius - 10
//     ctx.beginPath()
//     ctx.moveTo(centerX, centerY)
//     ctx.lineTo(centerX + Math.cos(needleAngle) * needleLength, centerY + Math.sin(needleAngle) * needleLength)
//     // ✅ Light theme: dark slate needle
//     ctx.strokeStyle = "#1e293b"
//     ctx.lineWidth = 3
//     ctx.stroke()

//     // Center dot
//     ctx.beginPath()
//     ctx.arc(centerX, centerY, 8, 0, Math.PI * 2)
//     ctx.fillStyle = "#1e293b"
//     ctx.fill()

//     // Labels
//     ctx.fillStyle = "#64748b"
//     ctx.font = "12px system-ui"
//     ctx.textAlign = "center"
//     ctx.fillText("easy",   centerX - radius + 30, centerY + 5)
//     ctx.fillText("normal", centerX,               centerY - radius + 30)
//     ctx.fillText("hard",   centerX + radius - 30, centerY + 5)
//   }, [difficultyGauge])

//   const handleStartEmployabilityTest = async () => {
//     if (!selectedCompany) {
//       alert("Please select a company first")
//       return
//     }
//     setLoading(true)
//     localStorage.setItem("selectedDifficulty", selectedDifficulty)
//     localStorage.setItem("selectedCompany", selectedCompany)
//     localStorage.setItem("isEmployabilityTest", "true")
//     setTimeout(() => navigate("/quiz"), 500)
//   }

//   const handleSelectOption = (optIdx) => {
//     setAnswers(prev => ({ ...prev, [currentIdx]: optIdx }))
//   }

//   const handleNext = () => {
//     if (currentIdx < questions.length - 1) {
//       setCurrentIdx(currentIdx + 1)
//     } else {
//       setIsFinished(true)
//     }
//   }

//   const handlePrev = () => {
//     if (currentIdx > 0) setCurrentIdx(currentIdx - 1)
//   }

//   // Calculate Score
//   const calculateScore = () => {
//     let score = 0
//     questions.forEach((q, idx) => {
//       if (answers[idx] === q.correctOptionIndex) score++
//     })
//     return score
//   }

//   if (questions.length === 0) return null

//   const currentQ = questions[currentIdx]
//   const progressPercent = ((currentIdx) / questions.length) * 100

//   return (
//     <div className="min-h-screen bg-slate-50 relative overflow-hidden font-sans">
//       {/* Canvas particles */}
//       <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none opacity-40" style={{ zIndex: 0 }} />

//       {/* ✅ Light gradient orbs with parallax */}
//       <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
//         <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-indigo-300/30 to-purple-300/30 rounded-full blur-3xl"
//           style={{ transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`, transition: "transform 0.5s ease-out" }} />
//         <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-300/30 to-cyan-300/30 rounded-full blur-3xl"
//           style={{ transform: `translate(${-mousePosition.x}px, ${-mousePosition.y}px)`, transition: "transform 0.5s ease-out" }} />
//       </div>

//       {/* ✅ Navigation component */}
//       <Navigation />

//       <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">

//         {/* Hero */}
//         <div className="text-center mb-12">
//           <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 px-6 py-3 rounded-full mb-8">
//             <Briefcase className="h-4 w-4 text-indigo-600" />
//             <span className="text-sm font-semibold text-indigo-700">Career Readiness Test</span>
//           </div>
//           {/* ✅ Light theme title */}
//           <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 mb-6">
//             Employability
//             <br />
//             <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600">
//               Assessment
//             </span>
//           </h1>
//           <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-medium">
//             Test your readiness for top tech company placements with company-specific questions and detailed performance analysis
//           </p>
//         </div>

//         {/* Info Banner */}
//         <Card className="mb-12 bg-white border-indigo-200 shadow-sm overflow-hidden relative">
//           <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
//           <CardContent className="p-8">
//             <div className="flex items-start gap-4">
//               <div className="p-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex-shrink-0 shadow-md">
//                 <Info className="h-6 w-6 text-white" />
//               </div>
//               <div>
//                 <h3 className="font-bold text-xl mb-3 text-slate-900">What is an Employability Test?</h3>
//                 <p className="text-slate-600 leading-relaxed">
//                   Our employability assessments simulate real company placement tests. Each test is tailored to match
//                   the specific requirements and question patterns of leading tech companies. You'll receive detailed
//                   feedback on your performance and areas for improvement.
//                 </p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Company Selection */}
//         <div className="mb-12">
//           <div className="text-center mb-8">
//             <h2 className="text-3xl font-bold text-slate-900 mb-3">Select Your Target Company</h2>
//             <p className="text-slate-500 font-medium">Choose the organization you're preparing for</p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {companies.map((company, index) => (
//               <button
//                 key={company.id}
//                 onClick={() => setSelectedCompany(company.id)}
//                 className={`group relative p-8 rounded-2xl border-2 transition-all duration-500 hover:scale-105 text-left overflow-hidden ${
//                   selectedCompany === company.id
//                     ? "border-transparent shadow-xl scale-105"
//                     : "border-slate-200 bg-white hover:border-blue-300 hover:shadow-md"
//                 }`}
//                 style={{ animation: `slideUp 0.5s ease-out ${index * 0.1}s backwards` }}
//               >
//                 {/* Gradient overlay when selected */}
//                 <div className={`absolute inset-0 bg-gradient-to-br ${company.color} transition-opacity duration-300 ${
//                   selectedCompany === company.id ? "opacity-100" : "opacity-0 group-hover:opacity-5"
//                 }`} />

//                 {/* Light bg when not selected */}
//                 {selectedCompany !== company.id && (
//                   <div className="absolute inset-0 bg-white" />
//                 )}

//                 <div className="relative z-10">
//                   <div className="flex items-start justify-between mb-4">
//                     <div className="text-5xl mb-3 transform group-hover:scale-110 transition-transform duration-300">
//                       {company.icon}
//                     </div>
//                     {selectedCompany === company.id && (
//                       <div className="animate-scale-in">
//                         <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
//                           <CheckCircle2 className="h-5 w-5 text-indigo-600" />
//                         </div>
//                       </div>
//                     )}
//                   </div>

//                   <div className={`font-bold text-2xl mb-2 ${selectedCompany === company.id ? "text-white" : "text-slate-900"}`}>
//                     {company.name}
//                   </div>
//                   <div className={`text-sm mb-4 ${selectedCompany === company.id ? "text-white/90" : "text-slate-500"}`}>
//                     {company.fullName}
//                   </div>

//                   <Badge className={`mb-4 ${
//                     selectedCompany === company.id
//                       ? "bg-white/20 text-white border-white/30"
//                       : "bg-slate-100 text-slate-600 border-slate-200"
//                   }`}>
//                     {company.category}
//                   </Badge>

//                   <div className={`mb-3 font-medium ${selectedCompany === company.id ? "text-white/90" : "text-slate-600"}`}>
//                     {company.description}
//                   </div>

//                   <div className="flex items-center gap-2">
//                     <Clock className={`h-4 w-4 ${selectedCompany === company.id ? "text-white/80" : "text-slate-400"}`} />
//                     <span className={`text-sm ${selectedCompany === company.id ? "text-white/90" : "text-slate-500"}`}>
//                       {company.testInfo}
//                     </span>
//                   </div>
//                 </div>

//                 {/* Shimmer effect */}
//                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Difficulty Gauge Section */}
//         <div className="mb-12">
//           <div className="text-center mb-8">
//             <h2 className="text-3xl font-bold text-slate-900 mb-3">Exam Level</h2>
//             <p className="text-slate-500 font-medium">Adjust the difficulty to match your skill level</p>
//           </div>

//           {/* ✅ Light theme gauge card */}
//           <Card className="bg-white border-slate-200 shadow-sm overflow-hidden relative max-w-2xl mx-auto">
//             <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-red-500" />
//             <CardContent className="p-8">
//               {/* Gauge Chart */}
//               <div className="mb-8">
//                 <canvas ref={gaugeCanvasRef} className="w-full h-48 mx-auto" />
//               </div>

//               {/* Difficulty Buttons */}
//               <div className="grid grid-cols-3 gap-4 mb-6">
//                 {difficultyLevels.map((level) => (
//                   <button
//                     key={level.id}
//                     onClick={() => {
//                       setSelectedDifficulty(level.id)
//                       setDifficultyGauge(level.gaugeValue)
//                     }}
//                     className={`p-6 rounded-xl border-2 transition-all duration-300 bg-white ${
//                       selectedDifficulty === level.id
//                         ? `${level.bgColor} ${level.borderColor} shadow-md scale-105`
//                         : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
//                     }`}
//                   >
//                     <div className="text-center">
//                       <div className="text-4xl mb-3">{level.icon}</div>
//                       <div className={`font-bold text-lg mb-2 ${selectedDifficulty === level.id ? level.textColor : "text-slate-700"}`}>
//                         {level.label}
//                       </div>
//                       <div className="text-xs text-slate-500 font-medium">{level.description}</div>
//                     </div>
//                   </button>
//                 ))}
//               </div>

//               {/* ✅ Light theme Start Button */}
//               <Button
//                 size="lg"
//                 onClick={handleStartEmployabilityTest}
//                 disabled={!selectedCompany || loading}
//                 className="w-full text-lg py-8 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/20 transition-all duration-300 group disabled:opacity-50"
//               >
//                 {loading ? (
//                   <div className="flex items-center gap-3">
//                     <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                     Loading...
//                   </div>
//                 ) : (
//                   <div className="flex items-center gap-3">
//                     <Rocket className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
//                     Start Test
//                     <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
//                   </div>
//                 )}
//               </Button>

//               {!selectedCompany && (
//                 <p className="text-sm text-center text-slate-400 mt-4 font-medium">Please select a company to continue</p>
//               )}
//             </CardContent>
//           </Card>
//         </div>

//         {/* Selected Company Details */}
//         {selectedCompanyData && (
//           <Card className="mb-12 bg-white border-slate-200 shadow-sm overflow-hidden relative max-w-4xl mx-auto">
//             <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
//             <CardHeader>
//               <div className="flex items-center gap-3">
//                 <div className="p-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-md">
//                   <Building2 className="h-6 w-6 text-white" />
//                 </div>
//                 <div>
//                   <CardTitle className="text-2xl text-slate-900">Test Preview: {selectedCompanyData.fullName}</CardTitle>
//                   <CardDescription className="text-slate-500 text-base">What to expect in this assessment</CardDescription>
//                 </div>
//               </div>
//             </CardHeader>
//             <CardContent>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 {[
//                   { icon: Target, label: "Focus Areas", value: selectedCompanyData.description },
//                   { icon: Clock,  label: "Duration",    value: "25 minutes (15 questions)"      },
//                   { icon: Award,  label: "Scoring",     value: "Earn badges based on performance" },
//                 ].map(({ icon: Icon, label, value }) => (
//                   <div key={label} className="flex items-start gap-3 p-5 bg-slate-50 rounded-xl border border-slate-200">
//                     <Icon className="h-5 w-5 text-indigo-500 mt-1 flex-shrink-0" />
//                     <div>
//                       <div className="font-bold text-slate-900 mb-1">{label}</div>
//                       <div className="text-sm text-slate-500 font-medium">{value}</div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         )}

//         {/* User Stats */}
//         {user && user.statistics && (
//           <Card className="bg-white border-slate-200 shadow-sm max-w-4xl mx-auto overflow-hidden relative">
//             <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
//             <CardHeader>
//               <div className="flex items-center gap-3">
//                 <div className="p-2.5 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-md">
//                   <TrendingUp className="h-5 w-5 text-white" />
//                 </div>
//                 <CardTitle className="text-xl text-slate-900">Your Performance Overview</CardTitle>
//               </div>
//             </CardHeader>
//             <CardContent>
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//                 {[
//                   { label: "Tests Taken",   value: user.statistics.totalAssessments },
//                   { label: "Avg Score",     value: `${user.statistics.averageScore}%` },
//                   { label: "Best Score",    value: `${user.statistics.bestScore}%`    },
//                   { label: "Badges Earned", value:
//                     (user.statistics.badgesEarned?.beginner     || 0) +
//                     (user.statistics.badgesEarned?.intermediate || 0) +
//                     (user.statistics.badgesEarned?.advanced     || 0)
//                   },
//                 ].map(({ label, value }) => (
//                   <div key={label} className="text-center p-5 bg-slate-50 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all duration-300">
//                     <div className="text-4xl font-bold text-indigo-600 mb-2">{value}</div>
//                     <div className="text-sm text-slate-500 font-medium">{label}</div>
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         )}
//       </main>

//       {/* Basic required styles */}
//       <style>{`
//         @keyframes slideUp {
//           from { opacity: 0; transform: translateY(20px); }
//           to   { opacity: 1; transform: translateY(0);    }
//         }
//         @keyframes scale-in {
//           from { transform: scale(0); }
//           to   { transform: scale(1); }
//         }
//         .animate-scale-in { animation: scale-in 0.3s ease-out; }
//       `}</style>
//     </div>
//   )
// }


import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Navigation } from "../components/navigation"
import { useAuth } from "../contexts/auth-context"
import {
  Brain,
  Clock,
  Target,
  AlertCircle,
  Coffee,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  XCircle,
  ListRestart,
  Award,
  Rocket,
  FileText
} from "lucide-react"

// --- THE 15-QUESTION PROFESSIONAL BANK ---
const QUESTION_BANK = [
  {
    category: "Logical Problem Solving",
    question: "If a machine takes 5 minutes to cut 5 widgets, how many minutes would it take 100 machines to cut 100 widgets?",
    options: ["100 minutes", "50 minutes", "5 minutes", "1 minute"],
    correctOptionIndex: 2,
    explanation: "It takes exactly one machine 5 minutes to make one widget. Therefore, 100 machines working simultaneously will make 100 widgets in 5 minutes."
  },
  {
    category: "Data Interpretation",
    question: "A company's revenue grew by 20% in 2022 and then decreased by 10% in 2023. What is the net percentage change in revenue over the two years?",
    options: ["10% increase", "8% increase", "12% increase", "2% decrease"],
    correctOptionIndex: 1,
    explanation: "Let initial revenue = 100. After 20% increase = 120. A 10% decrease on 120 is 12. Final revenue = 120 - 12 = 108. Net change = +8%."
  },
  {
    category: "Situational Judgment",
    question: "You are nearing a critical project deadline, and a key API dependency from another team is delayed. What is the most professional immediate step?",
    options: [
      "Wait silently until the API team finishes their work.",
      "Escalate immediately to the CEO.",
      "Mock the API responses to continue frontend development and communicate the risk to stakeholders.",
      "Redesign the entire application to avoid using the API."
    ],
    correctOptionIndex: 2,
    explanation: "Mocking the dependency allows you to unblock your own progress while properly communicating risks without unnecessary panic."
  },
  {
    category: "Algorithmic Thinking",
    question: "Which data structure operates on a Last-In, First-Out (LIFO) principle?",
    options: ["Queue", "Stack", "Linked List", "Binary Tree"],
    correctOptionIndex: 1,
    explanation: "A Stack follows the LIFO principle, similar to a stack of plates where the last plate placed is the first one removed."
  },
  {
    category: "Quantitative Aptitude",
    question: "If the price of a laptop is discounted by 25%, by what percentage must the new price be increased to return to the original price?",
    options: ["25%", "33.33%", "30%", "20%"],
    correctOptionIndex: 1,
    explanation: "Let original price = $100. Discounted price = $75. To get back to $100, you need $25. $25 is 33.33% of $75."
  },
  {
    category: "Professional Communication",
    question: "A client reports a critical bug in production. You investigate and find it's a known issue that will take 3 days to fix. How should you respond?",
    options: [
      "Tell them it's their fault for using the software wrong.",
      "Ignore the email until the bug is fixed.",
      "Acknowledge the issue immediately, provide a brief explanation, and offer a realistic 3-day timeline.",
      "Tell them it will be fixed in 1 hour to keep them happy."
    ],
    correctOptionIndex: 2,
    explanation: "Transparency, immediate acknowledgment, and realistic timeline management are key to professional client communication."
  },
  {
    category: "Logical Problem Solving",
    question: "All programmers are analytical. Some analytical people are musicians. Therefore:",
    options: [
      "All programmers are musicians.",
      "Some programmers are musicians.",
      "All musicians are analytical.",
      "None of the above conclusions are necessarily true."
    ],
    correctOptionIndex: 3,
    explanation: "The premises do not guarantee that the overlap between analytical people and musicians includes programmers."
  },
  {
    category: "Database Fundamentals",
    question: "In a relational database, what is the primary purpose of a 'Foreign Key'?",
    options: [
      "To encrypt sensitive data.",
      "To ensure data in a column is completely unique.",
      "To establish a link between the data in two tables.",
      "To automatically generate sequential ID numbers."
    ],
    correctOptionIndex: 2,
    explanation: "A foreign key is a field (or collection of fields) in one table that uniquely identifies a row of another table, establishing a relationship."
  },
  {
    category: "Quantitative Aptitude",
    question: "A train running at a speed of 60 km/hr crosses a pole in 9 seconds. What is the length of the train?",
    options: ["120 meters", "180 meters", "150 meters", "320 meters"],
    correctOptionIndex: 2,
    explanation: "Speed in m/s = 60 * (5/18) = 50/3 m/s. Length = Speed * Time = (50/3) * 9 = 150 meters."
  },
  {
    category: "Systems Architecture",
    question: "Which of the following is a primary benefit of using a Microservices architecture over a Monolith?",
    options: [
      "It is always easier and faster to set up initially.",
      "It allows individual services to be scaled and deployed independently.",
      "It guarantees zero latency between database calls.",
      "It requires only one programming language for the entire backend."
    ],
    correctOptionIndex: 1,
    explanation: "Microservices allow independent deployment and scaling, meaning a high-traffic service can be scaled without scaling the entire application."
  },
  {
    category: "Logical Problem Solving",
    question: "Look at this series: 2, 6, 18, 54, ... What number should come next?",
    options: ["108", "148", "162", "216"],
    correctOptionIndex: 2,
    explanation: "This is a simple multiplication series. Each number is multiplied by 3 to get the next number (54 * 3 = 162)."
  },
  {
    category: "Situational Judgment",
    question: "You discover a major security vulnerability in your company's codebase just before a weekend. What do you do?",
    options: [
      "Wait until Monday so you don't ruin anyone's weekend.",
      "Fix it yourself quietly without telling anyone.",
      "Post about it on an external developer forum to warn people.",
      "Immediately alert the security/engineering lead and follow the incident response protocol."
    ],
    correctOptionIndex: 3,
    explanation: "Security issues require immediate, internal escalation through proper channels, regardless of the time or day."
  },
  {
    category: "Software Engineering",
    question: "What does the 'S' stand for in the SOLID principles of object-oriented design?",
    options: ["Static Typing", "Single Responsibility", "Synchronous Processing", "Scalable Architecture"],
    correctOptionIndex: 1,
    explanation: "The Single Responsibility Principle states that a class should have one, and only one, reason to change."
  },
  {
    category: "Data Interpretation",
    question: "If an algorithm's execution time quadruples when the input size doubles, what is its likely time complexity?",
    options: ["O(N)", "O(log N)", "O(N^2)", "O(2^N)"],
    correctOptionIndex: 2,
    explanation: "If input goes from N to 2N, and time goes from T to 4T, it indicates a quadratic relationship: (2N)^2 = 4(N^2)."
  },
  {
    category: "Quantitative Aptitude",
    question: "Working together, A and B can complete a task in 6 days. A alone can do it in 10 days. How many days would B take to do it alone?",
    options: ["15 days", "12 days", "18 days", "20 days"],
    correctOptionIndex: 0,
    explanation: "A's 1-day work = 1/10. (A+B)'s 1-day work = 1/6. B's 1-day work = 1/6 - 1/10 = 5/30 - 3/30 = 2/30 = 1/15. So, B takes 15 days."
  }
];

export default function EmployabilityTestPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  
  // Test State
  const [hasStarted, setHasStarted] = useState(false)
  const [questions, setQuestions] = useState([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState({}) // maps question index to selected option index
  const [isFinished, setIsFinished] = useState(false)
  const [showSolutions, setShowSolutions] = useState(false)
  
  // Timer State (45 minutes = 2700 seconds)
  const [timeLeft, setTimeLeft] = useState(2700)

  // Initialize and Shuffle Questions on Mount
  useEffect(() => {
    const shuffled = [...QUESTION_BANK].sort(() => Math.random() - 0.5).slice(0, 15)
    setQuestions(shuffled)
  }, [])

  // Timer Logic: Only runs if the test HAS started and IS NOT finished
  useEffect(() => {
    if (!hasStarted || isFinished) return
    
    // Auto-submit if time runs out
    if (timeLeft <= 0) {
      setIsFinished(true)
      return
    }

    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000)
    return () => clearInterval(timer)
  }, [hasStarted, isFinished, timeLeft])

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const handleSelectOption = (optIdx) => {
    setAnswers(prev => ({ ...prev, [currentIdx]: optIdx }))
  }

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1)
    } else {
      setIsFinished(true)
    }
  }

  const handlePrev = () => {
    if (currentIdx > 0) setCurrentIdx(currentIdx - 1)
  }

  // Calculate Score
  const calculateScore = () => {
    let score = 0
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correctOptionIndex) score++
    })
    return score
  }

  if (questions.length === 0) return null

  const currentQ = questions[currentIdx]
  const progressPercent = ((currentIdx) / questions.length) * 100

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navigation />

      <main className="pt-24 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8 border-b border-slate-200 pb-4">
          
          {user && (
            <div className="hidden sm:flex items-center gap-3 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                {user.profile?.firstName?.[0] || 'U'}
              </div>
              <div className="text-sm">
                <p className="font-bold text-slate-900 leading-none">{user.profile?.firstName || 'User'}</p>
                <p className="text-slate-500 text-xs mt-0.5">Ready for assessment</p>
              </div>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-12 gap-8 mt-4">
          
          {/* LEFT SIDEBAR - 3 Hardcoded Cards */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Card 1: Test Overview */}
            <Card className="bg-white border-slate-200 shadow-sm rounded-2xl overflow-hidden">
              <div className="h-1.5 w-full bg-blue-500" />
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Target className="h-4 w-4 text-blue-500" />
                  Test Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 flex-1 text-center">
                    <p className="text-xs text-slate-500 font-medium mb-1">Time</p>
                    <p className="font-bold text-slate-900 text-sm">45 Mins</p>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 flex-1 text-center">
                    <p className="text-xs text-slate-500 font-medium mb-1">Items</p>
                    <p className="font-bold text-slate-900 text-sm">15 Qs</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card 2: Quick Tips */}
            <Card className="bg-white border-slate-200 shadow-sm rounded-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  Quick Tips for You
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-slate-600 font-medium">
                  <li className="flex gap-2">
                    <span className="text-amber-500">•</span>
                    Read each prompt carefully—clues are often hidden in the details!
                  </li>
                  <li className="flex gap-2">
                    <span className="text-amber-500">•</span>
                    Don't worry about being perfect; focus on showing your logic.
                  </li>
                  <li className="flex gap-2">
                    <span className="text-amber-500">•</span>
                    Keep going—small wins add up quickly!
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Card 3: Breather */}
            <Card className="bg-blue-50 border-blue-100 shadow-sm rounded-2xl text-center">
              <CardContent className="pt-6 pb-6">
                <Coffee className="h-8 w-8 text-blue-400 mx-auto mb-3" />
                <h3 className="font-bold text-slate-800 mb-1">Need a quick breather?</h3>
                <p className="text-xs text-slate-500 font-medium mb-4">
                  It's okay to take 2 minutes to stretch and relax.
                </p>
                <Button variant="outline" className="w-full bg-white border-blue-200 text-blue-600 hover:bg-blue-100 font-bold text-xs rounded-xl">
                  Take a short break
                </Button>
              </CardContent>
            </Card>

          </div>

          {/* RIGHT MAIN AREA */}
          <div className="lg:col-span-9">
            
            {!hasStarted ? (
              
              /* --- START SCREEN --- */
              <div className="animate-fade-in flex flex-col items-center justify-center h-full min-h-[500px]">
                <Card className="bg-white border-slate-200 shadow-lg rounded-3xl w-full max-w-2xl text-center p-12">
                  <div className="mx-auto w-20 h-20 bg-blue-50 border border-blue-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
                    <FileText className="h-10 w-10 text-blue-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-4">Employability Mock Test</h2>
                  <p className="text-lg text-slate-600 mb-8 max-w-lg mx-auto">
                    You are about to start a 15-question professional assessment. You will have exactly 45 minutes to complete the test. The timer will begin as soon as you click start.
                  </p>
                  <Button 
                    onClick={() => setHasStarted(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold px-10 py-6 rounded-xl shadow-md shadow-blue-500/20 transition-all hover:scale-105"
                  >
                    <Rocket className="h-5 w-5 mr-2" />
                    Start Mock Test
                  </Button>
                </Card>
              </div>

            ) : !isFinished ? (
              
              /* --- LIVE QUIZ INTERFACE --- */
              <div className="animate-fade-in">
                {/* Header & Timer */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6">
                  <div>
                    <p className="text-sm font-bold text-blue-600 mb-1">Question {currentIdx + 1} of {questions.length}</p>
                    <h2 className="text-2xl font-bold text-slate-900">{currentQ.category}</h2>
                  </div>
                  <div className="mt-4 sm:mt-0 flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg font-bold border border-red-100 shadow-sm">
                    <Clock className="h-4 w-4" />
                    {formatTime(timeLeft)}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                  <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
                    <span>You're doing great!</span>
                    <span>{Math.round(progressPercent)}% Completed</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Question Card */}
                <Card className="bg-white border-slate-200 shadow-lg rounded-3xl overflow-hidden mb-6">
                  <div className="p-8 md:p-10">
                    <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100 border-none px-3 py-1 mb-6 text-xs uppercase tracking-wider font-bold">
                      Professional Scenario
                    </Badge>
                    
                    <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-8 leading-relaxed">
                      {currentQ.question}
                    </h3>

                    <div className="space-y-3">
                      {currentQ.options.map((opt, i) => {
                        const isSelected = answers[currentIdx] === i
                        return (
                          <button
                            key={i}
                            onClick={() => handleSelectOption(i)}
                            className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between group ${
                              isSelected 
                                ? "border-blue-600 bg-blue-50/50 shadow-sm" 
                                : "border-slate-200 hover:border-blue-300 hover:bg-slate-50"
                            }`}
                          >
                            <span className={`font-medium ${isSelected ? "text-blue-900 font-bold" : "text-slate-700"}`}>
                              {opt}
                            </span>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                              isSelected ? "border-blue-600" : "border-slate-300 group-hover:border-blue-400"
                            }`}>
                              {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />}
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </Card>

                {/* Controls */}
                <div className="flex items-center justify-between pt-4">
                  <Button 
                    variant="outline" 
                    onClick={handlePrev} 
                    disabled={currentIdx === 0}
                    className="border-slate-200 text-slate-600 hover:bg-slate-100 rounded-xl px-6"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                  </Button>
                  
                  <div className="flex gap-3">
                    <Button 
                      variant="ghost" 
                      onClick={handleNext}
                      className="text-slate-500 hover:text-slate-700 font-semibold"
                    >
                      Skip for now
                    </Button>
                    <Button 
                      onClick={handleNext}
                      disabled={answers[currentIdx] === undefined && currentIdx === questions.length - 1}
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 shadow-md shadow-blue-500/20"
                    >
                      {currentIdx === questions.length - 1 ? "Submit Test" : "Next Question"} 
                      {currentIdx !== questions.length - 1 && <ChevronRight className="h-4 w-4 ml-1" />}
                    </Button>
                  </div>
                </div>
              </div>

            ) : (

              /* --- RESULTS INTERFACE --- */
              <div className="animate-fade-in max-w-2xl mx-auto">
                <div className="text-center mb-10">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full mb-6 shadow-sm border border-emerald-200">
                    <Award className="h-10 w-10 text-emerald-600" />
                  </div>
                  <h2 className="text-4xl font-bold text-slate-900 mb-4">Your Skills Journey So Far</h2>
                  <p className="text-lg text-slate-600 font-medium">
                    Great job completing the test! Here’s a look at your performance.
                  </p>
                </div>

                <Card className="bg-white border-slate-200 shadow-xl rounded-3xl overflow-hidden mb-8">
                  <div className="p-10 flex flex-col md:flex-row items-center justify-center gap-12">
                    
                    {/* Animated Score Circle */}
                    <div className="relative flex items-center justify-center w-48 h-48">
                      <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                        {/* Background Grey Track */}
                        <circle
                          cx="96" cy="96" r="84"
                          stroke="currentColor" strokeWidth="12" fill="none"
                          className="text-slate-100"
                        />
                        {/* Animated Blue Progress Line */}
                        <circle
                          cx="96" cy="96" r="84"
                          stroke="currentColor" strokeWidth="12" fill="none" strokeLinecap="round"
                          className="text-blue-500 animate-draw-circle"
                          style={{
                            strokeDasharray: 528,
                            "--target-offset": 528 - (calculateScore() / questions.length) * 528
                          }}
                        />
                      </svg>
                      <div className="text-center relative z-10">
                        <div className="text-5xl font-bold text-slate-900">{calculateScore()}</div>
                        <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Out of {questions.length}</div>
                      </div>
                    </div>
                    
                    <div className="text-center md:text-left">
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">
                        {calculateScore() >= 12 ? "Top Tier Performance!" : calculateScore() >= 8 ? "Solid Foundation" : "Keep Practicing"}
                      </h3>
                      <p className="text-slate-600 mb-6 max-w-xs">
                        {calculateScore() >= 12 
                          ? "You showed excellent logical reasoning and problem-solving skills." 
                          : "Review your answers below to discover areas for improvement."}
                      </p>
                      <div className="flex gap-3 justify-center md:justify-start">
                        <Button 
                          onClick={() => window.location.reload()} 
                          className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md"
                        >
                          <ListRestart className="h-4 w-4 mr-2" /> Try Again
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => setShowSolutions(!showSolutions)} 
                          className="border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl"
                        >
                          {showSolutions ? "Hide Solutions" : "View Solutions"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Dropdown Solutions List */}
                {showSolutions && (
                  <div className="animate-slide-down bg-slate-50 rounded-3xl border border-slate-200 p-2 shadow-inner max-h-[500px] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-400">
                    <div className="p-4 space-y-4">
                      <h4 className="font-bold text-lg text-slate-800 mb-4 px-2">Detailed Review</h4>
                      {questions.map((q, idx) => {
                        const userAns = answers[idx]
                        const isCorrect = userAns === q.correctOptionIndex
                        const skipped = userAns === undefined
                        
                        return (
                          <div key={idx} className={`p-5 rounded-2xl border ${isCorrect ? 'bg-emerald-50/50 border-emerald-100' : skipped ? 'bg-slate-100 border-slate-200' : 'bg-red-50/50 border-red-100'}`}>
                            <div className="flex gap-3">
                              <div className="mt-0.5">
                                {isCorrect ? <CheckCircle2 className="h-5 w-5 text-emerald-600" /> : skipped ? <AlertCircle className="h-5 w-5 text-slate-400" /> : <XCircle className="h-5 w-5 text-red-600" />}
                              </div>
                              <div>
                                <p className="font-bold text-slate-900 text-sm mb-2">Q{idx + 1}. {q.question}</p>
                                {!isCorrect && !skipped && (
                                  <p className="text-sm text-red-700 mb-1">
                                    <span className="font-bold">Your Answer:</span> {q.options[userAns]}
                                  </p>
                                )}
                                {skipped && (
                                  <p className="text-sm text-slate-500 mb-1 font-medium">
                                    Skipped
                                  </p>
                                )}
                                <p className="text-sm text-emerald-700 font-medium">
                                  <span className="font-bold">Correct Answer:</span> {q.options[q.correctOptionIndex]}
                                </p>
                                <p className="text-xs text-slate-600 mt-3 p-3 bg-white/60 rounded-lg border border-slate-200/50">
                                  <span className="font-bold">Explanation:</span> {q.explanation}
                                </p>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Basic required styles */}
      <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-down { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        
        /* Circle Drawing Animation */
        @keyframes draw-circle {
          from { stroke-dashoffset: 528; }
          to { stroke-dashoffset: var(--target-offset); }
        }
        
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
        .animate-slide-down { animation: slide-down 0.4s ease-out forwards; }
        .animate-draw-circle { animation: draw-circle 1.5s ease-out forwards; }
      `}</style>
    </div>
  )
}