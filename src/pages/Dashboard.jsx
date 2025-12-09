import React, { useState, useEffect } from 'react'
import UserDetail from '../components/UserDetail'
import './Dashboard.css'

function Dashboard({ user }) {
  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [selectedUser, setSelectedUser] = useState(null)

  useEffect(() => {
    // Load all users from localStorage
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]')
    // Filter out current user
    const otherUsers = allUsers.filter(u => u.id !== user.id)
    setUsers(otherUsers)
  }, [user])

  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.location && u.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.skillsToTeach && u.skillsToTeach.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))) ||
      (u.skillsToLearn && u.skillsToLearn.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())))
    
    if (filterType === 'all') return matchesSearch
    if (filterType === 'teach') {
      return matchesSearch && u.skillsToTeach && u.skillsToTeach.length > 0
    }
    if (filterType === 'learn') {
      return matchesSearch && u.skillsToLearn && u.skillsToLearn.length > 0
    }
    return matchesSearch
  })

  const getPotentialMatches = (otherUser) => {
    const userTeachSkills = user.skillsToTeach || []
    const userLearnSkills = user.skillsToLearn || []
    const otherTeachSkills = otherUser.skillsToTeach || []
    const otherLearnSkills = otherUser.skillsToLearn || []

    const matches = []
    
    // Skills I can teach that they want to learn
    userTeachSkills.forEach(skill => {
      if (otherLearnSkills.includes(skill)) {
        matches.push({ type: 'I can teach', skill, to: otherUser.name })
      }
    })

    // Skills they can teach that I want to learn
    otherTeachSkills.forEach(skill => {
      if (userLearnSkills.includes(skill)) {
        matches.push({ type: 'They can teach', skill, to: otherUser.name })
      }
    })

    return matches
  }

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div className="header-title">
            <span className="header-icon">👥</span>
            <h1>Discover Skills</h1>
          </div>
          <p>Find people to learn from and share your expertise.</p>
        </div>

        <div className="search-section">
          <div className="search-bar-wrapper">
            <div className="search-bar">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search by skill, name, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <select 
              className="filter-dropdown"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Skills</option>
              <option value="teach">Can Teach</option>
              <option value="learn">Want to Learn</option>
            </select>
          </div>
        </div>

        <div className="users-grid">
          {filteredUsers.length === 0 ? (
            <div className="no-results">
              <p>No users found. Try adjusting your search or filters.</p>
            </div>
          ) : (
            filteredUsers.map(otherUser => {
              const matches = getPotentialMatches(otherUser)
              return (
                <div 
                  key={otherUser.id} 
                  className="user-card-new clickable"
                  onClick={() => setSelectedUser(otherUser)}
                >
                  <div className="card-gradient-header"></div>
                  <div className="card-content">
                    <div className="user-avatar-new">
                      {otherUser.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="user-name-new">{otherUser.name}</div>
                    {otherUser.location && (
                      <div className="user-location">
                        <span className="location-icon">📍</span>
                        {otherUser.location}
                      </div>
                    )}
                    {otherUser.bio && (
                      <div className="user-greeting">{otherUser.bio}</div>
                    )}
                    
                    <div className="skills-section-new">
                      {otherUser.skillsToTeach && otherUser.skillsToTeach.length > 0 && (
                        <div className="skills-group-new">
                          <div className="skills-label">CAN TEACH</div>
                          <div className="skills-list-new">
                            {otherUser.skillsToTeach.map((skill, idx) => (
                              <span key={idx} className="skill-tag-new teach">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {otherUser.skillsToLearn && otherUser.skillsToLearn.length > 0 && (
                        <div className="skills-group-new">
                          <div className="skills-label">WANTS TO LEARN</div>
                          <div className="skills-list-new">
                            {otherUser.skillsToLearn.map((skill, idx) => (
                              <span key={idx} className="skill-tag-new learn">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="card-action-new" onClick={(e) => e.stopPropagation()}>
                      <button 
                        className="view-profile-btn-new"
                        onClick={() => setSelectedUser(otherUser)}
                      >
                        View Profile & Connect →
                      </button>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
      {selectedUser && (
        <UserDetail
          user={user}
          otherUser={selectedUser}
          onClose={() => setSelectedUser(null)}
          onUpdate={() => {
            // Refresh users list if needed
            const allUsers = JSON.parse(localStorage.getItem('users') || '[]')
            const otherUsers = allUsers.filter(u => u.id !== user.id)
            setUsers(otherUsers)
          }}
        />
      )}
    </div>
  )
}

export default Dashboard

