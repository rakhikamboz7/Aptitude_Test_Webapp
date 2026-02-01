import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/auth-context"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Navigation } from "../components/navigation"
import {
  Building2,
  CheckCircle2,
  Briefcase,
  TrendingUp,
  Award,
  Clock,
  Target,
  Zap,
  Info,
} from "lucide-react"

export default function EmployabilityTestPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [selectedCompany, setSelectedCompany] = useState(null)
  const [selectedDifficulty, setSelectedDifficulty] = useState("medium")
  const [loading, setLoading] = useState(false)

  const companies = [
    {
      id: "tcs",
      name: "TCS",
      fullName: "Tata Consultancy Services",
      color: "bg-blue-600",
      description: "Technical & Analytical Focus",
      testInfo: "30 mins | Numerical, Logical & Verbal",
    },
    {
      id: "wipro",
      name: "Wipro",
      fullName: "Wipro Technologies",
      color: "bg-orange-600",
      description: "Problem Solving & Logic",
      testInfo: "25 mins | Aptitude & Reasoning",
    },
    {
      id: "google",
      name: "Google",
      fullName: "Google LLC",
      color: "bg-red-600",
      description: "Advanced Algorithms",
      testInfo: "45 mins | Coding & Analytics",
    },
    {
      id: "amazon",
      name: "Amazon",
      fullName: "Amazon Inc.",
      color: "bg-yellow-600",
      description: "Leadership Principles",
      testInfo: "40 mins | Behavioral & Technical",
    },
    {
      id: "infosys",
      name: "Infosys",
      fullName: "Infosys Limited",
      color: "bg-blue-500",
      description: "Aptitude & Reasoning",
      testInfo: "30 mins | Quantitative & Logical",
    },
    {
      id: "accenture",
      name: "Accenture",
      fullName: "Accenture PLC",
      color: "bg-purple-600",
      description: "Cognitive Abilities",
      testInfo: "35 mins | Abstract & Verbal",
    },
    {
      id: "deloitte",
      name: "Deloitte",
      fullName: "Deloitte Consulting",
      color: "bg-green-600",
      description: "Business Analytics",
      testInfo: "40 mins | Case Study & Reasoning",
    },
  ]

  const handleStartEmployabilityTest = async () => {
    if (!selectedCompany) {
      alert("Please select a company first")
      return
    }

    setLoading(true)
    localStorage.setItem("selectedDifficulty", selectedDifficulty)
    localStorage.setItem("selectedCompany", selectedCompany)
    localStorage.setItem("isEmployabilityTest", "true")
    
    // Navigate to quiz page with employability test flag
    navigate("/quiz")
  }

  const selectedCompanyData = companies.find((c) => c.id === selectedCompany)

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="p-4 bg-primary/10 rounded-full">
              <Briefcase className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">Employability Assessment</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Test your readiness for top tech company placements. Get company-specific questions and detailed performance analysis.
          </p>
        </div>

        {/* Info Banner */}
        <Card className="mb-8 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <Info className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">What is an Employability Test?</h3>
                <p className="text-muted-foreground">
                  Our employability assessments simulate real company placement tests. Each test is tailored to match
                  the specific requirements and question patterns of leading tech companies. You'll receive detailed
                  feedback on your performance and areas for improvement.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Company Selection */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
            Select Your Target Company
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company) => (
              <button
                key={company.id}
                onClick={() => setSelectedCompany(company.id)}
                className={`relative p-6 rounded-xl border-2 transition-all duration-300 hover:scale-105 text-left ${
                  selectedCompany === company.id
                    ? `${company.color} text-white border-transparent shadow-xl`
                    : "border-border bg-card hover:border-primary/30 hover:shadow-lg"
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div
                      className={`font-bold text-xl mb-1 ${selectedCompany === company.id ? "text-white" : "text-foreground"}`}
                    >
                      {company.name}
                    </div>
                    <div
                      className={`text-sm ${selectedCompany === company.id ? "text-white/90" : "text-muted-foreground"}`}
                    >
                      {company.fullName}
                    </div>
                  </div>
                  {selectedCompany === company.id && <CheckCircle2 className="h-6 w-6 text-white" />}
                </div>
                
                <div className={`mb-3 ${selectedCompany === company.id ? "text-white/90" : "text-muted-foreground"}`}>
                  {company.description}
                </div>
                
                <div className="flex items-center space-x-2">
                  <Clock className={`h-4 w-4 ${selectedCompany === company.id ? "text-white/80" : "text-muted-foreground"}`} />
                  <span className={`text-sm ${selectedCompany === company.id ? "text-white/90" : "text-muted-foreground"}`}>
                    {company.testInfo}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Company Details */}
        {selectedCompanyData && (
          <Card className="mb-8 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <Building2 className="h-6 w-6 text-primary" />
                <span>Test Preview: {selectedCompanyData.fullName}</span>
              </CardTitle>
              <CardDescription>What to expect in this assessment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-start space-x-3">
                  <Target className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <div className="font-semibold mb-1">Focus Areas</div>
                    <div className="text-sm text-muted-foreground">{selectedCompanyData.description}</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <div className="font-semibold mb-1">Duration</div>
                    <div className="text-sm text-muted-foreground">25 minutes (15 questions)</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Award className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <div className="font-semibold mb-1">Scoring</div>
                    <div className="text-sm text-muted-foreground">Earn badges based on performance</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Difficulty Selection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Select Difficulty Level</CardTitle>
            <CardDescription>Choose based on your current skill level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {["easy", "medium", "hard"].map((difficulty) => (
                <button
                  key={difficulty}
                  onClick={() => setSelectedDifficulty(difficulty)}
                  className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                    selectedDifficulty === difficulty
                      ? "border-primary bg-primary/10 shadow-lg"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="text-center">
                    <div className="font-bold text-lg capitalize mb-2">{difficulty}</div>
                    <div className="text-sm text-muted-foreground">
                      {difficulty === "easy" && "Beginner friendly questions"}
                      {difficulty === "medium" && "Standard difficulty level"}
                      {difficulty === "hard" && "Challenging advanced questions"}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Start Test Button */}
        <div className="text-center">
          <Button
            size="lg"
            onClick={handleStartEmployabilityTest}
            disabled={!selectedCompany || loading}
            className="text-lg px-12 py-8 shadow-xl hover:shadow-2xl transition-all"
          >
            {loading ? (
              <>Loading...</>
            ) : (
              <>
                <Zap className="h-6 w-6 mr-2" />
                Start Employability Test
              </>
            )}
          </Button>
          {!selectedCompany && (
            <p className="text-sm text-muted-foreground mt-4">Please select a company to continue</p>
          )}
        </div>

        {/* User Stats */}
        {user && user.statistics && (
          <Card className="mt-8 bg-muted/30">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span>Your Performance Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{user.statistics.totalAssessments}</div>
                  <div className="text-sm text-muted-foreground">Tests Taken</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{user.statistics.averageScore}%</div>
                  <div className="text-sm text-muted-foreground">Avg Score</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{user.statistics.bestScore}%</div>
                  <div className="text-sm text-muted-foreground">Best Score</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">
                    {(user.statistics.badgesEarned?.beginner || 0) +
                      (user.statistics.badgesEarned?.intermediate || 0) +
                      (user.statistics.badgesEarned?.advanced || 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Badges Earned</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}