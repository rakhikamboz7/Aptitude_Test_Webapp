import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import React from "react";
import QuizPage from "./pages/QuizPage";
import ResultsPage from "./pages/ResultsPage";
import ProgressPage from "./pages/ProgressPage";
import AdminDashboard from "./pages/AdminDashboard";
import EmployabilityTestPage from "./pages/EmployabilityTestPage";
import AuthPage from "./pages/AuthPage";
import AssessmentPage from "./pages/Assessment";
import GeminiReportPage from "./pages/GeminiReportPage";
export default function App() {
  return (
 
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path= "/auth" element={<AuthPage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/assessments" element={<AssessmentPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/employability" element={<EmployabilityTestPage />} />
          <Route path="/gemini-report" element={<GeminiReportPage />} />
        </Routes>
      </div>

  );
}
