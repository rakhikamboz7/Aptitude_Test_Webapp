import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card"
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
  Clock,
  Building2,
  Zap,
  ArrowRight,
} from "lucide-react"
// ADD THIS FUNCTION HERE:
const formatTime = (totalSeconds) => {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
}
export default function ResultsPage() {
  const navigate = useNavigate()
  const [results, setResults] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showBadgeCelebration, setShowBadgeCelebration] = useState(true)

  useEffect(() => {
    const savedResults = localStorage.getItem("quizResults")
    if (savedResults) {
      try {
        const parsedResults = JSON.parse(savedResults)
        setResults(parsedResults)
        
        // Auto-dismiss badge celebration after 5 seconds
        setTimeout(() => setShowBadgeCelebration(false), 5000)
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

  const getBadgeInfo = (badge) => {
    const badges = {
      beginner: {
        color: "bg-yellow-500",
        textColor: "text-yellow-700",
        bgLight: "bg-yellow-50",
        borderColor: "border-yellow-200",
        icon: <Award className="h-10 w-10 text-amber-600" />,
        title: "Beginner Badge",
        description: "Great start on your learning journey!",
      },
      intermediate: {
        color: "bg-blue-500",
        textColor: "text-blue-700",
        bgLight: "bg-blue-50",
        borderColor: "border-blue-200",
        icon: <Award className="h-10 w-10 text-slate-600" />,
        title: "Intermediate Badge",
        description: "Solid performance! You're progressing well!",
      },
      advanced: {
        color: "bg-purple-500",
        textColor: "text-purple-700",
        bgLight: "bg-purple-50",
        borderColor: "border-purple-200",
        icon: <Trophy className="h-10 w-10 text-yellow-600" />,
        title: "Advanced Badge",
        description: "Outstanding! You're mastering these concepts!",
      },
    }
    return badges[badge?.level] || badges.beginner
  }

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-blue-600"
    if (score >= 40) return "text-yellow-600"
    return "text-red-600"
  }

  const getPerformanceMessage = (score) => {
    if (score >= 90) return "Outstanding Performance!"
    if (score >= 80) return "Excellent Work!"
    if (score >= 70) return "Good Job!"
    if (score >= 60) return "Fair Performance"
    return "Keep Practicing!"
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg text-muted-foreground">Analyzing your results...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
        <Navigation />
        <div className="pt-24 flex-1 relative z-0">
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
          <Card className="max-w-md shadow-xl">
            <CardHeader>
              <CardTitle className="text-center">No Results Found</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-slate-500 font-medium mb-4">No quiz results were found. Please take a test first.</p>
              <Button onClick={() => navigate("/")} className="w-full">
                Start New Test
              </Button>
            </CardContent>
          </Card>
        </div>
        </div>
      </div>
    )
  }

  const { score, correctAnswers, totalQuestions, feedback, badge, company } = results
  
  // Check for both timeSpent (from history) and totalTime (from a fresh quiz)
  const displayTime = results.timeSpent !== undefined ? results.timeSpent : (results.totalTime || 0)

  const badgeInfo = getBadgeInfo(badge)

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <Navigation />
      <div className="pt-28 flex-1 relative z-0">
      {/* Badge Celebration Banner (Compact) */}
      {showBadgeCelebration && badge && (
        <div className={`${badgeInfo.bgLight} border-b ${badgeInfo.borderColor} py-2.5 px-4 shadow-sm animate-in slide-in-from-top z-10 relative`}>
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-white rounded-full shadow-sm [&>svg]:w-4 [&>svg]:h-4">
                {badgeInfo.icon}
              </div>
              <div className="text-left">
                <p className={`text-sm font-bold ${badgeInfo.textColor} leading-tight`}>
                   {badgeInfo.title} Earned! <span className="text-slate-600 font-medium ml-1 hidden sm:inline">— {badgeInfo.description}</span>
                </p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowBadgeCelebration(false)}
              className={`h-7 px-3 text-xs font-bold ${badgeInfo.textColor} hover:bg-white/60 transition-colors`}
            >
              Dismiss
            </Button>
          </div>
        </div>
      )}
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-4 bg-primary/10 rounded-full">
              <Trophy className="h-10 w-10 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Assessment Results</h1>
          <p className="text-xl text-muted-foreground mb-2">{getPerformanceMessage(score)}</p>
          {company && company !== "general" && (
            <Badge variant="outline" className="px-4 py-2 text-base">
              <Building2 className="h-4 w-4 mr-2" />
              {company.toUpperCase()} Assessment
            </Badge>
          )}
        </div>

        {/* Score Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="text-center bg-white border border-slate-200 shadow-sm rounded-2xl hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-center">
                <Target className="h-4 w-4 mr-2" />
                Overall Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-5xl font-bold mb-2 ${getScoreColor(score)}`}>{score}%</div>
              <Badge variant={score >= 80 ? "default" : score >= 60 ? "secondary" : "destructive"}>
                {score >= 80 ? "Excellent" : score >= 60 ? "Good" : "Needs Improvement"}
              </Badge>
            </CardContent>
          </Card>

          <Card className="text-center bg-white border border-slate-200 shadow-sm rounded-2xl hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Correct Answers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-bold mb-2 text-green-600">{correctAnswers}</div>
              <p className="text-sm text-muted-foreground">out of {totalQuestions}</p>
            </CardContent>
          </Card>

          <Card className="text-center bg-white border border-slate-200 shadow-sm rounded-2xl hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-center">
                <Clock className="h-4 w-4 mr-2" />
                Time Taken
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-bold mb-2 text-blue-600">{formatTime(displayTime)}</div>
              <p className="text-sm text-muted-foreground">mm : ss</p>
            </CardContent>
          </Card>

          <Card className="text-center bg-white border border-slate-200 shadow-sm rounded-2xl hover:shadow-md transition-shadow">
            <CardHeader className="pb-3 pt-6">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center justify-center">
                <Award className="h-4 w-4 mr-2" />
                Achievement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center mb-2">{badgeInfo.icon}</div>
              <p className={`text-sm font-semibold ${badgeInfo.textColor}`}>{badgeInfo.title}</p>
            </CardContent>
          </Card>
        </div>

        {/* AI Feedback Section */}
        {feedback && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Overall Summary */}
            <Card className="bg-white border border-slate-200 shadow-sm rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-blue-600" />
                  <span>AI Performance Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-500 font-medium leading-relaxed mb-6 text-base">{feedback.overallSummary}</p>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-green-600 mb-3 flex items-center text-lg">
                      <CheckCircle2 className="h-5 w-5 mr-2" />
                      Your Strengths
                    </h4>
                    <ul className="space-y-2">
                      {feedback.strengths?.map((strength, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start p-3 bg-green-50 rounded-lg">
                          <Star className="h-4 w-4 mr-2 mt-0.5 text-green-600 flex-shrink-0" />
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-orange-600 mb-3 flex items-center text-lg">
                      <Target className="h-5 w-5 mr-2" />
                      Areas for Growth
                    </h4>
                    <ul className="space-y-2">
                      {feedback.improvements?.map((improvement, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start p-3 bg-orange-50 rounded-lg">
                          <TrendingUp className="h-4 w-4 mr-2 mt-0.5 text-orange-600 flex-shrink-0" />
                          <span>{improvement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Topic Breakdown */}
            <Card className="bg-white border border-slate-200 shadow-sm rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <span>Topic Performance</span>
                </CardTitle>
                <CardDescription>Your accuracy across different question categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-5">
                  {feedback.topicBreakdown &&
                    Object.entries(feedback.topicBreakdown)
                      .sort(([, a], [, b]) => b.percentage - a.percentage)
                      .map(([topic, stats]) => (
                        <div key={topic} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold capitalize text-base">{topic}</span>
                            <div className="flex items-center space-x-3">
                              <span className="text-sm text-muted-foreground">
                                {stats.correct}/{stats.total}
                              </span>
                              <Badge
                                variant="outline"
                                className={`text-sm font-bold px-3 py-1 ${
                                  stats.percentage >= 80
                                    ? "bg-green-100 text-green-800 border-green-300"
                                    : stats.percentage >= 60
                                      ? "bg-blue-100 text-blue-800 border-blue-300"
                                      : "bg-yellow-100 text-yellow-800 border-yellow-300"
                                }`}
                              >
                                {stats.percentage}%
                              </Badge>
                            </div>
                          </div>
                          <Progress value={stats.percentage} className="h-3" />
                        </div>
                      ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Recommendations */}
        {feedback?.recommendations && (
          <Card className="mb-8 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-xl">
                <Lightbulb className="h-6 w-6 text-primary" />
                <span>Personalized Study Recommendations</span>
              </CardTitle>
              <CardDescription>Targeted advice to help you improve</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {feedback.recommendations.map((recommendation, index) => (
                  <div key={index} className="p-5 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl border border-border hover:shadow-md transition-shadow">
                    <div className="flex items-start space-x-3">
                      <Zap className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <p className="text-sm text-muted-foreground leading-relaxed">{recommendation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Motivational Message & Next Steps */}
        {feedback?.motivationalMessage && (
          <Card className="mb-8 bg-gradient-to-r from-primary/10 to-secondary/10 border-2 border-primary/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-xl">
                <Award className="h-6 w-6 text-primary" />
                <span>Keep Pushing Forward!</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-500 font-medium mb-6 leading-relaxed text-lg">{feedback.motivationalMessage}</p>
              {feedback.nextSteps && (
                <div>
                  <h4 className="font-semibold mb-3 text-lg flex items-center">
                    <ArrowRight className="h-5 w-5 mr-2 text-primary" />
                    Your Next Steps:
                  </h4>
                  <ul className="space-y-2">
                    {feedback.nextSteps.map((step, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start p-3 bg-white/60 rounded-lg">
                        <CheckCircle2 className="h-4 w-4 mr-2 mt-0.5 text-green-500 flex-shrink-0" />
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch sm:items-center">
          <Button onClick={handleRetakeTest} size="lg" className="text-lg px-10 py-6 shadow-xl hover:shadow-2xl">
            <RotateCcw className="h-5 w-5 mr-2" />
            Take Another Test
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/progress")}
            size="lg"
            className="text-lg px-10 py-6 bg-transparent shadow-lg hover:shadow-xl"
          >
            <TrendingUp className="h-5 w-5 mr-2" />
            View Progress Dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}