import React, { useState, useEffect } from 'react'
import './Leaderboard.css'

function Leaderboard({ user }) {
  const [leaderboard, setLeaderboard] = useState([])

  useEffect(() => {
    loadLeaderboard()
  }, [])

  const loadLeaderboard = () => {
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]')
    const allConnections = JSON.parse(localStorage.getItem('connections') || '[]')
    const allMessages = JSON.parse(localStorage.getItem('messages') || '[]')

    const userStats = allUsers.map(u => {
      const connections = allConnections.filter(
        c => (c.fromUserId === u.id || c.toUserId === u.id) && c.status === 'accepted'
      ).length
      
      const messages = allMessages.filter(m => m.fromUserId === u.id).length
      
      const score = connections * 10 + messages * 2

      return {
        ...u,
        connections,
        messages,
        score
      }
    }).sort((a, b) => b.score - a.score)

    setLeaderboard(userStats)
  }

  const getRankIcon = (rank) => {
    if (rank === 0) return '🥇'
    if (rank === 1) return '🥈'
    if (rank === 2) return '🥉'
    return `#${rank + 1}`
  }

  return (
    <div className="leaderboard">
      <div className="leaderboard-header">
        <h1>🏆 Leaderboard</h1>
        <p>Top users based on connections and activity</p>
      </div>

      <div className="leaderboard-table">
        <div className="table-header">
          <div className="rank-col">Rank</div>
          <div className="user-col">User</div>
          <div className="stats-col">Connections</div>
          <div className="stats-col">Messages</div>
          <div className="score-col">Score</div>
        </div>

        {leaderboard.map((userData, idx) => (
          <div
            key={userData.id}
            className={`leaderboard-row ${userData.id === user.id ? 'current-user' : ''}`}
          >
            <div className="rank-col">
              <span className="rank-icon">{getRankIcon(idx)}</span>
            </div>
            <div className="user-col">
              <div className="user-avatar-leaderboard">
                {userData.name.charAt(0).toUpperCase()}
              </div>
              <div className="user-details">
                <div className="user-name-leaderboard">{userData.name}</div>
                {userData.location && (
                  <div className="user-location-leaderboard">📍 {userData.location}</div>
                )}
              </div>
            </div>
            <div className="stats-col">{userData.connections}</div>
            <div className="stats-col">{userData.messages}</div>
            <div className="score-col">
              <span className="score-badge">{userData.score}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Leaderboard



