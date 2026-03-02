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
        <div className="mb-8 border-b border-slate-200 pb-5">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
            {user ? (
              <>Hi, <span className="text-blue-600 capitalize">{user?.name?.split(" ")[0] || "Student"}</span>!</>
            ) : (
              "Employability Assessment"
            )}
          </h1>
          <p className="text-slate-500 text-sm mt-1.5 font-medium">
            {user ? "You are ready for your mock assessment." : "Test your logic and problem-solving skills."}
          </p>
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
                    <h2 className="text-xl font-bold text-slate-900">{currentQ.category}</h2>
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
                <Card className="bg-white border-slate-200 shadow-md rounded-2xl overflow-hidden mb-5">
                  <div className="p-6 md:p-8">
                    <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100 border-none px-3 py-1 mb-4 text-[10px] uppercase tracking-wider font-bold">
                      Professional Scenario
                    </Badge>
                    
                    <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-6 leading-relaxed">
                      {currentQ.question}
                    </h3>

                    <div className="space-y-2.5">
                      {currentQ.options.map((opt, i) => {
                        const isSelected = answers[currentIdx] === i
                        return (
                          <button
                            key={i}
                            onClick={() => handleSelectOption(i)}
                            className={`w-full text-left p-3.5 rounded-xl border-2 transition-all duration-200 flex items-center justify-between group ${
                              isSelected 
                                ? "border-blue-600 bg-blue-50/50 shadow-sm" 
                                : "border-slate-200 hover:border-blue-300 hover:bg-slate-50"
                            }`}
                          >
                            <span className={`text-sm font-medium ${isSelected ? "text-blue-900 font-bold" : "text-slate-700"}`}>
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