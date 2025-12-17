import React, { useState, useEffect } from 'react'
import './SwapRequests.css'

function SwapRequests({ user }) {
  const [requests, setRequests] = useState([])

  useEffect(() => {
    loadRequests()
  }, [user])

  const loadRequests = () => {
    const connections = JSON.parse(localStorage.getItem('connections') || '[]')
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]')
    
    const userRequests = connections
      .filter(c => c.toUserId === user.id && c.status === 'pending')
      .map(conn => {
        const fromUser = allUsers.find(u => u.id === conn.fromUserId)
        return {
          ...conn,
          fromUser
        }
      })

    setRequests(userRequests)
  }

  const handleAccept = (requestId) => {
    const connections = JSON.parse(localStorage.getItem('connections') || '[]')
    const connection = connections.find(c => c.id === requestId)
    if (connection) {
      connection.status = 'accepted'
      localStorage.setItem('connections', JSON.stringify(connections))
      loadRequests()
      alert('Connection request accepted!')
    }
  }

  const handleReject = (requestId) => {
    const connections = JSON.parse(localStorage.getItem('connections') || '[]')
    const updatedConnections = connections.filter(c => c.id !== requestId)
    localStorage.setItem('connections', JSON.stringify(updatedConnections))
    loadRequests()
  }

  return (
    <div className="swap-requests">
      <div className="swap-requests-header">
        <h1>🔔 Swap Requests</h1>
        <p>Manage your connection requests</p>
      </div>

      {requests.length === 0 ? (
        <div className="no-requests">
          <p>No pending connection requests</p>
        </div>
      ) : (
        <div className="requests-list">
          {requests.map(request => (
            <div key={request.id} className="request-card">
              <div className="request-user-info">
                <div className="request-avatar">
                  {request.fromUser?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="request-details">
                  <h3>{request.fromUser?.name || 'Unknown User'}</h3>
                  <p>{request.fromUser?.email || ''}</p>
                  {request.fromUser?.location && (
                    <p className="request-location">📍 {request.fromUser.location}</p>
                  )}
                </div>
              </div>
              <div className="request-actions">
                <button
                  className="accept-request-btn"
                  onClick={() => handleAccept(request.id)}
                >
                  Accept
                </button>
                <button
                  className="reject-request-btn"
                  onClick={() => handleReject(request.id)}
                >
                  Reject
                </button>
              </div>
              <div className="request-time">
                {new Date(request.timestamp).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SwapRequests



