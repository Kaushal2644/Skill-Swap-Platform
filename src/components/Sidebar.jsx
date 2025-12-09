import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import './Sidebar.css'

function Sidebar({ user, onLogout }) {
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    onLogout()
    navigate('/login')
  }

  const isAdmin = user?.email === 'admin@skillswap.com' || user?.role === 'admin'

  const navItems = [
    { path: '/dashboard', label: 'Browse Skills', icon: '🏠' },
    { path: '/smart-matches', label: 'Smart Matches', icon: '⚡' },
    { path: '/leaderboard', label: 'Leaderboard', icon: '🏆' },
    { path: '/messages', label: 'Messages', icon: '💬' },
    { path: '/profile', label: 'My Profile', icon: '👤' },
    { path: '/swap-requests', label: 'Swap Requests', icon: '🔔' },
  ]

  if (isAdmin) {
    navItems.push({ path: '/admin', label: 'Admin Dashboard', icon: '🛡️' })
  }

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo-container">
          <div className="logo-icon">💬</div>
          <div className="logo-text">
            <div className="logo-title">SkillSwap</div>
            <div className="logo-tagline">Learn & Share Together</div>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar-sidebar">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="user-info-sidebar">
            <div className="user-name-sidebar">{user?.name || 'User'}</div>
            <div className="user-email-sidebar">{user?.email || ''}</div>
          </div>
        </div>
        <button onClick={handleLogout} className="sign-out-btn">
          <span>Sign Out</span>
          <span className="sign-out-icon">→</span>
        </button>
      </div>
    </div>
  )
}

export default Sidebar

