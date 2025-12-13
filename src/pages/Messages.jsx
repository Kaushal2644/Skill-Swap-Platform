import React, { useState, useEffect } from 'react'
import './Messages.css'

function Messages({ user }) {
  const [conversations, setConversations] = useState([])
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])

  useEffect(() => {
    loadConversations()
  }, [user])

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.userId)
    }
  }, [selectedConversation, user])

  const loadConversations = () => {
    const allMessages = JSON.parse(localStorage.getItem('messages') || '[]')
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]')
    const connections = JSON.parse(localStorage.getItem('connections') || '[]')
    
    // Get all connected users
    const connectedUserIds = connections
      .filter(c => c.status === 'accepted' && (c.fromUserId === user.id || c.toUserId === user.id))
      .map(c => c.fromUserId === user.id ? c.toUserId : c.fromUserId)

    // Get conversations with last message
    const convMap = new Map()
    
    allMessages.forEach(msg => {
      const otherUserId = msg.fromUserId === user.id ? msg.toUserId : msg.fromUserId
      if (connectedUserIds.includes(otherUserId)) {
        if (!convMap.has(otherUserId) || new Date(msg.timestamp) > new Date(convMap.get(otherUserId).lastMessage.timestamp)) {
          const otherUser = allUsers.find(u => u.id === otherUserId)
          if (otherUser) {
            convMap.set(otherUserId, {
              userId: otherUserId,
              userName: otherUser.name,
              userEmail: otherUser.email,
              lastMessage: msg,
              unreadCount: msg.toUserId === user.id && !msg.read ? 1 : 0
            })
          }
        } else {
          const conv = convMap.get(otherUserId)
          if (msg.toUserId === user.id && !msg.read) {
            conv.unreadCount++
          }
        }
      }
    })

    // Add connected users without messages
    connectedUserIds.forEach(userId => {
      if (!convMap.has(userId)) {
        const otherUser = allUsers.find(u => u.id === userId)
        if (otherUser) {
          convMap.set(userId, {
            userId,
            userName: otherUser.name,
            userEmail: otherUser.email,
            lastMessage: null,
            unreadCount: 0
          })
        }
      }
    })

    setConversations(Array.from(convMap.values()).sort((a, b) => {
      if (!a.lastMessage) return 1
      if (!b.lastMessage) return -1
      return new Date(b.lastMessage.timestamp) - new Date(a.lastMessage.timestamp)
    }))
  }

  const loadMessages = (otherUserId) => {
    const allMessages = JSON.parse(localStorage.getItem('messages') || '[]')
    const userMessages = allMessages
      .filter(m => (m.fromUserId === user.id && m.toUserId === otherUserId) ||
                   (m.fromUserId === otherUserId && m.toUserId === user.id))
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    
    // Mark as read
    const updatedMessages = allMessages.map(m => 
      m.toUserId === user.id && m.fromUserId === otherUserId ? { ...m, read: true } : m
    )
    localStorage.setItem('messages', JSON.stringify(updatedMessages))
    
    setMessages(userMessages)
    loadConversations()
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!message.trim() || !selectedConversation) return

    const allMessages = JSON.parse(localStorage.getItem('messages') || '[]')
    const newMessage = {
      id: Date.now().toString(),
      fromUserId: user.id,
      fromUserName: user.name,
      toUserId: selectedConversation.userId,
      toUserName: selectedConversation.userName,
      message: message.trim(),
      timestamp: new Date().toISOString(),
      read: false
    }
    
    allMessages.push(newMessage)
    localStorage.setItem('messages', JSON.stringify(allMessages))
    setMessages([...messages, newMessage])
    setMessage('')
    loadConversations()
  }

  return (
    <div className="messages-page">
      <div className="messages-container">
        <div className="conversations-list">
          <h2>Conversations</h2>
          {conversations.length === 0 ? (
            <div className="no-conversations">
              <p>No conversations yet. Connect with users to start messaging!</p>
            </div>
          ) : (
            <div className="conversations">
              {conversations.map(conv => (
                <div
                  key={conv.userId}
                  className={`conversation-item ${selectedConversation?.userId === conv.userId ? 'active' : ''}`}
                  onClick={() => setSelectedConversation(conv)}
                >
                  <div className="conversation-avatar">
                    {conv.userName.charAt(0).toUpperCase()}
                  </div>
                  <div className="conversation-info">
                    <div className="conversation-header">
                      <span className="conversation-name">{conv.userName}</span>
                      {conv.unreadCount > 0 && (
                        <span className="unread-badge">{conv.unreadCount}</span>
                      )}
                    </div>
                    {conv.lastMessage && (
                      <p className="conversation-preview">
                        {conv.lastMessage.fromUserId === user.id ? 'You: ' : ''}
                        {conv.lastMessage.message}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="messages-view">
          {selectedConversation ? (
            <>
              <div className="messages-header">
                <div className="messages-header-user">
                  <div className="messages-header-avatar">
                    {selectedConversation.userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3>{selectedConversation.userName}</h3>
                    <p>{selectedConversation.userEmail}</p>
                  </div>
                </div>
              </div>

              <div className="messages-list-view">
                {messages.length === 0 ? (
                  <div className="no-messages-view">
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  messages.map(msg => (
                    <div
                      key={msg.id}
                      className={`message-bubble ${msg.fromUserId === user.id ? 'sent' : 'received'}`}
                    >
                      <div className="message-text">{msg.message}</div>
                      <div className="message-time">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={handleSendMessage} className="message-input-form">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="message-input-field"
                />
                <button type="submit" className="send-message-btn">Send</button>
              </form>
            </>
          ) : (
            <div className="no-conversation-selected">
              <p>Select a conversation to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Messages


