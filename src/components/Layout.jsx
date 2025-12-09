import React from 'react'
import Sidebar from './Sidebar'
import './Layout.css'

function Layout({ children, user, onLogout }) {
  return (
    <div className="layout">
      <Sidebar user={user} onLogout={onLogout} />
      <div className="main-content">
        <div className="top-banner">
          <div className="notification-bar">
            <span className="notification-icon">🔔</span>
            <span className="notification-text">Welcome: Hello everyone, welcome to Skill Swap Platform.</span>
          </div>
        </div>
        <div className="content-area">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Layout

