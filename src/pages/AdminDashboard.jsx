import React, { useState, useEffect } from 'react'
import './AdminDashboard.css'

function AdminDashboard({ user }) {
  const [users, setUsers] = useState([])
  const [connections, setConnections] = useState([])
  const [messages, setMessages] = useState([])
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalConnections: 0,
    totalMessages: 0,
    activeUsers: 0
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]')
    const allConnections = JSON.parse(localStorage.getItem('connections') || '[]')
    const allMessages = JSON.parse(localStorage.getItem('messages') || '[]')

    setUsers(allUsers)
    setConnections(allConnections)
    setMessages(allMessages)

    const activeUsers = new Set()
    allMessages.forEach(msg => {
      activeUsers.add(msg.fromUserId)
      activeUsers.add(msg.toUserId)
    })

    setStats({
      totalUsers: allUsers.length,
      totalConnections: allConnections.filter(c => c.status === 'accepted').length,
      totalMessages: allMessages.length,
      activeUsers: activeUsers.size
    })
  }

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const updatedUsers = users.filter(u => u.id !== userId)
      localStorage.setItem('users', JSON.stringify(updatedUsers))
      loadData()
    }
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage users, connections, and platform statistics</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <div className="stat-value">{stats.totalUsers}</div>
            <div className="stat-label">Total Users</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔗</div>
          <div className="stat-info">
            <div className="stat-value">{stats.totalConnections}</div>
            <div className="stat-label">Connections</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💬</div>
          <div className="stat-info">
            <div className="stat-value">{stats.totalMessages}</div>
            <div className="stat-label">Messages</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⚡</div>
          <div className="stat-info">
            <div className="stat-value">{stats.activeUsers}</div>
            <div className="stat-label">Active Users</div>
          </div>
        </div>
      </div>

      <div className="admin-sections">
        <div className="admin-section">
          <h2>All Users</h2>
          <div className="users-table">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Skills to Teach</th>
                  <th>Skills to Learn</th>
                  <th>Location</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.skillsToTeach?.length || 0}</td>
                    <td>{u.skillsToLearn?.length || 0}</td>
                    <td>{u.location || 'N/A'}</td>
                    <td>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteUser(u.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="admin-section">
          <h2>Recent Connections</h2>
          <div className="connections-list">
            {connections.slice(0, 10).map(conn => (
              <div key={conn.id} className="connection-item">
                <div className="connection-info">
                  <span className="connection-from">{conn.fromUserName}</span>
                  <span className="connection-arrow">→</span>
                  <span className="connection-to">{conn.toUserName}</span>
                  <span className={`connection-status ${conn.status}`}>{conn.status}</span>
                </div>
                <div className="connection-time">
                  {new Date(conn.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

