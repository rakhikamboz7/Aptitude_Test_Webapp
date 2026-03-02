import React, { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Progress } from "../components/ui/progress"
import { Badge } from "../components/ui/badge"
import { Navigation } from "../components/navigation"
import { Clock, CheckCircle2, Save, Brain, ArrowRight, ArrowLeft, Send, Loader2, Building2, Target } from "lucide-react"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

const getAnsweredCount = (selectedAnswers) => Object.keys(selectedAnswers).length

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
}

export default function QuizPage() {
  const navigate = useNavigate()

  // quizState holds: assessmentId, questions, totalQuestions, timeLimit, difficulty, companyName
  const [quizState, setQuizState]                   = useState(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers]        = useState({})  // { questionIndex: "A"|"B"|"C"|"D" }
  const [timeRemaining, setTimeRemaining]            = useState(0)
  const [isLoading, setIsLoading]                    = useState(true)
  const [error, setError]                            = useState(null)
  const [isSubmitting, setIsSubmitting]              = useState(false)
  const startTimeRef                                 = useRef(0) // useRef avoids ESLint unused-var + no re-render needed
  const [showSubmitConfirm, setShowSubmitConfirm]    = useState(false)
  const [autoSaveStatus, setAutoSaveStatus]          = useState("")
  const [criticalTimeWarning, setCriticalTimeWarning] = useState(false)
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(true)

  const warningShownRef      = useRef(false)
  const timerRef             = useRef(null)
  const autoSaveIntervalRef  = useRef(null)

  // ─── Timer ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (timeRemaining > 0 && quizState) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            submitQuiz()
            return 0
          }
          if (prev === 300 && !warningShownRef.current) {
            setCriticalTimeWarning(true)
            warningShownRef.current = true
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timerRef.current)
    }
  }, [timeRemaining, quizState])

  // ─── Load quiz from backend ────────────────────────────────────────────────
  useEffect(() => {
    const loadQuiz = async () => {
      try {
        setIsGeneratingQuestions(true)

        const difficulty  = localStorage.getItem("selectedDifficulty") || "medium"
        const companyName = localStorage.getItem("selectedCompany")    || "general"

        const token = localStorage.getItem("token") || ""

        const controller = new AbortController()
        const timeoutId  = setTimeout(() => controller.abort(), 30000) // 30s timeout

        const response = await fetch(`${API_URL}/api/assessments/start`, {
          method:  "POST",
          headers: {
            "Content-Type":  "application/json",
            Authorization:   `Bearer ${token}`,
          },
          body:   JSON.stringify({ companyName, difficulty }), // ✅ correct field name
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        // ✅ Backend returns: { success, assessmentId, questions, totalQuestions, timeLimit, difficulty, companyName }
        const data = await response.json()

        if (!data.success) {
          setError(data.error || "Failed to load quiz questions")
          return
        }

        // ✅ Flat response — no data.data nesting
        setQuizState({
          assessmentId:   data.assessmentId,
          questions:      data.questions,       // already stripped of correctAnswer
          totalQuestions: data.totalQuestions,
          timeLimit:      data.timeLimit,
          difficulty:     data.difficulty,
          companyName:    data.companyName,
        })

        setTimeRemaining(data.timeLimit)        // ✅ was data.data.timeLimit (crash)
        startTimeRef.current = Date.now()

      } catch (err) {
        console.error("Quiz loading error:", err)
        if (err.name === "AbortError") {
          setError("Loading timeout. Please check your connection and try again.")
        } else {
          setError("Network error. Please check your connection and try again.")
        }
      } finally {
        setIsLoading(false)
        setIsGeneratingQuestions(false)
      }
    }

    loadQuiz()
  }, [])

  // ─── Auto-save answers to localStorage ────────────────────────────────────
  useEffect(() => {
    if (quizState && Object.keys(selectedAnswers).length > 0) {
      autoSaveIntervalRef.current = setInterval(() => {
        localStorage.setItem(`quiz_${quizState.assessmentId}_answers`, JSON.stringify(selectedAnswers))
        setAutoSaveStatus("Answers saved")
        setTimeout(() => setAutoSaveStatus(""), 2000)
      }, 30000)
      return () => clearInterval(autoSaveIntervalRef.current)
    }
  }, [selectedAnswers, quizState])

  // ─── Select answer ─────────────────────────────────────────────────────────
  // selectedAnswers = { 0: "A", 1: "C", 3: "B" }  (key = questionIndex)
  const handleAnswerSelect = (letterAnswer) => {
    if (!quizState) return
    const newAnswers = { ...selectedAnswers, [currentQuestionIndex]: letterAnswer }
    setSelectedAnswers(newAnswers)
    localStorage.setItem(`quiz_${quizState.assessmentId}_answers`, JSON.stringify(newAnswers))
  }

  // ─── Submit quiz ───────────────────────────────────────────────────────────
  const submitQuiz = async () => {
    if (isSubmitting) return
    clearInterval(timerRef.current)
    setIsSubmitting(true)
    setShowSubmitConfirm(false)

    try {
      // Build answers array for backend: [{ questionIndex, selectedAnswer }]
      // ✅ Backend expects selectedAnswer as "A"|"B"|"C"|"D"|null
      const answers = quizState.questions.map((_, index) => ({
        questionIndex:  index,
        selectedAnswer: selectedAnswers[index] || null,
      }))

      const token = localStorage.getItem("token") || ""

      const response = await fetch(
        `${API_URL}/api/assessments/${quizState.assessmentId}/submit`,
        {
          method:  "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization:  `Bearer ${token}`,
          },
          body: JSON.stringify({ answers }),
        }
      )

      const data = await response.json()

      if (!data.success) {
        setError(data.error || "Failed to submit quiz. Please try again.")
        setIsSubmitting(false)
        return
      }

      // ✅ Backend returns: { success, result: { score, accuracy, correctAnswers, totalQuestions, totalTime, badge, feedback } }
      const result = data.result

      // Save to localStorage for ResultsPage to read
      localStorage.removeItem(`quiz_${quizState.assessmentId}_answers`)
      localStorage.setItem("quizResults", JSON.stringify(result))

      // Also save to progressHistory for ProgressPage fallback
      const history = JSON.parse(localStorage.getItem("progressHistory") || "[]")
      history.unshift({
        score:      result.score,
        difficulty: quizState.difficulty,
        timeSpent:  result.totalTime || 0,
        company:    quizState.companyName || "general",
        badge:      result.badge || null,
        breakdown:  { byTopic: result.feedback?.topicBreakdown || {} },
        date:       new Date().toISOString(),
      })
      localStorage.setItem("progressHistory", JSON.stringify(history.slice(0, 20)))

      navigate("/results")
    } catch (err) {
      console.error("Quiz submission error:", err)
      setError("Network error during submission. Please try again.")
      setIsSubmitting(false)
    }
  }

  const handleManualSave = () => {
    if (quizState && Object.keys(selectedAnswers).length > 0) {
      localStorage.setItem(`quiz_${quizState.assessmentId}_answers`, JSON.stringify(selectedAnswers))
      setAutoSaveStatus("Answers saved manually")
      setTimeout(() => setAutoSaveStatus(""), 3000)
    }
  }

  const goToNextQuestion     = () => setCurrentQuestionIndex((i) => Math.min(i + 1, quizState.totalQuestions - 1))
  const goToPreviousQuestion = () => setCurrentQuestionIndex((i) => Math.max(i - 1, 0))

  const handleEarlySubmit = () => {
    const unanswered = quizState.totalQuestions - getAnsweredCount(selectedAnswers)
    if (unanswered > 0) setShowSubmitConfirm(true)
    else submitQuiz()
  }

  // ─── Loading state ─────────────────────────────────────────────────────────
  if (isLoading || isGeneratingQuestions) {
    const company = localStorage.getItem("selectedCompany") || "general"
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-6 px-4">
          <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto" />
          <div>
            <h2 className="text-3xl font-bold mb-2">Generating Your Assessment</h2>
            <p className="text-xl text-muted-foreground mb-4">
              {company !== "general" && `${company.toUpperCase()} — `}
              Creating 15 personalized questions...
            </p>
          </div>
          <div className="w-80 mx-auto">
            <Progress value={isGeneratingQuestions ? 65 : 95} className="h-3" />
          </div>
          <p className="text-sm text-muted-foreground">
            Tailoring questions to your selected difficulty level
          </p>
        </div>
      </div>
    )
  }

  // ─── Error state ───────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="max-w-md mx-auto shadow-xl">
          <CardHeader>
            <CardTitle className="text-destructive">Error Loading Assessment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{error}</p>
            <Button onClick={() => window.location.reload()} className="w-full">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!quizState) return null

  const currentQuestion = quizState.questions[currentQuestionIndex]
  const progress        = ((currentQuestionIndex + 1) / quizState.totalQuestions) * 100
  const answeredCount   = getAnsweredCount(selectedAnswers)

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {criticalTimeWarning && (
        <div className="bg-destructive text-destructive-foreground p-4 text-center animate-pulse">
          <p className="font-semibold">⚠️ Only 5 minutes remaining! Consider submitting your test soon.</p>
          <Button variant="secondary" size="sm" className="mt-2" onClick={() => setCriticalTimeWarning(false)}>
            Dismiss
          </Button>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center space-x-3">
                <Brain className="h-8 w-8 text-primary" />
                <span>
                  {quizState.companyName !== "general" && (
                    <span className="text-primary">{quizState.companyName.toUpperCase()} </span>
                  )}
                  Assessment
                </span>
              </h1>
              <p className="text-muted-foreground mt-2 flex items-center space-x-2">
                <Target className="h-4 w-4" />
                <span>Question {currentQuestionIndex + 1} of {quizState.totalQuestions}</span>
              </p>
            </div>
            <div className="flex items-center space-x-3 mt-4 sm:mt-0">
              {quizState.companyName !== "general" && (
                <Badge variant="outline" className="px-3 py-1 flex items-center space-x-1">
                  <Building2 className="h-3 w-3" />
                  <span className="capitalize">{quizState.companyName}</span>
                </Badge>
              )}
              <Badge variant="outline" className="text-sm capitalize px-3 py-1">
                {quizState.difficulty}
              </Badge>
              <div
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-mono ${
                  timeRemaining < 300
                    ? "bg-destructive/20 text-destructive animate-pulse"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <Clock className="h-5 w-5" />
                <span className="text-xl font-bold">{formatTime(timeRemaining)}</span>
              </div>
            </div>
          </div>

          <Progress value={progress} className="mb-4 h-3" />

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="px-3 py-1">
                {answeredCount}/{quizState.totalQuestions} answered
              </Badge>
              <span className="text-muted-foreground">
                Topic: <span className="font-medium capitalize text-foreground">{currentQuestion.topic}</span>
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {autoSaveStatus && (
                <div className="flex items-center space-x-1 text-xs text-green-600 bg-green-50 px-3 py-1 rounded-lg">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>{autoSaveStatus}</span>
                </div>
              )}
              <Button variant="outline" size="sm" onClick={handleManualSave} className="h-8 px-3">
                <Save className="h-3 w-3 mr-1" />
                Save
              </Button>
            </div>
          </div>
        </div>

        {/* Question Card */}
        <Card className="mb-6 shadow-2xl border-2">
          <CardHeader className="pb-4 bg-muted/30">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-xl leading-relaxed mb-2">
                  {currentQuestion.questionText}
                </CardTitle>
                <CardDescription className="text-base">
                  Select the best answer from the options below.
                </CardDescription>
              </div>
              <Badge variant="outline" className="ml-4">Q{currentQuestionIndex + 1}</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => {
                const letter = ["A", "B", "C", "D"][index]
                const isSelected = selectedAnswers[currentQuestionIndex] === letter
                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(letter)}
                    className={`w-full p-5 text-left rounded-xl border-2 transition-all duration-200 hover:scale-[1.02] ${
                      isSelected
                        ? "border-primary bg-primary/10 shadow-lg ring-2 ring-primary/20"
                        : "border-border hover:border-primary/50 hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                          isSelected
                            ? "border-primary bg-primary text-primary-foreground scale-110"
                            : "border-muted-foreground"
                        }`}
                      >
                        {isSelected
                          ? <CheckCircle2 className="h-5 w-5" />
                          : <span className="text-sm font-bold">{letter}</span>
                        }
                      </div>
                      <span className="text-base font-medium flex-1">{option}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Navigation Controls */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={goToPreviousQuestion}
              disabled={currentQuestionIndex === 0}
              size="lg"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>

            {currentQuestionIndex < quizState.totalQuestions - 1 ? (
              <Button onClick={goToNextQuestion} size="lg">
                Next
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button
                onClick={handleEarlySubmit}
                className="bg-green-600 hover:bg-green-700"
                size="lg"
              >
                <Send className="h-4 w-4 mr-1" />
                Submit Test
              </Button>
            )}
          </div>

          <Button
            variant="destructive"
            onClick={handleEarlySubmit}
            disabled={isSubmitting}
            size="lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Submit Early
              </>
            )}
          </Button>
        </div>

        {/* Submit Confirmation Modal */}
        {showSubmitConfirm && (
          <div className="fixed inset-0 bg-slate-100/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
            <Card className="max-w-md w-full shadow-2xl">
              <CardHeader>
                <CardTitle className="text-xl">Submit Test Early?</CardTitle>
                <CardDescription className="text-base">
                  You have answered {answeredCount} out of {quizState.totalQuestions} questions.
                  {answeredCount < quizState.totalQuestions && (
                    <span className="block mt-2 text-amber-600 font-medium">
                      ⚠️ {quizState.totalQuestions - answeredCount} questions will be marked as unanswered.
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3 justify-end">
                  <Button variant="outline" onClick={() => setShowSubmitConfirm(false)}>
                    Continue Test
                  </Button>
                  <Button onClick={submitQuiz} disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Submit Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}