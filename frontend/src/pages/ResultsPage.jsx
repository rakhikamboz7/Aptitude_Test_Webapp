"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Progress } from "../components/ui/progress"
import { Navigation } from "../components/navigation"
import {
  Trophy,
  Target,
  TrendingUp,
  Brain,
  CheckCircle2,
  RotateCcw,
  BookOpen,
  Lightbulb,
  Star,
  Award,
} from "lucide-react"

export default function ResultsPage() {
  const navigate = useNavigate()
  const [results, setResults] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedResults = localStorage.getItem("quizResults")
    if (savedResults) {
      try {
        const parsedResults = JSON.parse(savedResults)
        setResults(parsedResults)
      } catch (error) {
        console.error("Error parsing results:", error)
        navigate("/")
      }
    } else {
      navigate("/")
    }
    setIsLoading(false)
  }, [navigate])

  const handleRetakeTest = () => {
    localStorage.removeItem("quizResults")
    navigate("/")
  }

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBadgeVariant = (score) => {
    if (score >= 80) return "default"
    if (score >= 60) return "secondary"
    return "destructive"
  }

  const getPerformanceMessage = (score) => {
    if (score >= 90) return "Outstanding Performance! 🎉"
    if (score >= 80) return "Excellent Work! 👏"
    if (score >= 70) return "Good Job! 👍"
    if (score >= 60) return "Fair Performance 📚"
    return "Keep Practicing! 💪"
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg text-muted-foreground">Loading your results...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle className="text-center">No Results Found</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">No quiz results were found. Please take a test first.</p>
              <Button onClick={() => navigate("/")} className="w-full">
                Start New Test
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const { score, correctAnswers, totalQuestions, timeSpent, feedback, detailedResults } = results

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-4 bg-primary/10 rounded-full">
              <Trophy className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Test Results</h1>
          <p className="text-lg text-muted-foreground">{getPerformanceMessage(score)}</p>
        </div>

        {/* Score Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="text-center">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Overall Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-4xl font-bold mb-2 ${getScoreColor(score)}`}>{score}%</div>
              <Badge variant={getScoreBadgeVariant(score)} className="text-xs">
                {score >= 80 ? "Excellent" : score >= 60 ? "Good" : "Needs Improvement"}
              </Badge>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Correct Answers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold mb-2 text-green-600">{correctAnswers}</div>
              <p className="text-sm text-muted-foreground">out of {totalQuestions}</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Time Taken</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold mb-2 text-blue-600">{timeSpent}</div>
              <p className="text-sm text-muted-foreground">minutes</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Accuracy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold mb-2 text-purple-600">
                {Math.round((correctAnswers / totalQuestions) * 100)}%
              </div>
              <p className="text-sm text-muted-foreground">precision</p>
            </CardContent>
          </Card>
        </div>

        {/* AI Feedback Section */}
        {feedback && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Overall Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-primary" />
                  <span>AI Performance Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed mb-4">{feedback.overallSummary}</p>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-green-600 mb-2 flex items-center">
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Strengths
                    </h4>
                    <ul className="space-y-1">
                      {feedback.strengths?.map((strength, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start">
                          <Star className="h-3 w-3 mr-2 mt-1 text-yellow-500 flex-shrink-0" />
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-orange-600 mb-2 flex items-center">
                      <Target className="h-4 w-4 mr-2" />
                      Areas for Improvement
                    </h4>
                    <ul className="space-y-1">
                      {feedback.improvements?.map((improvement, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start">
                          <TrendingUp className="h-3 w-3 mr-2 mt-1 text-blue-500 flex-shrink-0" />
                          {improvement}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Topic Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <span>Topic Performance</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {feedback.topicBreakdown &&
                    Object.entries(feedback.topicBreakdown).map(([topic, stats]) => (
                      <div key={topic} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium capitalize">{topic}</span>
                          <Badge variant="outline" className="text-xs">
                            {stats.correct}/{stats.total} ({stats.percentage}%)
                          </Badge>
                        </div>
                        <Progress value={stats.percentage} className="h-2" />
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Recommendations */}
        {feedback?.recommendations && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                <span>Personalized Study Recommendations</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {feedback.recommendations.map((recommendation, index) => (
                  <div key={index} className="p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">{recommendation}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Motivational Message & Next Steps */}
        {feedback?.motivationalMessage && (
          <Card className="mb-8 bg-gradient-to-r from-primary/5 to-secondary/5">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-primary" />
                <span>Keep Going!</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4 leading-relaxed">{feedback.motivationalMessage}</p>
              {feedback.nextSteps && (
                <div>
                  <h4 className="font-semibold mb-2">Next Steps:</h4>
                  <ul className="space-y-1">
                    {feedback.nextSteps.map((step, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start">
                        <CheckCircle2 className="h-3 w-3 mr-2 mt-1 text-green-500 flex-shrink-0" />
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={handleRetakeTest} size="lg" className="text-lg px-8 py-4 h-auto">
            <RotateCcw className="h-5 w-5 mr-2" />
            Take Another Test
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/progress")}
            size="lg"
            className="text-lg px-8 py-4 h-auto bg-transparent"
          >
            <TrendingUp className="h-5 w-5 mr-2" />
            View Progress
          </Button>
        </div>
      </div>
    </div>
  )
}
