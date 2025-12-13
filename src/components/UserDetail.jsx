import React, { useState, useEffect } from 'react'
import './UserDetail.css'

function UserDetail({ user, otherUser, onClose, onUpdate }) {
  const [activeTab, setActiveTab] = useState('profile')
  const [message, setMessage] = useState('')
  const [connectionStatus, setConnectionStatus] = useState('none')
  const [messages, setMessages] = useState([])

  useEffect(() => {
    // Load connection status
    const connections = JSON.parse(localStorage.getItem('connections') || '[]')
    const connection = connections.find(
      c => (c.fromUserId === user.id && c.toUserId === otherUser.id) ||
           (c.fromUserId === otherUser.id && c.toUserId === user.id)
    )
    if (connection) {
      setConnectionStatus(connection.status) // 'pending', 'accepted', 'rejected'
    }

    // Load messages
    const allMessages = JSON.parse(localStorage.getItem('messages') || '[]')
    const userMessages = allMessages.filter(
      m => (m.fromUserId === user.id && m.toUserId === otherUser.id) ||
           (m.fromUserId === otherUser.id && m.toUserId === user.id)
    ).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    setMessages(userMessages)
  }, [user.id, otherUser.id])

  const getPotentialMatches = () => {
    const userTeachSkills = user.skillsToTeach || []
    const userLearnSkills = user.skillsToLearn || []
    const otherTeachSkills = otherUser.skillsToTeach || []
    const otherLearnSkills = otherUser.skillsToLearn || []

    const matches = []
    
    userTeachSkills.forEach(skill => {
      if (otherLearnSkills.includes(skill)) {
        matches.push({ type: 'I can teach', skill, direction: 'outgoing' })
      }
    })

    otherTeachSkills.forEach(skill => {
      if (userLearnSkills.includes(skill)) {
        matches.push({ type: 'They can teach', skill, direction: 'incoming' })
      }
    })

    return matches
  }

  const handleSendConnectionRequest = () => {
    const connections = JSON.parse(localStorage.getItem('connections') || '[]')
    const newConnection = {
      id: Date.now().toString(),
      fromUserId: user.id,
      toUserId: otherUser.id,
      fromUserName: user.name,
      toUserName: otherUser.name,
      status: 'pending',
      timestamp: new Date().toISOString()
    }
    connections.push(newConnection)
    localStorage.setItem('connections', JSON.stringify(connections))
    setConnectionStatus('pending')
    alert(`Connection request sent to ${otherUser.name}!`)
  }

  const handleAcceptConnection = () => {
    const connections = JSON.parse(localStorage.getItem('connections') || '[]')
    const connection = connections.find(
      c => c.fromUserId === otherUser.id && c.toUserId === user.id
    )
    if (connection) {
      connection.status = 'accepted'
      localStorage.setItem('connections', JSON.stringify(connections))
      setConnectionStatus('accepted')
      alert(`You are now connected with ${otherUser.name}!`)
    }
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!message.trim()) return

    if (connectionStatus !== 'accepted') {
      alert('You need to be connected to send messages. Send a connection request first!')
      return
    }

    const allMessages = JSON.parse(localStorage.getItem('messages') || '[]')
    const newMessage = {
      id: Date.now().toString(),
      fromUserId: user.id,
      fromUserName: user.name,
      toUserId: otherUser.id,
      toUserName: otherUser.name,
      message: message.trim(),
      timestamp: new Date().toISOString()
    }
    allMessages.push(newMessage)
    localStorage.setItem('messages', JSON.stringify(allMessages))
    setMessages([...messages, newMessage])
    setMessage('')
  }

  const matches = getPotentialMatches()

  return (
    <div className="user-detail-overlay" onClick={onClose}>
      <div className="user-detail-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        
        <div className="user-detail-header">
          <div className="user-avatar-large">
            {otherUser.name.charAt(0).toUpperCase()}
          </div>
          <div className="user-header-info">
            <h2>{otherUser.name}</h2>
            <p className="user-email">{otherUser.email}</p>
            {matches.length > 0 && (
              <div className="match-badge-large">
                <span className="match-icon">✨</span>
                {matches.length} Perfect Match{matches.length > 1 ? 'es' : ''}!
              </div>
            )}
          </div>
        </div>

        <div className="connection-status">
          {connectionStatus === 'none' && (
            <button className="connect-btn" onClick={handleSendConnectionRequest}>
              <span>🔗</span> Send Connection Request
            </button>
          )}
          {connectionStatus === 'pending' && (
            <div className="status-message">
              {messages.find(m => m.fromUserId === user.id) ? (
                <span>⏳ Connection request sent - waiting for response</span>
              ) : (
                <span>⏳ Connection request received</span>
              )}
              {messages.find(m => m.fromUserId === otherUser.id) && (
                <button className="accept-btn" onClick={handleAcceptConnection}>
                  Accept Connection
                </button>
              )}
            </div>
          )}
          {connectionStatus === 'accepted' && (
            <div className="status-message connected">
              <span>✅ Connected</span>
            </div>
          )}
        </div>

        <div className="tabs">
          <button
            className={activeTab === 'profile' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
          <button
            className={activeTab === 'messages' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('messages')}
          >
            Messages {messages.length > 0 && <span className="badge">{messages.length}</span>}
          </button>
          <button
            className={activeTab === 'matches' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('matches')}
          >
            Matches
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'profile' && (
            <div className="profile-tab">
              {otherUser.bio && (
                <div className="bio-section">
                  <h3>About</h3>
                  <p>{otherUser.bio}</p>
                </div>
              )}

              <div className="skills-section-detail">
                {otherUser.skillsToTeach && otherUser.skillsToTeach.length > 0 && (
                  <div className="skills-group-detail">
                    <h3>Can Teach:</h3>
                    <div className="skills-list">
                      {otherUser.skillsToTeach.map((skill, idx) => (
                        <span key={idx} className="skill-tag teach">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {otherUser.skillsToLearn && otherUser.skillsToLearn.length > 0 && (
                  <div className="skills-group-detail">
                    <h3>Wants to Learn:</h3>
                    <div className="skills-list">
                      {otherUser.skillsToLearn.map((skill, idx) => (
                        <span key={idx} className="skill-tag learn">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="messages-tab">
              {connectionStatus !== 'accepted' ? (
                <div className="no-messages">
                  <p>You need to be connected to send messages.</p>
                  <p>Send a connection request to start chatting!</p>
                </div>
              ) : (
                <>
                  <div className="messages-list">
                    {messages.length === 0 ? (
                      <div className="no-messages">
                        <p>No messages yet. Start the conversation!</p>
                      </div>
                    ) : (
                      messages.map(msg => (
                        <div
                          key={msg.id}
                          className={`message ${msg.fromUserId === user.id ? 'sent' : 'received'}`}
                        >
                          <div className="message-header">
                            <span className="message-author">{msg.fromUserName}</span>
                            <span className="message-time">
                              {new Date(msg.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <div className="message-content">{msg.message}</div>
                        </div>
                      ))
                    )}
                  </div>
                  <form onSubmit={handleSendMessage} className="message-form">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="message-input"
                    />
                    <button type="submit" className="send-btn">Send</button>
                  </form>
                </>
              )}
            </div>
          )}

          {activeTab === 'matches' && (
            <div className="matches-tab">
              {matches.length === 0 ? (
                <div className="no-matches">
                  <p>No skill matches found with this user.</p>
                </div>
              ) : (
                <div className="matches-list">
                  {matches.map((match, idx) => (
                    <div key={idx} className="match-card">
                      <div className="match-header">
                        <span className="match-type-icon">
                          {match.direction === 'outgoing' ? '👨‍🏫' : '📚'}
                        </span>
                        <span className="match-type-text">{match.type}</span>
                      </div>
                      <div className="match-skill-name">{match.skill}</div>
                      <div className="match-description">
                        {match.direction === 'outgoing'
                          ? `You can teach ${otherUser.name} ${match.skill}`
                          : `${otherUser.name} can teach you ${match.skill}`}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserDetail


