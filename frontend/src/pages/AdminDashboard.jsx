"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { Progress } from "../components/ui/progress"
import { Navigation } from "../components/navigation"
import {
  BarChart3,
  Users,
  BookOpen,
  TrendingUp,
  Clock,
  Target,
  Plus,
  Edit,
  Trash2,
  Filter,
  Search,
  Brain,
  Sparkles,
} from "lucide-react"
import { Alert, AlertDescription } from "../components/ui/alert"
import { generateAdminStats, getAdminQuestions } from "../lib/dummy-data"

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [questionFilter, setQuestionFilter] = useState({ difficulty: "", topic: "" })
  const [showAddQuestion, setShowAddQuestion] = useState(false)

  useEffect(() => {
    loadAdminStats()
    if (activeTab === "questions") {
      loadQuestions()
    }
  }, [activeTab])

  const loadAdminStats = async () => {
    try {
      // <CHANGE> Using dummy data instead of API call
      const data = generateAdminStats()

      if (data.success) {
        setStats(data)
      } else {
        setError("Failed to load statistics")
      }
    } catch (err) {
      setError("Network error loading statistics")
    } finally {
      setLoading(false)
    }
  }

  const loadQuestions = async () => {
    try {
      // <CHANGE> Using dummy data instead of API call
      const data = getAdminQuestions(questionFilter)

      if (data.success) {
        setQuestions(data.questions)
      }
    } catch (err) {
      console.error("Error loading questions:", err)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-blue-600"
    if (score >= 40) return "text-yellow-600"
    return "text-red-600"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg text-muted-foreground">Loading analytics dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <Alert className="max-w-md">
            <AlertDescription className="text-destructive">{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-xl">
              <BarChart3 className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">Analytics Dashboard</h1>
              <p className="text-muted-foreground">Comprehensive insights into platform performance and user engagement</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8 bg-muted/50 p-1 rounded-xl w-fit">
          <Button
            variant={activeTab === "overview" ? "default" : "ghost"}
            onClick={() => setActiveTab("overview")}
            className="rounded-lg px-6"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Platform Overview
          </Button>
          <Button
            variant={activeTab === "questions" ? "default" : "ghost"}
            onClick={() => setActiveTab("questions")}
            className="rounded-lg px-6"
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Question Bank
          </Button>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && stats && (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="shadow-lg bg-gradient-to-br from-card to-card/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    Total Test Sessions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">{stats.overview.totalTests.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground mt-1">Completed assessments</p>
                </CardContent>
              </Card>

              <Card className="shadow-lg bg-gradient-to-br from-card to-card/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Question Database
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">{stats.overview.totalQuestions}</div>
                  <p className="text-xs text-muted-foreground mt-1">Active questions available</p>
                </CardContent>
              </Card>

              <Card className="shadow-lg bg-gradient-to-br from-card to-card/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                    <Target className="h-4 w-4 mr-2" />
                    Platform Average
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-3xl font-bold ${getScoreColor(stats.overview.averageScore)}`}>
                    {stats.overview.averageScore}%
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Overall success rate</p>
                </CardContent>
              </Card>

              <Card className="shadow-lg bg-gradient-to-br from-card to-card/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Today's Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">
                    {stats.dailyStats[stats.dailyStats.length - 1]?.count || 0}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Tests taken today</p>
                </CardContent>
              </Card>
            </div>

            {/* Difficulty Performance Analysis */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-xl">
                  <Target className="h-6 w-6 text-primary" />
                  <span>Difficulty Level Analysis</span>
                </CardTitle>
                <CardDescription className="text-base">
                  Test attempts and average performance across difficulty levels
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {stats.overview.difficultyBreakdown.map((diff) => (
                    <div key={diff._id} className="space-y-3 p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Badge variant="outline" className="capitalize px-3 py-1 font-medium">
                            {diff._id}
                          </Badge>
                          <span className="text-sm text-muted-foreground font-medium">
                            {diff.count.toLocaleString()} attempts
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`text-lg font-bold ${getScoreColor(Math.round(diff.avgScore))}`}>
                            {Math.round(diff.avgScore)}%
                          </span>
                        </div>
                      </div>
                      <Progress value={diff.avgScore} className="h-3" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Topic Performance Grid */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-xl">
                  <Brain className="h-6 w-6 text-primary" />
                  <span>Topic Performance Matrix</span>
                </CardTitle>
                <CardDescription className="text-base">
                  Accuracy rates and engagement across different question categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {stats.topicPerformance.slice(0, 9).map((topic) => (
                    <div key={topic._id} className="space-y-3 p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold">{topic._id}</span>
                        <Badge 
                          variant="outline" 
                          className={`text-xs font-medium ${
                            topic.accuracy >= 80 ? 'bg-green-100 text-green-800 border-green-200' :
                            topic.accuracy >= 70 ? 'bg-blue-100 text-blue-800 border-blue-200' :
                            topic.accuracy >= 60 ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                            'bg-red-100 text-red-800 border-red-200'
                          }`}
                        >
                          {Math.round(topic.accuracy)}%
                        </Badge>
                      </div>
                      <Progress value={topic.accuracy} className="h-2" />
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{topic.correctAnswers} correct</span>
                        <span>{topic.totalQuestions} total</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity Feed */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-xl">
                  <Clock className="h-6 w-6 text-primary" />
                  <span>Recent Test Activity</span>
                </CardTitle>
                <CardDescription className="text-base">
                  Latest test submissions and performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.recentTests.map((test, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors">
                      <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <Target className={`h-4 w-4 ${getScoreColor(test.score)}`} />
                          </div>
                          <div>
                            <div className={`font-bold ${getScoreColor(test.score)}`}>{test.score}%</div>
                            <p className="text-xs text-muted-foreground">Score</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="capitalize px-3 py-1">
                          {test.difficulty}
                        </Badge>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{formatTime(test.timeSpent)}</span>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground font-medium">{formatDate(test.createdAt)}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Weekly Trends Chart */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-xl">
                  <TrendingUp className="h-6 w-6 text-primary" />
                  <span>Weekly Performance Trends</span>
                </CardTitle>
                <CardDescription className="text-base">
                  Test volume and average scores over the last 7 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.dailyStats.slice(-7).map((day) => (
                    <div key={day._id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-center space-x-6">
                        <span className="text-sm font-semibold w-20">
                          {new Date(day._id).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </span>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-muted-foreground">{day.count} tests</span>
                            <div className="w-32 bg-muted rounded-full h-3">
                              <div
                                className="bg-primary h-3 rounded-full transition-all duration-300"
                                style={{
                                  width: `${(day.count / Math.max(...stats.dailyStats.map((d) => d.count))) * 100}%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className={`font-bold text-lg ${getScoreColor(Math.round(day.avgScore))}`}>
                        {Math.round(day.avgScore)}%
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Questions Tab */}
        {activeTab === "questions" && (
          <div className="space-y-6">
            {/* Question Management Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Question Bank Management</h2>
                <p className="text-muted-foreground">Add, edit, and organize test questions across different topics and difficulty levels</p>
              </div>
              <Button onClick={() => setShowAddQuestion(true)} className="flex items-center space-x-2 px-6">
                <Plus className="h-4 w-4" />
                <span>Add New Question</span>
              </Button>
            </div>

            {/* Enhanced Filters */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Filter className="h-5 w-5 text-primary" />
                  <span>Advanced Filters</span>
                </CardTitle>
                <CardDescription>Filter questions by difficulty, topic, or search terms</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">Difficulty Level</label>
                    <select
                      className="w-full p-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      value={questionFilter.difficulty}
                      onChange={(e) => setQuestionFilter({ ...questionFilter, difficulty: e.target.value })}
                    >
                      <option value="">All Difficulties</option>
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">Topic Category</label>
                    <input
                      type="text"
                      placeholder="Search by topic..."
                      className="w-full p-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      value={questionFilter.topic}
                      onChange={(e) => setQuestionFilter({ ...questionFilter, topic: e.target.value })}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button onClick={loadQuestions} className="w-full h-12">
                      <Search className="h-4 w-4 mr-2" />
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Questions List */}
            <div className="space-y-4">
              {questions.map((question) => (
                <Card key={question.id} className="shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg leading-relaxed mb-3 text-balance">{question.questionText}</CardTitle>
                        <div className="flex items-center space-x-3">
                          <Badge 
                            variant="outline" 
                            className={`capitalize px-3 py-1 ${
                              question.difficultyLevel === 'easy' ? 'bg-green-100 text-green-800 border-green-200' :
                              question.difficultyLevel === 'medium' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                              'bg-purple-100 text-purple-800 border-purple-200'
                            }`}
                          >
                            {question.difficultyLevel}
                          </Badge>
                          <Badge variant="secondary" className="px-3 py-1">{question.topic}</Badge>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" className="px-3 bg-transparent">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:text-destructive bg-transparent px-3"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {question.options.map((option, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-lg border transition-colors ${
                            index === question.correctAnswer
                              ? "border-green-200 bg-green-50 text-green-800"
                              : "border-border bg-muted/30"
                          }`}
                        >
                          <span className="text-sm font-medium">
                            {String.fromCharCode(65 + index)}. {option}
                            {index === question.correctAnswer && (
                              <Badge variant="outline" className="ml-3 text-xs text-green-600 border-green-200 bg-green-100">
                                ✓ Correct Answer
                              </Badge>
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
                      <div className="flex items-start space-x-2">
                        <Sparkles className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-primary mb-1">AI Explanation</p>
                          <p className="text-sm text-muted-foreground leading-relaxed">{question.explanation}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {questions.length === 0 && (
              <Card className="shadow-lg">
                <CardContent className="text-center py-12">
                  <div className="p-4 bg-muted/30 rounded-full w-fit mx-auto mb-4">
                    <BookOpen className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Questions Found</h3>
                  <p className="text-muted-foreground mb-4">No questions match your current filter criteria.</p>
                  <Button onClick={() => setQuestionFilter({ difficulty: "", topic: "" })}>
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

                
