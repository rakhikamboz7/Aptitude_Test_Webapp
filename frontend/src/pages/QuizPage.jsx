"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Progress } from "../components/ui/progress"
import { Badge } from "../components/ui/badge"
import { Navigation } from "../components/navigation"
import { Clock, CheckCircle2, Save, Brain, ArrowRight, ArrowLeft, Send, Loader2 } from "lucide-react"

// Declare getAnsweredCount function
const getAnsweredCount = (selectedAnswers, quizData) => {
  return Object.keys(selectedAnswers).length
}

// Declare formatTime function
const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
}

export default function QuizPage() {
  const navigate = useNavigate()
  const [quizData, setQuizData] = useState(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [startTime, setStartTime] = useState(0)
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false)
  const [autoSaveStatus, setAutoSaveStatus] = useState("")
  const [criticalTimeWarning, setCriticalTimeWarning] = useState(false)
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(true)
  const autoSaveIntervalRef = useRef(null)
  const warningShownRef = useRef(false)
  const timerRef = useRef(null)

  useEffect(() => {
    if (timeRemaining > 0 && quizData) {
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

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current)
        }
      }
    }
  }, [timeRemaining, quizData])

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        setIsGeneratingQuestions(true)
        const difficulty = localStorage.getItem("selectedDifficulty") || "medium"
        const topics = ["numerical", "logical", "verbal", "analytical"]

        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout

        const response = await fetch("http://localhost:5000/api/questions/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ difficulty, topics }),
          signal: controller.signal,
        })

        clearTimeout(timeoutId)
        const data = await response.json()

        if (data.success) {
          setQuizData(data.data)
          setTimeRemaining(data.data.timeLimit)
          setStartTime(Date.now())

          // Check for saved answers
          const savedAnswers = localStorage.getItem(`quiz_${data.data.sessionId}_answers`)
          if (savedAnswers) {
            setSelectedAnswers(JSON.parse(savedAnswers))
          }
        } else {
          setError(data.message || "Failed to load quiz questions")
        }
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

  useEffect(() => {
    if (quizData && Object.keys(selectedAnswers).length > 0) {
      autoSaveIntervalRef.current = setInterval(() => {
        localStorage.setItem(`quiz_${quizData.sessionId}_answers`, JSON.stringify(selectedAnswers))
        setAutoSaveStatus("Answers saved")
        setTimeout(() => setAutoSaveStatus(""), 2000)
      }, 30000)

      return () => {
        if (autoSaveIntervalRef.current) {
          clearInterval(autoSaveIntervalRef.current)
        }
      }
    }
  }, [selectedAnswers, quizData])

  const handleAnswerSelect = (answerIndex) => {
    if (!quizData) return

    const currentQuestion = quizData.questions[currentQuestionIndex]
    const newAnswers = {
      ...selectedAnswers,
      [currentQuestion.id]: answerIndex,
    }
    setSelectedAnswers(newAnswers)

    localStorage.setItem(`quiz_${quizData.sessionId}_answers`, JSON.stringify(newAnswers))
  }

  const submitQuiz = async () => {
    setIsSubmitting(true)
    setShowSubmitConfirm(false)

    try {
      const timeSpent = Math.round((Date.now() - startTime) / 1000)

      // Convert answers to array format matching question order
      const answersArray = quizData.questions.map((question) =>
        selectedAnswers[question.id] !== undefined ? ["A", "B", "C", "D"][selectedAnswers[question.id]] : null,
      )

      const response = await fetch("http://localhost:5000/api/feedback/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          answers: answersArray,
          questions: quizData.questions,
          difficulty: quizData.difficulty,
          timeSpent,
        }),
      })

      const results = await response.json()

      if (results.success) {
        localStorage.removeItem(`quiz_${quizData.sessionId}_answers`)
        localStorage.setItem("quizResults", JSON.stringify(results.data))
        navigate("/results")
      } else {
        setError(results.message || "Failed to submit quiz. Please try again.")
      }
    } catch (err) {
      console.error("Quiz submission error:", err)
      setError("Network error during submission. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleManualSave = () => {
    if (quizData && Object.keys(selectedAnswers).length > 0) {
      localStorage.setItem(`quiz_${quizData.sessionId}_answers`, JSON.stringify(selectedAnswers))
      setAutoSaveStatus("Answers saved manually")
      setTimeout(() => setAutoSaveStatus(""), 3000)
    }
  }

  const goToNextQuestion = () => {
    if (currentQuestionIndex < quizData.totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleEarlySubmit = () => {
    const unansweredCount = quizData.totalQuestions - answeredCount
    if (unansweredCount > 0) {
      setShowSubmitConfirm(true)
    } else {
      submitQuiz()
    }
  }

  if (isLoading || isGeneratingQuestions) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <h2 className="text-2xl font-semibold">Generating Your Aptitude Test</h2>
          <p className="text-muted-foreground">
            {isGeneratingQuestions ? "Creating 15 personalized questions..." : "Loading quiz interface..."}
          </p>
          <div className="w-64 mx-auto">
            <Progress value={isGeneratingQuestions ? 60 : 90} className="h-2" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-destructive">Error Loading Quiz</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} className="w-full">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!quizData) return null

  const currentQuestion = quizData.questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / quizData.totalQuestions) * 100
  const answeredCount = getAnsweredCount(selectedAnswers, quizData)

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {criticalTimeWarning && (
        <div className="bg-destructive text-destructive-foreground p-4 text-center">
          <p className="font-semibold">⚠️ Only 5 minutes remaining! Consider submitting your test soon.</p>
          <Button variant="secondary" size="sm" className="mt-2" onClick={() => setCriticalTimeWarning(false)}>
            Dismiss
          </Button>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quiz Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center space-x-2">
                <Brain className="h-8 w-8 text-primary" />
                <span>Aptitude Test</span>
              </h1>
              <p className="text-muted-foreground mt-1">
                Question {currentQuestionIndex + 1} of {quizData.totalQuestions}
              </p>
            </div>
            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              <Badge variant="outline" className="text-sm capitalize px-3 py-1">
                {quizData.difficulty}
              </Badge>
              <div
                className={`flex items-center space-x-2 px-3 py-1 rounded-lg ${
                  timeRemaining < 300 ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"
                }`}
              >
                <Clock className="h-4 w-4" />
                <span className="font-mono text-lg font-semibold">{formatTime(timeRemaining)}</span>
              </div>
              {autoSaveStatus && (
                <div className="flex items-center space-x-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                  <Save className="h-3 w-3" />
                  <span>{autoSaveStatus}</span>
                </div>
              )}
            </div>
          </div>

          <Progress value={progress} className="mb-4 h-2" />

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span className="flex items-center space-x-2">
              <span>Progress:</span>
              <Badge variant="secondary" className="text-xs">
                {answeredCount}/{quizData.totalQuestions} answered
              </Badge>
            </span>
            <div className="flex items-center space-x-4">
              <span>
                Topic: <span className="font-medium capitalize">{currentQuestion.topic}</span>
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleManualSave}
                className="text-xs h-7 px-2 bg-transparent"
              >
                <Save className="h-3 w-3 mr-1" />
                Save Progress
              </Button>
            </div>
          </div>
        </div>

        {/* Question Card */}
        <Card className="mb-8 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl leading-relaxed text-balance">{currentQuestion.question}</CardTitle>
            <CardDescription className="text-base">Select the best answer from the options below.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 hover:bg-muted/50 ${
                    selectedAnswers[currentQuestion.id] === index
                      ? "border-primary bg-primary/10 text-primary shadow-md"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedAnswers[currentQuestion.id] === index
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted-foreground"
                      }`}
                    >
                      {selectedAnswers[currentQuestion.id] === index && <CheckCircle2 className="h-4 w-4" />}
                    </div>
                    <span className="text-base font-medium">{String.fromCharCode(65 + index)}.</span>
                    <span className="text-base">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={goToPreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="flex items-center space-x-2 bg-transparent"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Previous</span>
            </Button>

            {currentQuestionIndex < quizData.totalQuestions - 1 ? (
              <Button onClick={goToNextQuestion} className="flex items-center space-x-2">
                <span>Next</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleEarlySubmit}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
              >
                <Send className="h-4 w-4" />
                <span>Submit Test</span>
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleManualSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Progress
            </Button>

            <Button variant="destructive" size="sm" onClick={handleEarlySubmit} disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
              Submit Early
            </Button>
          </div>
        </div>

        {showSubmitConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="max-w-md mx-4">
              <CardHeader>
                <CardTitle>Submit Test Early?</CardTitle>
                <CardDescription>
                  You have answered {answeredCount} out of {quizData.totalQuestions} questions.
                  {answeredCount < quizData.totalQuestions && (
                    <span className="block mt-2 text-amber-600">
                      {quizData.totalQuestions - answeredCount} questions will be marked as unanswered.
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setShowSubmitConfirm(false)}>
                    Continue Test
                  </Button>
                  <Button onClick={submitQuiz} disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
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
