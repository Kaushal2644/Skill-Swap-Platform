import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Messages from './pages/Messages'
import AdminDashboard from './pages/AdminDashboard'
import SmartMatches from './pages/SmartMatches'
import Leaderboard from './pages/Leaderboard'
import SwapRequests from './pages/SwapRequests'
import Layout from './components/Layout'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const authToken = localStorage.getItem('authToken')
    const userData = localStorage.getItem('user')
    if (authToken && userData) {
      setIsAuthenticated(true)
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleLogin = (userData, token) => {
    localStorage.setItem('authToken', token)
    localStorage.setItem('user', JSON.stringify(userData))
    setIsAuthenticated(true)
    setUser(userData)
  }

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    setIsAuthenticated(false)
    setUser(null)
  }

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />} 
          />
          <Route 
            path="/register" 
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register onLogin={handleLogin} />} 
          />
          <Route 
            path="/dashboard" 
            element={isAuthenticated ? <Layout user={user} onLogout={handleLogout}><Dashboard user={user} /></Layout> : <Navigate to="/login" />} 
          />
          <Route 
            path="/profile" 
            element={isAuthenticated ? <Layout user={user} onLogout={handleLogout}><Profile user={user} setUser={setUser} /></Layout> : <Navigate to="/login" />} 
          />
          <Route 
            path="/messages" 
            element={isAuthenticated ? <Layout user={user} onLogout={handleLogout}><Messages user={user} /></Layout> : <Navigate to="/login" />} 
          />
          <Route 
            path="/smart-matches" 
            element={isAuthenticated ? <Layout user={user} onLogout={handleLogout}><SmartMatches user={user} /></Layout> : <Navigate to="/login" />} 
          />
          <Route 
            path="/leaderboard" 
            element={isAuthenticated ? <Layout user={user} onLogout={handleLogout}><Leaderboard user={user} /></Layout> : <Navigate to="/login" />} 
          />
          <Route 
            path="/swap-requests" 
            element={isAuthenticated ? <Layout user={user} onLogout={handleLogout}><SwapRequests user={user} /></Layout> : <Navigate to="/login" />} 
          />
          <Route 
            path="/admin" 
            element={isAuthenticated ? <Layout user={user} onLogout={handleLogout}><AdminDashboard user={user} /></Layout> : <Navigate to="/login" />} 
          />
          <Route 
            path="/" 
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} 
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App

