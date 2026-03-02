import React, { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../contexts/auth-context"
import { Button } from "./ui/button"
import { Brain, LogOut, User, Menu, Trophy } from "lucide-react"

export const Navigation = () => {
  const navigate = useNavigate()
  const location = useLocation() // Used to highlight the active tab
  const { user, logout, isAuthenticated } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/assessments", label: "Assessments" },
    { path: "/progress", label: "Progress" },
    { path: "/employability", label: "Employability Test" },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <button onClick={() => navigate("/")} className="flex items-center space-x-3 cursor-pointer group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-sky-400 rounded-xl blur-lg opacity-40 group-hover:opacity-70 transition-opacity"></div>
              <div className="relative p-2 bg-gradient-to-br from-blue-600 to-sky-500 rounded-xl shadow-md">
                <Brain className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="text-left">
              <span className="text-xl font-bold text-slate-900">
                Aptitude<span className="text-sky-500">AI</span>
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 bg-white rounded-full px-2 py-2 border border-slate-200 shadow-sm">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-md shadow-blue-500/20"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  {link.label}
                </button>
              )
            })}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-3">
            {isAuthenticated && user ? (
              <>
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-foreground">
                    {user.profile?.firstName || user.name}
                  </p>
                  <div className="flex items-center justify-end gap-1 text-xs text-slate-500">
                    <Trophy className="h-3 w-3 text-amber-500" />
                    {user.statistics?.totalAssessments || 0} tests
                  </div>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={logout}
                  className="bg-white hover:bg-red-50 border border-slate-200 text-slate-700 hover:text-red-600 hover:border-red-200 shadow-sm"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <Button 
                onClick={() => navigate("/auth")}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 rounded-lg px-6"
              >
                Sign In
              </Button>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden bg-white border border-slate-200 text-slate-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 space-y-2 animate-slide-down">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => {
                  navigate(link.path)
                  setMobileMenuOpen(false)
                }}
                className={`block w-full text-left px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                  location.pathname === link.path
                    ? "bg-blue-50 text-blue-700 font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}